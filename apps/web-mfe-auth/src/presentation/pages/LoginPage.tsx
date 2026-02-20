import { SignIn } from "@/presentation/components/SignIn";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-r from-amber-300 to-amber-800">
      <div className="flex flex-col items-center justify-center min-h-md min-w-md">
        <SignIn />
      </div>
    </div>
  );
}
