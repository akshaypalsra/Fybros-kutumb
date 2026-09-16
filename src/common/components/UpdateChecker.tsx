import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { getVersion } from "@tauri-apps/api/app";
import { Button } from "@/common/components/ui/button";
import { Download, Loader2, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";

interface UpdateManifest {
  version: string;
  notes: string;
  pub_date: string;
  url: string;
}

type UpdateState =
  | { phase: "idle" }
  | { phase: "checking" }
  | { phase: "up-to-date" }
  | { phase: "available"; update: UpdateManifest }
  | { phase: "installing" }
  | { phase: "error"; message: string };

const MANIFEST_URL = "https://github.com/akshaypalsra/Fybros-kutumb/releases/latest/download/latest.json";

export function UpdateChecker() {
  const [state, setState] = useState<UpdateState>({ phase: "idle" });
  const [currentVersion, setCurrentVersion] = useState<string | null>(null);

  useEffect(() => {
    getVersion()
      .then(setCurrentVersion)
      .catch(() => setCurrentVersion(null));
  }, []);

  async function handleCheck() {
    setState({ phase: "checking" });
    try {
      const version = currentVersion ?? (await getVersion());
      const update = await invoke<UpdateManifest | null>("check_for_updates_manual", {
        currentVersion: version,
        manifestUrl: MANIFEST_URL,
      });

      if (update) {
        setState({ phase: "available", update });
      } else {
        setState({ phase: "up-to-date" });
        setTimeout(() => setState({ phase: "idle" }), 2500);
      }
    } catch (e) {
      setState({ phase: "error", message: e instanceof Error ? e.message : String(e) });
    }
  }

  async function handleInstall(update: UpdateManifest) {
    setState({ phase: "installing" });
    try {
      await invoke("install_update_manual", { downloadUrl: update.url });
    } catch (e) {
      setState({ phase: "error", message: e instanceof Error ? e.message : String(e) });
    }
  }

  return (
    <div className="border-t px-3 py-2.5 text-sm">
      {state.phase === "idle" && (
        <button
          onClick={handleCheck}
          className="flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <span className="flex items-center gap-2">
            <RefreshCw className="h-3.5 w-3.5" />
      <span className="text-xs">Check for updates</span>
          </span>
          {currentVersion && (
            <span className="text-[10px] tabular-nums text-muted-foreground/70">
              v{currentVersion}
            </span>
          )}
        </button>
      )}

      {state.phase === "checking" && (
        <div className="flex items-center justify-between gap-2 px-2 py-1.5 text-muted-foreground">
          <span className="flex items-center gap-2">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span className="text-xs">Checking for updates…</span>
          </span>
          {currentVersion && (
            <span className="text-[10px] tabular-nums text-muted-foreground/70">
              v{currentVersion}
            </span>
          )}
        </div>
      )}

      {state.phase === "up-to-date" && (
        <div className="flex items-center justify-between gap-2 px-2 py-1.5 text-muted-foreground">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span className="text-xs">You're up to date</span>
          </span>
          {currentVersion && (
            <span className="text-[10px] tabular-nums text-muted-foreground/70">
              v{currentVersion}
            </span>
          )}
        </div>
      )}

      {state.phase === "available" && (
        <div className="space-y-2 rounded-md bg-accent/50 p-2.5">
          <div className="flex items-start gap-2">
            <Download className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium leading-tight">
                Update available
              </p>
              <p className="text-xs text-muted-foreground">
                {currentVersion && `v${currentVersion} → `}v{state.update.version}
              </p>
            </div>
          </div>
          <Button
            size="sm"
            className="h-7 w-full text-xs"
            onClick={() => handleInstall(state.update)}
          >
            Install & restart
          </Button>
        </div>
      )}

      {state.phase === "installing" && (
        <div className="flex items-center justify-between gap-2 px-2 py-1.5 text-muted-foreground">
          <span className="flex items-center gap-2">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span className="text-xs">Installing update…</span>
          </span>
        </div>
      )}

      {state.phase === "error" && (
        <div className="space-y-1.5">
          <div className="flex items-start justify-between gap-2 px-2 py-1.5 text-destructive">
            <span className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span className="text-xs">{state.message}</span>
            </span>
            {currentVersion && (
              <span className="shrink-0 text-[10px] tabular-nums text-destructive/70">
                v{currentVersion}
              </span>
            )}
          </div>
          <button
            onClick={handleCheck}
            className="w-full rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}