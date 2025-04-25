"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle } from "lucide-react"

export function AdminSettings() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleResetNode = async () => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      // This would be a real API call in production
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setSuccess("Node reset successfully")
    } catch (err) {
      setError("Error resetting node")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Admin Settings</CardTitle>
          <CardDescription>Manage system-wide settings for the Aegisum wallet</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="rpc-url" className="font-medium">
              Blockchain RPC URL
            </Label>
            <Input id="rpc-url" defaultValue={process.env.BLOCKCHAIN_RPC_URL || "http://localhost:9332"} disabled />
            <p className="text-sm text-gray-500 mt-1">The RPC URL for the Aegisum blockchain node</p>
          </div>

          <div>
            <Label htmlFor="api-url" className="font-medium">
              API URL
            </Label>
            <Input id="api-url" defaultValue={process.env.API_URL || "http://localhost:3000/api"} disabled />
            <p className="text-sm text-gray-500 mt-1">The base URL for the Aegisum wallet API</p>
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
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="destructive" onClick={handleResetNode} disabled={loading}>
            {loading ? "Resetting..." : "Reset Node"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
