import { isTauri } from "@tauri-apps/api/core"
import { useLocation } from "react-router-dom"
import { useAuth } from "react-oidc-context"
import { Button } from "../common/components/ui/button"
import loginHero from "@/assets/login-hero.jpg"
import fybrosLogo from "@/assets/fybros-logo.png"
import { LogIn } from "lucide-react"

const Login = () => {
  return isTauri() ? null : <WebLogin />
}

export default Login

const WebLogin = () => {
  const auth = useAuth()
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const redirectTo =
    params.get("redirectTo") || sessionStorage.getItem("redirectTo") || "/"

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Left – Hero */}
      <div className="relative hidden overflow-hidden lg:flex lg:w-[55%]">
        <img
          src={loginHero}
          alt="Kutumb illustration"
          className="absolute inset-0 h-full w-full object-cover"
          width={1024}
          height={1536}
        />

        <div className="absolute inset-0 bg-linear-to-b from-[hsl(221,36%,12%)/0.6] via-[hsl(221,36%,12%)/0.4] to-[hsl(221,36%,12%)/0.8]" />


      </div>

      {/* Right – Login */}
      <div className="flex flex-1 flex-col items-center justify-center bg-background px-6">
        {/* Mobile logo */}
        <div className="mb-10 flex items-center gap-3 lg:hidden">
          <img
            src={fybrosLogo}
            alt="Fybros"
            className="h-8 w-8 invert dark:invert-0"
            width={32}
            height={32}
          />
          <span className="text-xl font-bold tracking-tight text-foreground">
            Fybros Kutumb
          </span>
        </div>

        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Welcome back
            </h2>
            <p className="text-sm text-muted-foreground">
              Sign in to access Kutumb
            </p>
          </div>

          <Button
            onClick={async () => {
              sessionStorage.removeItem("redirectTo")
              await auth.signinRedirect({ state: { redirectTo } })
            }}
            className="h-12 w-full gap-2.5 rounded-lg text-base font-semibold shadow-md transition-shadow hover:shadow-lg"
            size="lg"
          >
            <LogIn className="h-5 w-5" />
            Sign in
          </Button>

          <p className="pt-4 text-center text-xs text-muted-foreground">
            By signing in you agree to Fybros{" "}
            <span className="cursor-pointer underline transition-colors hover:text-foreground">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="cursor-pointer underline transition-colors hover:text-foreground">
              Privacy Policy
            </span>
          </p>
        </div>

        <p className="absolute bottom-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Fybros. All rights reserved.
        </p>
      </div>
    </div>
  )
}