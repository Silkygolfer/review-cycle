'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function AnnotationComment({ setComment, location }) {

    // set state for comment input value
    const [inputValue, setInputValue] = useState('');

    // function for handling submission of the comment
    const handleCommentSubmission = (e) => {
        e.preventDefault();
        setComment({
            comment: inputValue,
            location: location
        });

        setInputValue('');
    };

    return (
        <div className="flex">
            <form onSubmit={handleCommentSubmission} className="flex flex-col space-y-2">
                <Label>Comment</Label>
                <Input
                type="text"
                id="comment"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                />
                <Button
                variant={'outline'}
                type="submit"
                >Submit Comment</Button>
            </form>
        </div>
    )
};