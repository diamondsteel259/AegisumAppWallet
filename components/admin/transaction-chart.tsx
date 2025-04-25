"use client"

import { useState, useEffect } from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"

interface ChartData {
  date: string
  volume: number
  count: number
}

export function TransactionChart() {
  const [data, setData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchChartData() {
      try {
        const response = await fetch("/api/admin/transactions/chart")
        const result = await response.json()

        if (result.success) {
          setData(result.data)
        } else {
          setError(result.error || "Failed to load chart data")
        }
      } catch (err) {
        setError("Error loading chart data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchChartData()
  }, [])

  if (loading) {
    return <Skeleton className="h-[300px] w-full" />
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis yAxisId="left" orientation="left" stroke="#2C4079" />
        <YAxis yAxisId="right" orientation="right" stroke="#327744" />
        <Tooltip />
        <Area
          yAxisId="left"
          type="monotone"
          dataKey="volume"
          stroke="#2C4079"
          fill="#2C4079"
          fillOpacity={0.3}
          name="Volume (AEG)"
        />
        <Area
          yAxisId="right"
          type="monotone"
          dataKey="count"
          stroke="#327744"
          fill="#327744"
          fillOpacity={0.3}
          name="Transaction Count"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
