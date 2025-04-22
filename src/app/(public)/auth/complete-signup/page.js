import { PasswordSetupForm } from "@/components/auth/invite-signup/password-setup-form";

export default async function CompleteSignupPage() {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <PasswordSetupForm />
      </div>
    </div>
    );
  }