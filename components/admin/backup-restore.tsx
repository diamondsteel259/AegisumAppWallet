"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle, Download, Upload } from "lucide-react"

export function BackupRestore() {
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
      const response = await fetch("/api/admin/backup")

      if (!response.ok) {
        throw new Error("Failed to create backup")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `aegisum-system-backup-${new Date().toISOString().split("T")[0]}.zip`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      setSuccess("System backup created successfully")
    } catch (err) {
      console.error(err)
      setError("Failed to create system backup")
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

      const response = await fetch("/api/admin/backup", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        setSuccess("System restored successfully")
      } else {
        setError(data.error || "Failed to restore system")
      }
    } catch (err) {
      console.error(err)
      setError("Failed to restore system")
    } finally {
      setRestoreLoading(false)
      setBackupFile(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Backup & Restore</CardTitle>
        <CardDescription>Create a backup of the entire system or restore from a previous backup</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500 mb-4">
              System backups include all wallet data, user accounts, transaction history, and system settings. Regular
              backups are recommended to prevent data loss.
            </p>

            <div className="bg-amber-50 border border-amber-200 text-amber-700 p-3 rounded-md flex items-start gap-2 mb-4">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Warning:</strong> Restoring from a backup will replace all current data. This action cannot be
                undone.
              </div>
            </div>

            <div>
              <Label htmlFor="backup-file">Restore from backup</Label>
              <div className="flex mt-1">
                <Input
                  id="backup-file"
                  type="file"
                  accept=".zip"
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
          {backupLoading ? "Creating Backup..." : "Backup System"}
        </Button>

        <Button
          variant="destructive"
          onClick={handleRestore}
          disabled={restoreLoading || !backupFile}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          {restoreLoading ? "Restoring..." : "Restore System"}
        </Button>
      </CardFooter>
    </Card>
  )
}
