"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface AnalyticsData {
  totalSent: number
  totalReceived: number
  netChange: number
  transactionCount: number
  dailyVolume: {
    date: string
    sent: number
    received: number
  }[]
}

export function TransactionAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await fetch("/api/blockchain/analytics")
        const result = await response.json()

        if (result.success) {
          setData(result.data)
        } else {
          setError(result.error || "Failed to load analytics")
        }
      } catch (err) {
        setError("Error loading analytics")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-[#2C4079]">Transaction Analytics</CardTitle>
        <p className="text-sm text-gray-500">Overview of your wallet activity</p>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-[200px] w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : data ? (
          <div className="space-y-6">
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.dailyVolume}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => [`${value.toFixed(8)} AEG`, undefined]}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Bar dataKey="received" fill="#38A38F" name="Received" />
                  <Bar dataKey="sent" fill="#3A5495" name="Sent" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#E8F1F8] p-4 rounded-lg">
                <div className="text-sm text-gray-500">Total Sent</div>
                <div className="text-xl font-bold text-[#2C4079]">{data.totalSent.toFixed(8)} AEG</div>
              </div>
              <div className="bg-[#E8F1F8] p-4 rounded-lg">
                <div className="text-sm text-gray-500">Total Received</div>
                <div className="text-xl font-bold text-[#2C4079]">{data.totalReceived.toFixed(8)} AEG</div>
              </div>
              <div className="bg-[#E8F1F8] p-4 rounded-lg">
                <div className="text-sm text-gray-500">Net Change</div>
                <div className="text-xl font-bold text-[#2C4079]">{data.netChange.toFixed(8)} AEG</div>
              </div>
              <div className="bg-[#E8F1F8] p-4 rounded-lg">
                <div className="text-sm text-gray-500">Transaction Count</div>
                <div className="text-xl font-bold text-[#2C4079]">{data.transactionCount}</div>
              </div>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
