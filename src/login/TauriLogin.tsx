import { useState } from "react"
import { open } from "@tauri-apps/plugin-shell"
import { oidcSettingsDesktop } from "@/auth/config/authConfig"
import { Button } from "../common/components/ui/button"
import { LogIn } from "lucide-react"
import { saveTokens } from "@/axios/AxiosTauriAuthBinding"

interface DeviceAuthResponse {
    device_code: string
    user_code: string
    verification_uri: string
    verification_uri_complete?: string
    expires_in: number
    interval: number
}

export const TauriLogin = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [userCode, setUserCode] = useState<string | null>(null)

    const handleLogin = async () => {
        setIsLoading(true)
        setError(null)
        setUserCode(null)

        try {
            const deviceRes = await fetch(oidcSettingsDesktop.deviceAuthorizationUrl, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({
                    client_id: oidcSettingsDesktop.client_id,
                    scope: oidcSettingsDesktop.scope,
                }),
            })

            if (!deviceRes.ok) throw new Error(`Device authorization failed: ${deviceRes.status}`)

            const device: DeviceAuthResponse = await deviceRes.json()
            setUserCode(device.user_code)

            await open(device.verification_uri_complete ?? device.verification_uri)

            let intervalMs = (device.interval || 5) * 1000
            const deadline = Date.now() + device.expires_in * 1000

            const poll = async (): Promise<{ access_token: string; refresh_token: string }> => {
                while (Date.now() < deadline) {
                    await new Promise((res) => setTimeout(res, intervalMs))

                    const tokenRes = await fetch(oidcSettingsDesktop.tokenUrl, {
                        method: "POST",
                        headers: { "Content-Type": "application/x-www-form-urlencoded" },
                        body: new URLSearchParams({
                            grant_type: "urn:ietf:params:oauth:grant-type:device_code",
                            device_code: device.device_code,
                            client_id: oidcSettingsDesktop.client_id,
                        }),
                    })

                    if (tokenRes.ok) {
                        return await tokenRes.json()
                    }

                    const body = await tokenRes.json().catch(() => ({}))
                    if (body.error === "authorization_pending") continue
                    if (body.error === "slow_down") {
                        intervalMs += 5000 // per RFC 8628, back off by 5s and keep that pace
                        continue
                    }
                    throw new Error(body.error ?? `Token request failed: ${tokenRes.status}`)
                }
                throw new Error("Device code expired. Please try again.")
            }

            const data = await poll()
            await saveTokens(data.access_token, data.refresh_token)

            window.location.href = "/"
        } catch (err) {
            console.error("[TauriLogin] Login failed:", err)
            setError("Sign in failed. Please try again.")
        } finally {
            setIsLoading(false)
            setUserCode(null)
        }
    }

    return (
        <div className="flex h-screen w-screen items-center justify-center bg-background">
            <div className="w-full max-w-sm space-y-8 px-6">
                <div className="space-y-2 text-center">
                    <h2 className="text-2xl font-heading tracking-tight text-foreground">
                        Welcome <span className="text-secondary">Back!</span>
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Sign in to access Kutumb
                    </p>
                </div>

                <Button
                    onClick={handleLogin}
                    disabled={isLoading}
                    className="h-12 w-full gap-2.5 bg-secondary hover:bg-secondary/95 rounded-lg text-base font-heading shadow-md transition-shadow hover:shadow-lg"
                    size="lg"
                >
                    <LogIn className="h-5 w-5" />
                    {isLoading ? "Waiting for browser sign in..." : "Sign in"}
                </Button>

                {userCode && (
                    <p className="text-center text-sm text-muted-foreground">
                        If prompted, confirm this code in your browser: <span className="font-mono font-semibold text-foreground">{userCode}</span>
                    </p>
                )}

                {error && (
                    <p className="text-center text-sm text-destructive">{error}</p>
                )}
            </div>
        </div>
    )
}