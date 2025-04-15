import getReviewData from "@/api/GET/core/reviews/get-review-data";
import ReviewImageMarker from "@/components/reviews/review-image-marker";

export default async function ReviewWizardPage({ params, searchParams }) {
    // get review_id from params
    const { reviewid } = await params;

    // get reviewData
    let reviewData;
    try {
        const result = await getReviewData(reviewid);
        if (result.error) {
            return <div className="flex items-center justify-center text-red-700 h-full w-[60%]">Please contact your systems administrator - {result.error}</div>
        }
        reviewData = result.reviewData;
    } catch (error) {
        console.error('Error: ', error)
    }

    return (
        <div className="flex p-2 w-full">
            <ReviewImageMarker
            reviewData={reviewData}
            />
        </div>
    ) 
}