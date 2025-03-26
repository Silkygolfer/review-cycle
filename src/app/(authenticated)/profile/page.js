import ProfileDetailsForm from "@/components/profiles/profile-page-details-form";
import getProfile from "@/api/GET/core/profile/get-profile";

export default async function ProfilePage() {
    const { userData } = await getProfile();
    
    
    return (
        <div className="flex flex-col items-center w-full p-8">
            <ProfileDetailsForm initialProfileState={userData} />
        </div>
    )
}