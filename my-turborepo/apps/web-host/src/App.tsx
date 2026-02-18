import Auth from "auth/auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@repo/ui";

// Create a client
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
      {/* O Toaster deve ser colocado no nível mais alto possível para garantir que os toasts sejam exibidos corretamente em toda a aplicação */}
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
