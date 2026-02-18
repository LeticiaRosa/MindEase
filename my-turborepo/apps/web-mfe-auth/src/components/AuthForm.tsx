import { useState } from "react";
import { SignIn } from "./SignIn";
import { SignUp } from "./SignUp";
// import { useAuth } from '../hooks/userAuth'

export function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  // const { user } = useAuth()

  const toggleMode = () => setIsSignUp(!isSignUp);

  /*
  if (user) {
    return <UserProfile />
  }
    */

  return isSignUp ? (
    <div className="flex flex-col items-center justify-center min-h-md min-w-md">
      <SignUp onToggleMode={toggleMode} />
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center min-h-md min-w-md">
      <SignIn onToggleMode={toggleMode} />
    </div>
  );
}
