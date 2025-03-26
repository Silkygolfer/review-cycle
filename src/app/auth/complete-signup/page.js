import { PasswordSetupForm } from "@/components/auth/invite-signup/password-setup-form";

export default async function CompleteSignupPage() {
    return (
      <div>
        <h1>Complete Your Registration</h1>
        <PasswordSetupForm />
      </div>
    );
  }