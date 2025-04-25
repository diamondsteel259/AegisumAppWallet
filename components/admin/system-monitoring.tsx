"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SystemStatus {
  nodeStatus: "online" | "offline" | "syncing"
  blockHeight: number
  syncProgress: number
  peerCount: number
  cpuUsage: number
  memoryUsage: number
  diskUsage: number
  uptime: number
}

export function SystemMonitoring() {
  const [status, setStatus] = useState<SystemStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchSystemStatus = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/system")
      const data = await response.json()

      if (data.success) {
        setStatus(data.status)
      } else {
        setError(data.error || "Failed to load system status")
      }
    } catch (err) {
      setError("Error loading system status")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSystemStatus()

    // Set up polling every 30 seconds
    const interval = setInterval(fetchSystemStatus, 30000)

    return () => clearInterval(interval)
  }, [])

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / (3600 * 24))
    const hours = Math.floor((seconds % (3600 * 24)) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)

    return `${days}d ${hours}h ${minutes}m`
  }

  const getStatusBadge = (status: "online" | "offline" | "syncing") => {
    switch (status) {
      case "online":
        return <Badge variant="secondary">Online</Badge>
      case "offline":
        return <Badge variant="destructive">Offline</Badge>
      case "syncing":
        return <Badge variant="default">Syncing</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>System Monitoring</CardTitle>
            <CardDescription>Aegisum node status and system resources</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={fetchSystemStatus}
            className="text-[#2C4079] hover:text-[#2C4079] hover:bg-[#E8F1F8]"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading && !status ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md flex items-start gap-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>{error}</div>
          </div>
        ) : status ? (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="bg-[#E8F1F8] p-4 rounded-lg flex-1">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm text-gray-500">Node Status</div>
                  {getStatusBadge(status.nodeStatus)}
                </div>
                <div className="text-xl font-bold text-[#2C4079] flex items-center gap-2">
                  {status.nodeStatus === "online" ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : status.nodeStatus === "syncing" ? (
                    <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                  {status.nodeStatus === "online"
                    ? "Operational"
                    : status.nodeStatus === "syncing"
                      ? "Syncing Blockchain"
                      : "Node Offline"}
                </div>
              </div>

              <div className="bg-[#E8F1F8] p-4 rounded-lg flex-1">
                <div className="text-sm text-gray-500 mb-2">Block Height</div>
                <div className="text-xl font-bold text-[#2C4079]">{status.blockHeight.toLocaleString()}</div>
              </div>

              <div className="bg-[#E8F1F8] p-4 rounded-lg flex-1">
                <div className="text-sm text-gray-500 mb-2">Connected Peers</div>
                <div className="text-xl font-bold text-[#2C4079]">{status.peerCount}</div>
              </div>

              <div className="bg-[#E8F1F8] p-4 rounded-lg flex-1">
                <div className="text-sm text-gray-500 mb-2">Uptime</div>
                <div className="text-xl font-bold text-[#2C4079]">{formatUptime(status.uptime)}</div>
              </div>
            </div>

            {status.nodeStatus === "syncing" && (
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Sync Progress</span>
                  <span className="text-sm font-medium">{status.syncProgress}%</span>
                </div>
                <Progress value={status.syncProgress} className="h-2" />
              </div>
            )}

            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">CPU Usage</span>
                  <span className="text-sm font-medium">{status.cpuUsage}%</span>
                </div>
                <Progress value={status.cpuUsage} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Memory Usage</span>
                  <span className="text-sm font-medium">{status.memoryUsage}%</span>
                </div>
                <Progress value={status.memoryUsage} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Disk Usage</span>
                  <span className="text-sm font-medium">{status.diskUsage}%</span>
                </div>
                <Progress value={status.diskUsage} className="h-2" />
              </div>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
