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
      <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-r from-amber-400 to-amber-700">
        <AuthForm />
      </div>
    </QueryClientProvider>
  );
}

export default App;
