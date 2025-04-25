import { AdminOverview } from "@/components/admin/admin-overview"
import { FeeManagement } from "@/components/admin/fee-management"
import { DevFundManagement } from "@/components/admin/dev-fund-management"
import { SystemMonitoring } from "@/components/admin/system-monitoring"
import { BackupRestore } from "@/components/admin/backup-restore"
import { UserManagement } from "@/components/admin/user-management"
import { AdminSettings } from "@/components/admin/admin-settings"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/layout/header"

export default function AdminPage() {
  return (
    <main>
      <Header />
      <div className="container mx-auto py-6 px-4 md:px-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="fees">Fees</TabsTrigger>
            <TabsTrigger value="dev-fund">Dev Fund</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="backup">Backup</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <AdminOverview />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="fees">
            <FeeManagement />
          </TabsContent>

          <TabsContent value="dev-fund">
            <DevFundManagement />
          </TabsContent>

          <TabsContent value="system">
            <SystemMonitoring />
          </TabsContent>

          <TabsContent value="backup">
            <BackupRestore />
          </TabsContent>

          <TabsContent value="settings">
            <AdminSettings />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
