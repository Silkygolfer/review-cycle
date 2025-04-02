'use client'

import { useState } from 'react';

/**
 * CommentForm component for adding new comments
 * 
 * @param {Object} props
 * @param {function} props.onSubmit - Handler for comment submission
 * @param {function} props.onCancel - Handler for canceling comment creation
 * @param {string} [props.initialValue] - Initial text value
 */
export const CommentForm = ({ 
  onSubmit, 
  onCancel, 
  initialValue = ''
}) => {
  const [text, setText] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text);
      setText('');
    }
  };

  return (
    <div className="mt-4 p-4 border rounded-md bg-gray-50">
      <h3 className="text-lg font-medium mb-2">Add Comment</h3>
      <form onSubmit={handleSubmit}>
        <textarea 
          className="w-full p-2 border rounded-md mb-2"
          rows="3"
          placeholder="Enter your comment here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="flex justify-end space-x-2">
          <button 
            type="button"
            className="px-4 py-2 bg-gray-200 rounded-md"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
            disabled={!text.trim()}
          >
            Add Comment
          </button>
        </div>
      </form>
    </div>
  );
};

/**
 * CommentItem component for displaying a single comment
 * 
 * @param {Object} props
 * @param {Object} props.comment - Comment data object
 * @param {number} props.number - Comment number/index
 * @param {boolean} [props.isActive] - Whether this comment is active/selected
 * @param {function} [props.onClick] - Handler for clicking on the comment
 */
export const CommentItem = ({ 
  comment, 
  number, 
  isActive = false, 
  onClick 
}) => {
  return (
    <div 
      className={`p-3 flex items-start border-b 
                 ${isActive ? 'bg-blue-50' : ''}`}
      onClick={() => onClick && onClick(comment.id)}
    >
      <div className={`mr-3 rounded-full w-6 h-6 flex items-center justify-center
                      ${isActive ? 'bg-blue-500' : 'bg-red-500'} text-white`}>
        {number}
      </div>
      <div className="flex-1">
        <div className="text-sm text-gray-500">
          {comment.author && `${comment.author} · `}
          {comment.timestamp && new Date(comment.timestamp).toLocaleString()}
        </div>
        <div>{comment.text}</div>
      </div>
    </div>
  );
};

/**
 * CommentList component for displaying a list of comments
 * 
 * @param {Object} props
 * @param {Array} props.comments - Array of comment objects
 * @param {string} [props.activeCommentId] - ID of the currently active comment
 * @param {function} [props.onCommentClick] - Handler for comment click events
 */
export const CommentList = ({ 
  comments = [], 
  activeCommentId, 
  onCommentClick 
}) => {
  if (!comments || comments.length === 0) {
    return (
      <div className="mt-4 text-gray-500 text-center p-4 border rounded-md">
        No comments yet
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h3 className="text-lg font-medium mb-2">Comments</h3>
      <div className="border rounded-md overflow-hidden">
        {comments.map((comment, index) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            number={index + 1}
            isActive={comment.id === activeCommentId}
            onClick={onCommentClick}
          />
        ))}
      </div>
    </div>
  );
};