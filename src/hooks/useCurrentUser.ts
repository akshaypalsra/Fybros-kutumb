import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { isTauri } from "@tauri-apps/api/core";
import { useUserApi } from "@/api/user/useUserApi";
import { clearTokens } from "@/axios/AxiosTauriAuthBinding";

export function useCurrentUser() {
  const auth = !isTauri() ? useAuth() : null;
  const { getMyDetails } = useUserApi();

  const isAuthenticated = isTauri() ? true : !!auth?.isAuthenticated;

  const { data: me, isPending, isError, error } = useQuery({
    queryKey: ["me"],
    queryFn: getMyDetails,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });

  const logout = useCallback(async () => {
    sessionStorage.removeItem("redirectTo");
    if (isTauri()) {
      await clearTokens();
      window.location.href = "/login";
    } else {
      await auth?.signoutRedirect();
    }
  }, [auth]);

  return {
    me,
    isPending,
    isError,
    error,

    displayName: me?.name ?? auth?.user?.profile.name ?? "User",
    email: me?.email ?? auth?.user?.profile.email,
    code: me?.crCode ?? '-',
    avatarUrl: auth?.user?.profile.picture,
    logout,
  };
}