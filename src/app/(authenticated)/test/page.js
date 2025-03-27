import BasicImageDialog from "./test-components/image-annotation-test-component";

const image_url = 'https://zchkrqcmywmtlcwbxpgh.supabase.co/storage/v1/object/public/Review-Approval/deliverables/Screenshot%202025-03-26%20at%208.56.45%20AM.png';


export default function TestPage() {
    return (
            <BasicImageDialog
            imageUrl={image_url} />
    )
}