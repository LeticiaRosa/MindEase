import { SignUp } from "@/presentation/components/SignUp";

export default function RegisterPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-r from-amber-300 to-amber-800">
      <div className="flex flex-col items-center justify-center min-h-md min-w-md">
        <SignUp />
      </div>
    </div>
  );
}
