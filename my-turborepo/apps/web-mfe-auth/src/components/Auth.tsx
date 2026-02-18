import { useState } from "react";
import { SignIn } from "./SignIn";
import { SignUp } from "./SignUp";
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-amber-300 to-amber-800">
      {isSignUp ? (
        <div className="flex flex-col items-center justify-center min-h-md min-w-md">
          <SignUp onToggleMode={toggleMode} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-md min-w-md">
          <SignIn onToggleMode={toggleMode} />
        </div>
      )}
    </div>
  );
}
