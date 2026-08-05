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

const HomePage = () => {
  const auth = useAuth();

  const name = auth.user?.profile.name ?? "User";
  const email = auth.user?.profile.email ?? "-";

  return (
    <div className="space-y-8 p-6">
      {/* Hero Section */}
      <Card className="border-0 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg">
        <CardContent className="flex flex-col gap-2 py-10">
          <h1 className="text-4xl font-bold">
            Welcome back, {name} 👋
          </h1>

          <p className="text-primary-foreground/80">
            You're successfully signed in to <strong>Kutumb</strong>.
          </p>
        </CardContent>
      </Card>

      {/* User Info */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              User
            </CardTitle>

            <UserCircle2 className="h-5 w-5 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-xl font-semibold">{name}</div>
            <CardDescription>{email}</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Business Partners
            </CardTitle>

            <Building2 className="h-5 w-5 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-3xl font-bold">1</div>
            <CardDescription>
              Connected business partner
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Status
            </CardTitle>

            <ShieldCheck className="h-5 w-5 text-green-600" />
          </CardHeader>

          <CardContent>
            <div className="text-xl font-semibold text-green-600">
              Active
            </div>

            <CardDescription>
              Authentication successful
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Account
            </CardTitle>

            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-xl font-semibold">Kutumb</div>

            <CardDescription>
              SAP Business Portal
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Quick Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Overview</CardTitle>

          <CardDescription>
            Use the sidebar to navigate through the available modules.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <span>🏠 Home Dashboard</span>
            <span className="font-medium text-foreground">Available</span>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <span>👥 Business Partners</span>
            <span className="font-medium text-foreground">Available</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomePage;