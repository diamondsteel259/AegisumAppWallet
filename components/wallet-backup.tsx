"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle, Download, Upload } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function WalletBackup() {
  const [backupLoading, setBackupLoading] = useState(false)
  const [restoreLoading, setRestoreLoading] = useState(false)
  const [backupFile, setBackupFile] = useState<File | null>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleBackup = async () => {
    setBackupLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/blockchain/backup")

      if (!response.ok) {
        throw new Error("Failed to create backup")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `aegisum-wallet-backup-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      setSuccess("Backup created successfully")
    } catch (err) {
      console.error(err)
      setError("Failed to create backup")
    } finally {
      setBackupLoading(false)
    }
  }

  const handleRestore = async () => {
    if (!backupFile) {
      setError("Please select a backup file")
      return
    }

    setRestoreLoading(true)
    setError("")
    setSuccess("")

    try {
      const formData = new FormData()
      formData.append("backupFile", backupFile)

      const response = await fetch("/api/blockchain/restore", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        setSuccess("Wallet restored successfully")
        // Refresh the page to update all wallet data
        setTimeout(() => window.location.reload(), 2000)
      } else {
        setError(data.error || "Failed to restore wallet")
      }
    } catch (err) {
      console.error(err)
      setError("Failed to restore wallet")
    } finally {
      setRestoreLoading(false)
      setBackupFile(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#2C4079]">Backup & Restore</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-gray-500 mb-2">
            Create a backup of your wallet or restore from a previous backup file.
          </p>

          <div className="space-y-4">
            <div>
              <Label htmlFor="backup-file">Restore from backup</Label>
              <div className="flex mt-1">
                <Input
                  id="backup-file"
                  type="file"
                  accept=".json"
                  onChange={(e) => setBackupFile(e.target.files?.[0] || null)}
                  disabled={restoreLoading}
                  className="flex-1"
                />
              </div>
            </div>
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
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleBackup} disabled={backupLoading} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          {backupLoading ? "Creating Backup..." : "Backup Wallet"}
        </Button>

        <Button onClick={handleRestore} disabled={restoreLoading || !backupFile} className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          {restoreLoading ? "Restoring..." : "Restore Wallet"}
        </Button>
      </CardFooter>
    </Card>
  )
}
