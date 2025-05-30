import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <SignIn
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
