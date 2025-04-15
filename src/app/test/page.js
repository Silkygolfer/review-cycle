import CampaignForm from "@/components/campaigns/create-campaign-form";

export default function TestPage() {
    return (
        <div className="flex h-full w-full items-center justify-center">
            <CampaignForm
            client_id={'3de49b92-5147-4b10-969c-95fd4e1364e0'} />
        </div>
    )
}