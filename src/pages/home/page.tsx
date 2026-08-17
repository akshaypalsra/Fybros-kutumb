import { useAuth } from "react-oidc-context";
import {
  Building2,
  Users,
  ShieldCheck,
  UserCircle2,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/common/components/ui/card";
import { Badge } from "@/common/components/ui/badge";

const HomePage = () => {
  const auth = useAuth();
  const name = auth.user?.profile.name ?? "User";
  const email = auth.user?.profile.email ?? "-";
  console.log("auth.user", auth.user?.profile);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="rounded-xl bg-secondary p-8 text-white shadow-sm">
        <h1 className="text-3xl font-bold">Welcome back, {name} 👋</h1>
        <p className="mt-1 text-sm text-white/80">
          You're successfully signed in to <strong>Kutumb</strong>.
        </p>
      </div>

     
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="rounded-xl border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">User</CardTitle>
            <UserCircle2 className="h-5 w-5 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold text-foreground">{name}</div>
            <CardDescription>{email}</CardDescription>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Business Partners</CardTitle>
            <Building2 className="h-5 w-5 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">1</div>
            <CardDescription>Connected business partner</CardDescription>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <Badge
              variant="outline"
              className="rounded-full border-emerald-200 bg-emerald-100 px-3 py-0.5 text-xs font-semibold text-emerald-700"
            >
              Active
            </Badge>
            <CardDescription className="mt-2">Authentication successful</CardDescription>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Account</CardTitle>
            <Users className="h-5 w-5 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold text-foreground">Kutumb</div>
            <CardDescription>SAP Business Portal</CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Quick Overview */}
      <Card className="rounded-xl border-border">
        <CardHeader>
          <CardTitle>Quick Overview</CardTitle>
          <CardDescription>
            Use the sidebar to navigate through the available modules.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-border p-4 text-sm">
            <span className="text-muted-foreground">🏠 Home Dashboard</span>
            <Badge
              variant="outline"
              className="rounded-full border-emerald-200 bg-emerald-100 px-3 py-0.5 text-xs font-semibold text-emerald-700"
            >
              Available
            </Badge>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-4 text-sm">
            <span className="text-muted-foreground">👥 Business Partners</span>
            <Badge
              variant="outline"
              className="rounded-full border-emerald-200 bg-emerald-100 px-3 py-0.5 text-xs font-semibold text-emerald-700"
            >
              Available
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomePage;