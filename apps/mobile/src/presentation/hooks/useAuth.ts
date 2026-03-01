import { useAuthContext } from "@/presentation/contexts/AuthContext";

export function useAuth() {
  return useAuthContext();
}
