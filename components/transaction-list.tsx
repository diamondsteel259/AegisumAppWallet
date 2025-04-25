"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownRight, RefreshCw, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatDate, shortenAddress } from "@/lib/utils"

interface Transaction {
  id: string
  type: "send" | "receive"
  amount: number
  fee: number
  timestamp: string
  address: string
  status: "confirmed" | "pending" | "failed"
}

export function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchTransactions = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/blockchain/transactions")
      const data = await response.json()

      if (data.success) {
        setTransactions(data.transactions)
      } else {
        setError("Failed to load transactions")
      }
    } catch (error) {
      setError("Error loading transactions")
      console.error("Error fetching transactions:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "secondary"
      case "pending":
        return "default"
      case "failed":
        return "destructive"
      default:
        return "default"
    }
  }

  const getExplorerUrl = (txId: string) => {
    return `https://explorer.aegisum.com/tx/${txId}`
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-[#2C4079]">Transactions</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={fetchTransactions}
            className="text-[#2C4079] hover:text-[#2C4079] hover:bg-[#E8F1F8]"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>
        <p className="text-sm text-gray-500">Recent transaction history</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-6 text-gray-500">No transactions found</div>
          ) : (
            <div className="divide-y divide-[#E8F1F8]">
              {transactions.map((tx) => (
                <div key={tx.id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full ${
                          tx.type === "receive" ? "bg-emerald-100" : "bg-amber-100"
                        }`}
                      >
                        {tx.type === "receive" ? (
                          <ArrowUpRight className="h-5 w-5 text-emerald-600" />
                        ) : (
                          <ArrowDownRight className="h-5 w-5 text-amber-600" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">
                          {tx.type === "receive" ? "Received" : "Sent"}{" "}
                          <span className="font-mono">{tx.amount.toFixed(8)} AEG</span>
                        </div>
                        <div className="text-sm text-gray-500 flex items-center space-x-1">
                          <span>{formatDate(new Date(tx.timestamp))}</span>
                          <span>•</span>
                          <span>{shortenAddress(tx.address)}</span>
                          <a
                            href={getExplorerUrl(tx.id)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center ml-1 text-[#2C4079] hover:underline"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                    <Badge variant={getStatusColor(tx.status)}>{tx.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
