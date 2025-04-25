"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Copy, RefreshCw } from "lucide-react"
import QRCode from "react-qr-code"

export function ReceiveForm() {
  const [address, setAddress] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  const fetchAddress = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/blockchain/address")
      const data = await response.json()

      if (data.success) {
        setAddress(data.address)
      } else {
        setError("Failed to load address")
      }
    } catch (error) {
      setError("Error loading address")
      console.error("Error fetching address:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAddress()
  }, [])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-[#2C4079]">Receive</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={fetchAddress}
            className="text-[#2C4079] hover:text-[#2C4079] hover:bg-[#E8F1F8]"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>
        <p className="text-sm text-gray-500">Your Aegisum address</p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          {loading ? (
            <div className="space-y-4 w-full">
              <Skeleton className="h-40 w-40 mx-auto" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <>
              <div className="bg-white p-2 rounded-lg">
                <QRCode
                  value={address}
                  size={160}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  fgColor="#2C4079"
                />
              </div>
              <div className="relative w-full">
                <div className="p-3 bg-[#E8F1F8] rounded-md text-center text-sm font-mono break-all">{address}</div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#2C4079] hover:text-[#2C4079] hover:bg-[#C9D3E2]"
                  onClick={copyToClipboard}
                >
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy</span>
                </Button>
              </div>
              {copied && <div className="text-sm text-green-600">Address copied to clipboard!</div>}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
