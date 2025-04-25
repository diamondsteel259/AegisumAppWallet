"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { AlertCircle, CheckCircle } from "lucide-react"

interface WalletSettings {
  notifications: boolean
  autoLockTimeout: number
  defaultCurrency: string
  theme: "light" | "dark" | "system"
}

export function WalletSettings() {
  const [settings, setSettings] = useState<WalletSettings>({
    notifications: true,
    autoLockTimeout: 15,
    defaultCurrency: "USD",
    theme: "system",
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch("/api/user/settings")
        const data = await response.json()

        if (data.success) {
          setSettings(data.settings)
        } else {
          setError(data.error || "Failed to load settings")
        }
      } catch (err) {
        setError("Error loading settings")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/user/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess("Settings updated successfully")
      } else {
        setError(data.error || "Failed to update settings")
      }
    } catch (err) {
      setError("Error updating settings")
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading settings...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#2C4079]">Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications" className="font-medium">
              Enable Notifications
            </Label>
            <Switch
              id="notifications"
              checked={settings.notifications}
              onCheckedChange={(checked) => setSettings({ ...settings, notifications: checked })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="auto-lock" className="font-medium">
              Auto-lock Timeout (minutes)
            </Label>
            <Input
              id="auto-lock"
              type="number"
              min="1"
              max="60"
              value={settings.autoLockTimeout}
              onChange={(e) => setSettings({ ...settings, autoLockTimeout: Number(e.target.value) })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency" className="font-medium">
              Default Currency
            </Label>
            <select
              id="currency"
              value={settings.defaultCurrency}
              onChange={(e) => setSettings({ ...settings, defaultCurrency: e.target.value })}
              className="flex h-10 w-full rounded-md border border-[#C9D3E2] bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#327744] focus-visible:ring-offset-2"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="JPY">JPY</option>
              <option value="AUD">AUD</option>
              <option value="CAD">CAD</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="theme" className="font-medium">
              Theme
            </Label>
            <select
              id="theme"
              value={settings.theme}
              onChange={(e) => setSettings({ ...settings, theme: e.target.value as any })}
              className="flex h-10 w-full rounded-md border border-[#C9D3E2] bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#327744] focus-visible:ring-offset-2"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
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
        <Button type="submit" onClick={handleSubmit} disabled={saving} className="ml-auto">
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </CardFooter>
    </Card>
  )
}
