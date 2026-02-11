import { Button } from "@repo/ui/button";
import Auth from "auth/auth";

function App() {
  return (
    <>
      <h1>Web Host Application</h1>
      <Button>Hello from Web Host!</Button>

      <hr />

      <h2>Auth MFE:</h2>
      <Auth />
    </>
  );
}

export default App;
