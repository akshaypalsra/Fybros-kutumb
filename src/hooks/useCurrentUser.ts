import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { useUserApi } from "@/api/user/useUserApi";

export function useCurrentUser() {
  const auth = useAuth();
  const { getMyDetails } = useUserApi();

  const { data: me, isPending, isError, error } = useQuery({
    queryKey: ["me"],
    queryFn: getMyDetails,
    enabled: auth.isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });

  const logout = useCallback(async () => {
    sessionStorage.removeItem("redirectTo");
    await auth.signoutRedirect();
  }, [auth]);

  return {
    me,
    isPending,
    isError,
    error,
    displayName: me?.name ?? auth.user?.profile.name ?? "User",
    email: me?.email ?? auth.user?.profile.email,
    avatarUrl: auth.user?.profile.picture,
    logout,
  };
}