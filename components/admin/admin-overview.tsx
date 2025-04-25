"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { TransactionChart } from "@/components/admin/transaction-chart"

interface StatsData {
  totalUsers: number
  activeWallets: number
  totalTransactions: number
  totalVolume: number
  devFundBalance: number
  averageFee: number
}

export function AdminOverview() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/admin/stats")
        const data = await response.json()

        if (data.success) {
          setStats(data.stats)
        } else {
          setError(data.error || "Failed to load stats")
        }
      } catch (err) {
        setError("Error loading stats")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#2C4079]">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20" />
              </CardContent>
            </Card>
          ))
        ) : error ? (
          <div className="col-span-3 text-red-500">{error}</div>
        ) : stats ? (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Active Wallets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeWallets}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalTransactions}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalVolume.toFixed(8)} AEG</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Dev Fund Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.devFundBalance.toFixed(8)} AEG</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Average Fee</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.averageFee.toFixed(8)} AEG</div>
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction Volume</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <div className="h-[300px]">
              <TransactionChart />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
