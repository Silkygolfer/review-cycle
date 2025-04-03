import getRevisionComments from "@/api/GET/core/comments/get-revision-comments";
import ReviewImageMarker from "@/components/review-cycle/review-image-marker";

export default async function ReviewWizardPage({ params, searchParams }) {
    const { reviewid } = await params;
    const { url } = await searchParams;
    const { commentData } = await getRevisionComments(reviewid);

    return (
        <div className="flex p-2 w-full">
            <ReviewImageMarker
            review_id={reviewid}
            url={url}
            initialMarkers={commentData}
            />
        </div>
    ) 
}