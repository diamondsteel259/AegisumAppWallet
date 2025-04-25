"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle } from "lucide-react"

interface FeeSettings {
  enabled: boolean
  percentage: number
  minFee: number
  maxFee: number
  devFundAddress: string
}

export function FeeManagement() {
  const [feeSettings, setFeeSettings] = useState<FeeSettings>({
    enabled: true,
    percentage: 1.5,
    minFee: 0.001,
    maxFee: 2.0,
    devFundAddress: "aegs1qqu5j3hxmvujs258zc2xuy8k6vmkzp5qxhqhec7",
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    async function fetchFeeSettings() {
      try {
        const response = await fetch("/api/admin/fees")
        const data = await response.json()

        if (data.success) {
          setFeeSettings(data.feeSettings)
        } else {
          setError(data.error || "Failed to load fee settings")
        }
      } catch (err) {
        setError("Error loading fee settings")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchFeeSettings()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/admin/fees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feeSettings),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess("Fee settings updated successfully")
      } else {
        setError(data.error || "Failed to update fee settings")
      }
    } catch (err) {
      setError("Error updating fee settings")
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading fee settings...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fee Management</CardTitle>
        <CardDescription>Configure transaction fee settings for the Aegisum wallet</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="fee-enabled" className="font-medium">
              Enable Transaction Fees
            </Label>
            <Switch
              id="fee-enabled"
              checked={feeSettings.enabled}
              onCheckedChange={(checked) => setFeeSettings({ ...feeSettings, enabled: checked })}
            />
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="fee-percentage" className="font-medium">
                Fee Percentage (%)
              </Label>
              <Input
                id="fee-percentage"
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={feeSettings.percentage}
                onChange={(e) => setFeeSettings({ ...feeSettings, percentage: Number.parseFloat(e.target.value) })}
                disabled={!feeSettings.enabled}
              />
              <p className="text-sm text-gray-500 mt-1">Percentage of transaction amount to charge as fee</p>
            </div>

            <div>
              <Label htmlFor="min-fee" className="font-medium">
                Minimum Fee (AEG)
              </Label>
              <Input
                id="min-fee"
                type="number"
                step="0.0001"
                min="0"
                value={feeSettings.minFee}
                onChange={(e) => setFeeSettings({ ...feeSettings, minFee: Number.parseFloat(e.target.value) })}
                disabled={!feeSettings.enabled}
              />
              <p className="text-sm text-gray-500 mt-1">Minimum fee amount regardless of transaction size</p>
            </div>

            <div>
              <Label htmlFor="max-fee" className="font-medium">
                Maximum Fee (AEG)
              </Label>
              <Input
                id="max-fee"
                type="number"
                step="0.01"
                min="0"
                value={feeSettings.maxFee}
                onChange={(e) => setFeeSettings({ ...feeSettings, maxFee: Number.parseFloat(e.target.value) })}
                disabled={!feeSettings.enabled}
              />
              <p className="text-sm text-gray-500 mt-1">Maximum fee amount for any transaction</p>
            </div>

            <div>
              <Label htmlFor="dev-fund-address" className="font-medium">
                Development Fund Address
              </Label>
              <Input
                id="dev-fund-address"
                value={feeSettings.devFundAddress}
                onChange={(e) => setFeeSettings({ ...feeSettings, devFundAddress: e.target.value })}
                disabled={!feeSettings.enabled}
              />
              <p className="text-sm text-gray-500 mt-1">Aegisum address where fees will be sent</p>
            </div>
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
      </CardContent>
      <CardFooter>
        <Button type="submit" onClick={handleSubmit} disabled={saving || !feeSettings.enabled} className="ml-auto">
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </CardFooter>
    </Card>
  )
}
