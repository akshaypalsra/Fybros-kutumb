import { Button } from "@/common/components/ui/button"
import { useSingleUser } from "@/common/hooks/useSingleUser"
import { AppNavbar } from "@/navbar/AppNavbar"
import { AppSidebar } from "@/sidebar/AppSidebar"
import { isTauri } from "@tauri-apps/api/core"
import { useEffect, useState } from "react"
import { useAuth } from "react-oidc-context"
import { Outlet, useNavigate, useParams } from "react-router-dom"

const ProjectNavigator = () => {
  const params = useParams()
  const navigate = useNavigate()
  const { user } = useSingleUser()
  const auth = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const hasNoProjects = user && user.projects.length === 0
  const hasNoResolvedProject = !user?.projects?.[0]?.id

  const shouldDenyAccess = hasNoProjects || hasNoResolvedProject

  useEffect(() => {
    if (shouldDenyAccess) {
      navigate("/", { replace: true })
      return
    }
  }, [shouldDenyAccess])

  const handleLogout = async () => {
    if (isTauri()) {
      return null
    } else {
      await auth.signoutRedirect()
    }
  }

  if (shouldDenyAccess) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-semibold">No Projects Found</h1>
        <p className="text-center text-gray-600">
          It looks like you don't have access to any projects yet. Please
          contact your administrator to get started.
        </p>
        <Button
          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          onClick={handleLogout}
          variant="link"
        >
          Login with a different account
        </Button>
      </div>
    )
  }

  if (
    !(
      params.projectId &&
      user.projects.find((p) => p.id === Number(params.projectId))
    )
  ) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-semibold">Project access denied</h1>
        <p className="text-center text-gray-600">
          It looks like you don't have access to this project. Please contact
          your administrator to get started.
        </p>
        <Button
          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          onClick={handleLogout}
          variant="link"
        >
          Login with a different account
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar isOpen={sidebarOpen} />
      <AppNavbar
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />
      <div
        className="min-h-[calc(100vh-3.5rem)] bg-content-area transition-all duration-300"
        style={{ marginLeft: sidebarOpen ? "16rem" : "0" }}
      >
        <Outlet />
      </div>
    </div>
  )
}

export default ProjectNavigator
