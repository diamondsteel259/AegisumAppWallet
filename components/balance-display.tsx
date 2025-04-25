"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowUpRight, ArrowDownRight, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export function BalanceDisplay() {
  const [balance, setBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchBalance = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/blockchain/balance")
      const data = await response.json()

      if (data.success) {
        setBalance(data.balance)
      } else {
        setError("Failed to load balance")
      }
    } catch (error) {
      setError("Error loading balance")
      console.error("Error fetching balance:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBalance()
  }, [])

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-[#2C4079] to-[#327744] text-white">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-white">Balance</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={fetchBalance}
            className="text-white hover:text-white hover:bg-white/10"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>
        <p className="text-sm text-white/80">Your current Aegisum balance</p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-6">
          {loading ? (
            <Skeleton className="h-12 w-3/4 bg-white/10" />
          ) : error ? (
            <div className="text-red-200">{error}</div>
          ) : (
            <div className="flex flex-col">
              <span className="text-4xl font-bold tracking-tight">{balance?.toFixed(8)} AEG</span>
              <div className="mt-4 flex space-x-4">
                <div className="flex items-center space-x-1 text-emerald-300">
                  <ArrowUpRight className="h-4 w-4" />
                  <span className="text-sm">Receive</span>
                </div>
                <div className="flex items-center space-x-1 text-amber-300">
                  <ArrowDownRight className="h-4 w-4" />
                  <span className="text-sm">Send</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
