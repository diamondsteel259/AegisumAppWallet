"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Wallet } from "lucide-react"

interface WalletInfo {
  id: string
  name: string
  isActive: boolean
}

export function WalletSwitcher() {
  const [wallets, setWallets] = useState<WalletInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [switching, setSwitching] = useState(false)
  const [creating, setCreating] = useState(false)
  const [activeWallet, setActiveWallet] = useState<string | null>(null)

  const fetchWallets = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/blockchain/wallets")
      const data = await response.json()

      if (data.success) {
        setWallets(data.wallets)
        const active = data.wallets.find((w: WalletInfo) => w.isActive)
        if (active) {
          setActiveWallet(active.id)
        }
      }
    } catch (error) {
      console.error("Error fetching wallets:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWallets()
  }, [])

  const handleSwitchWallet = async (walletId: string) => {
    if (walletId === activeWallet) return

    setSwitching(true)
    try {
      const response = await fetch("/api/blockchain/wallets/switch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ walletId }),
      })

      const data = await response.json()

      if (data.success) {
        setActiveWallet(walletId)
        // Refresh the page to update all wallet data
        window.location.reload()
      }
    } catch (error) {
      console.error("Error switching wallet:", error)
    } finally {
      setSwitching(false)
    }
  }

  const handleCreateWallet = async () => {
    setCreating(true)
    try {
      const response = await fetch("/api/blockchain/wallets/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: `Wallet ${wallets.length + 1}` }),
      })

      const data = await response.json()

      if (data.success) {
        await fetchWallets()
      }
    } catch (error) {
      console.error("Error creating wallet:", error)
    } finally {
      setCreating(false)
    }
  }

  if (loading) {
    return <div className="h-10 w-40 bg-gray-100 animate-pulse rounded-md"></div>
  }

  return (
    <div className="flex items-center space-x-2">
      <Select
        value={activeWallet || ""}
        onValueChange={handleSwitchWallet}
        disabled={switching || wallets.length === 0}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select wallet" />
        </SelectTrigger>
        <SelectContent>
          {wallets.map((wallet) => (
            <SelectItem key={wallet.id} value={wallet.id}>
              <div className="flex items-center">
                <Wallet className="mr-2 h-4 w-4" />
                {wallet.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button variant="outline" size="icon" onClick={handleCreateWallet} disabled={creating} title="Create new wallet">
        <PlusCircle className="h-4 w-4" />
        <span className="sr-only">Create new wallet</span>
      </Button>
    </div>
  )
}
