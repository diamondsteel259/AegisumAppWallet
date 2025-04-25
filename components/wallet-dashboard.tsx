"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BalanceDisplay } from "@/components/balance-display"
import { SendForm } from "@/components/send-form"
import { ReceiveForm } from "@/components/receive-form"
import { TransactionList } from "@/components/transaction-list"
import { WalletSwitcher } from "@/components/wallet-switcher"
import { WalletBackup } from "@/components/wallet-backup"
import { WalletSettings } from "@/components/wallet-settings"
import { TransactionAnalytics } from "@/components/transaction-analytics"

export function WalletDashboard() {
  return (
    <div className="container mx-auto py-6 px-4 md:px-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-[#2C4079]">Aegisum Wallet</h1>
        <WalletSwitcher />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-3">
          <BalanceDisplay />
        </div>

        <div className="md:col-span-2 space-y-6">
          <Tabs defaultValue="send" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="send" className="flex-1">
                Send
              </TabsTrigger>
              <TabsTrigger value="receive" className="flex-1">
                Receive
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex-1">
                Analytics
              </TabsTrigger>
            </TabsList>
            <TabsContent value="send">
              <SendForm />
            </TabsContent>
            <TabsContent value="receive">
              <ReceiveForm />
            </TabsContent>
            <TabsContent value="analytics">
              <TransactionAnalytics />
            </TabsContent>
          </Tabs>

          <TransactionList />
        </div>

        <div className="space-y-6">
          <WalletBackup />
          <WalletSettings />
        </div>
      </div>
    </div>
  )
}
