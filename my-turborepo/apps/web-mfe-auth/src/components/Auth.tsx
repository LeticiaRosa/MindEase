import { useEffect, useState } from "react";
import { SignIn } from "./SignIn";
import { SignUp } from "./SignUp";
import { useToast } from "@repo/ui";
// import { useAuth } from '../hooks/userAuth'

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  // const { user } = useAuth()

  const toggleMode = () => setIsSignUp(!isSignUp);

  /*
  if (user) {
    return <UserProfile />
  }
    */

  const toast = useToast();

  useEffect(() => {
    toast.error("Teste de toast de erro");
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-r from-amber-300 to-amber-800">
      <div className="flex flex-col items-center justify-center min-h-md min-w-md">
        {isSignUp ? (
          <SignUp onToggleMode={toggleMode} />
        ) : (
          <SignIn onToggleMode={toggleMode} />
        )}
      </div>
    </div>
  );
}
