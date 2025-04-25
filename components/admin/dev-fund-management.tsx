"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface DevFundData {
  balance: number
  totalCollected: number
  lastWithdrawal: string | null
  withdrawalAddress: string
}

export function DevFundManagement() {
  const [data, setData] = useState<DevFundData | null>(null)
  const [withdrawalAmount, setWithdrawalAmount] = useState("")
  const [withdrawalAddress, setWithdrawalAddress] = useState("")
  const [loading, setLoading] = useState(true)
  const [withdrawing, setWithdrawing] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    async function fetchDevFundData() {
      try {
        const response = await fetch("/api/admin/dev-fund")
        const result = await response.json()

        if (result.success) {
          setData(result.data)
          setWithdrawalAddress(result.data.withdrawalAddress || "")
        } else {
          setError(result.error || "Failed to load dev fund data")
        }
      } catch (err) {
        setError("Error loading dev fund data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchDevFundData()
  }, [])

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault()
    setWithdrawing(true)
    setError("")
    setSuccess("")

    // Validate inputs
    if (!withdrawalAmount || isNaN(Number(withdrawalAmount)) || Number(withdrawalAmount) <= 0) {
      setError("Valid amount is required")
      setWithdrawing(false)
      return
    }

    if (!withdrawalAddress) {
      setError("Withdrawal address is required")
      setWithdrawing(false)
      return
    }

    try {
      const response = await fetch("/api/admin/dev-fund", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number(withdrawalAmount),
          address: withdrawalAddress,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setSuccess(`Successfully withdrew ${withdrawalAmount} AEG to ${withdrawalAddress}`)
        setWithdrawalAmount("")

        // Refresh data
        setData(result.data)
      } else {
        setError(result.error || "Withdrawal failed")
      }
    } catch (err) {
      setError("Error processing withdrawal")
      console.error(err)
    } finally {
      setWithdrawing(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading dev fund data...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Development Fund Management</CardTitle>
        <CardDescription>Manage the Aegisum development fund</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {data && (
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Current Balance</span>
                <span className="text-sm font-medium">{data.balance.toFixed(8)} AEG</span>
              </div>
              <Progress value={100} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#E8F1F8] p-4 rounded-lg">
                <div className="text-sm text-gray-500">Total Collected</div>
                <div className="text-xl font-bold text-[#2C4079]">{data.totalCollected.toFixed(8)} AEG</div>
              </div>
              <div className="bg-[#E8F1F8] p-4 rounded-lg">
                <div className="text-sm text-gray-500">Last Withdrawal</div>
                <div className="text-xl font-bold text-[#2C4079]">
                  {data.lastWithdrawal ? new Date(data.lastWithdrawal).toLocaleDateString() : "Never"}
                </div>
              </div>
            </div>

            <form onSubmit={handleWithdraw} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="withdrawal-amount">Withdrawal Amount (AEG)</Label>
                <Input
                  id="withdrawal-amount"
                  type="number"
                  step="0.00000001"
                  min="0.00000001"
                  max={data.balance}
                  placeholder="0.0"
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                  disabled={withdrawing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="withdrawal-address">Withdrawal Address</Label>
                <Input
                  id="withdrawal-address"
                  placeholder="aegs1..."
                  value={withdrawalAddress}
                  onChange={(e) => setWithdrawalAddress(e.target.value)}
                  disabled={withdrawing}
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div>{error}</div>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-600 p-3 rounded-md flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div>{success}</div>
                </div>
              )}
            </form>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          onClick={handleWithdraw}
          disabled={
            withdrawing || !withdrawalAmount || !withdrawalAddress || (data && Number(withdrawalAmount) > data.balance)
          }
          className="ml-auto"
        >
          {withdrawing ? "Processing..." : "Withdraw Funds"}
        </Button>
      </CardFooter>
    </Card>
  )
}
