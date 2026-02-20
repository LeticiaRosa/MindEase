import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Auth from "@/presentation/components/Auth";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
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
