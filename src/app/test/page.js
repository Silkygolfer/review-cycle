import ImageMarker from './components/image-marker';
import getRevisionComments from '@/api/GET/core/reviews/get-review-data';

export default async function TestPage() {
  const review_id = '77f34695-c920-4a2b-b54f-ea9eea4c8a79'
  const { commentData } = await getRevisionComments(review_id);
  const url = 'https://zchkrqcmywmtlcwbxpgh.supabase.co/storage/v1/object/public/Review-Approval/deliverables/web-9071484.png'
  
  return (
    <div className="flex p-4">
      <ImageMarker
      url={url}
      review_id={review_id}
      initialMarkers={commentData}
      />
    </div>
  );
}