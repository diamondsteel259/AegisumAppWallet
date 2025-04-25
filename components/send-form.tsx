"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle } from "lucide-react"

export function SendForm() {
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const [calculating, setCalculating] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [feeInfo, setFeeInfo] = useState<{
    fee: number
    networkFee: number
    devFundFee: number
    finalAmount: number
  } | null>(null)

  const calculateFee = async () => {
    if (!amount || isNaN(Number(amount))) {
      return
    }

    setCalculating(true)
    setError("")

    try {
      const response = await fetch("/api/blockchain/calculate-fee", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: Number(amount) }),
      })

      const data = await response.json()

      if (data.success) {
        setFeeInfo({
          fee: data.fee,
          networkFee: data.networkFee,
          devFundFee: data.devFundFee,
          finalAmount: data.finalAmount,
        })
      } else {
        setError(data.error || "Failed to calculate fee")
        setFeeInfo(null)
      }
    } catch (err) {
      setError("Error calculating fee")
      setFeeInfo(null)
      console.error(err)
    } finally {
      setCalculating(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    // Validate inputs
    if (!recipient) {
      setError("Recipient address is required")
      setLoading(false)
      return
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError("Valid amount is required")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/blockchain/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipient,
          amount: Number(amount),
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(`Successfully sent ${amount} AEG to ${recipient}`)
        setRecipient("")
        setAmount("")
        setFeeInfo(null)
      } else {
        setError(data.error || "Transaction failed")
      }
    } catch (err) {
      setError("Error sending transaction")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-[#2C4079]">Send</CardTitle>
        <p className="text-sm text-gray-500">Send Aegisum to another address</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient Address</Label>
            <Input
              id="recipient"
              placeholder="aegs1..."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (AEG)</Label>
            <div className="flex space-x-2">
              <Input
                id="amount"
                type="number"
                step="0.00000001"
                min="0.00000001"
                placeholder="0.0"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value)
                  setFeeInfo(null)
                }}
                disabled={loading}
              />
              <Button
                type="button"
                variant="outline"
                onClick={calculateFee}
                disabled={loading || calculating || !amount || isNaN(Number(amount))}
              >
                {calculating ? "Calculating..." : "Calculate Fee"}
              </Button>
            </div>
          </div>

          {feeInfo && (
            <div className="rounded-md bg-[#E8F1F8] p-3 text-sm">
              <div className="flex justify-between">
                <span>Transaction Fee:</span>
                <span>{feeInfo.fee.toFixed(8)} AEG</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Network Fee:</span>
                <span>{feeInfo.networkFee.toFixed(8)} AEG</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Dev Fund Fee:</span>
                <span>{feeInfo.devFundFee.toFixed(8)} AEG</span>
              </div>
              <div className="mt-2 pt-2 border-t border-[#C9D3E2] flex justify-between font-medium">
                <span>Amount to be received:</span>
                <span>{feeInfo.finalAmount.toFixed(8)} AEG</span>
              </div>
            </div>
          )}

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
      </CardContent>
      <CardFooter>
        <Button type="submit" onClick={handleSubmit} disabled={loading || !recipient || !amount} className="w-full">
          {loading ? "Sending..." : "Send AEG"}
        </Button>
      </CardFooter>
    </Card>
  )
}
