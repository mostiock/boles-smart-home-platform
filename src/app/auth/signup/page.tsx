// Instructions: Create a sign-up page using Clerk authentication

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <SignUp
        appearance={{
          variables: {
            colorPrimary: "#43abc3",
            colorBackground: "#ffffff",
            colorInputBackground: "#ffffff",
            colorInputText: "#112137",
            colorText: "#112137",
            colorTextSecondary: "#8090af",
            borderRadius: "0.5rem",
          },
        }}
      />
    </div>
  );
}
