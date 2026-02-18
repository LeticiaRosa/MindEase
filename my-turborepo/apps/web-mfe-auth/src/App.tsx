import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Auth from "./components/Auth";

// Create a clients
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
      <Auth />
    </QueryClientProvider>
  );
}

export default App;
