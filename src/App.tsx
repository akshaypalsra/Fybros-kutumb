import { RouterProvider } from "react-router-dom"
import router from "./router/router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AuthProvider } from "react-oidc-context"
import { authConfig } from "./auth/config/authConfig"
import { isTauri } from "@tauri-apps/api/core"
import { AxiosTauriAuthBinding } from "./axios/AxiosTauriAuthBinding"


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__: import("@tanstack/query-core").QueryClient
  }
}

window.__TANSTACK_QUERY_CLIENT__ = queryClient

const App = () => {
  if (isTauri()) return <TauriApp />
  return <WebApp />
}

export default App

const TauriApp = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AxiosTauriAuthBinding />
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

const WebApp = () => {
  return (
    <AuthProvider {...authConfig}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </AuthProvider>
  )
}