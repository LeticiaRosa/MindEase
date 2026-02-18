import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthForm } from "./components/AuthForm";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-r from-amber-300 to-amber-800">
        <AuthForm />
      </div>
    </QueryClientProvider>
  );
}

export default App;
