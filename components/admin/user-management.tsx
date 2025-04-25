"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, CheckCircle, Search, UserPlus, UserX, RefreshCw } from "lucide-react"

interface User {
  id: string
  username: string
  email: string
  role: "admin" | "user"
  status: "active" | "suspended" | "pending"
  walletCount: number
  createdAt: string
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/users")
      const data = await response.json()

      if (data.success) {
        setUsers(data.users)
        setFilteredUsers(data.users)
      } else {
        setError(data.error || "Failed to load users")
      }
    } catch (err) {
      setError("Error loading users")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredUsers(
        users.filter(
          (user) =>
            user.username.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query) ||
            user.id.toLowerCase().includes(query),
        ),
      )
    }
  }, [searchQuery, users])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="secondary">Active</Badge>
      case "suspended":
        return <Badge variant="destructive">Suspended</Badge>
      case "pending":
        return <Badge variant="default">Pending</Badge>
      default:
        return null
    }
  }

  const handleStatusChange = async (userId: string, newStatus: "active" | "suspended") => {
    try {
      const response = await fetch("/api/admin/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          status: newStatus,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setUsers((prevUsers) => prevUsers.map((user) => (user.id === userId ? { ...user, status: newStatus } : user)))
        setSuccess(`User status updated successfully`)

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(""), 3000)
      } else {
        setError(data.error || "Failed to update user status")

        // Clear error message after 3 seconds
        setTimeout(() => setError(""), 3000)
      }
    } catch (err) {
      setError("Error updating user status")
      console.error(err)

      // Clear error message after 3 seconds
      setTimeout(() => setError(""), 3000)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage user accounts and permissions</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={fetchUsers}
            className="text-[#2C4079] hover:text-[#2C4079] hover:bg-[#E8F1F8]"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search users..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex items-center gap-1">
              <UserPlus className="h-4 w-4" />
              <span>Add User</span>
            </Button>
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

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <Skeleton className="h-8 w-24" />
                </div>
              ))}
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No users found</div>
          ) : (
            <div className="divide-y divide-[#E8F1F8]">
              {filteredUsers.map((user) => (
                <div key={user.id} className="py-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-[#E8F1F8] h-12 w-12 rounded-full flex items-center justify-center text-[#2C4079] font-bold">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium">{user.username}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-500">
                      {user.walletCount} {user.walletCount === 1 ? "wallet" : "wallets"}
                    </div>
                    {getStatusBadge(user.status)}
                    <div className="flex space-x-2">
                      {user.status === "active" ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusChange(user.id, "suspended")}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <UserX className="h-4 w-4 mr-1" />
                          Suspend
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusChange(user.id, "active")}
                          className="text-green-500 hover:text-green-700 hover:bg-green-50"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Activate
                        </Button>
                      )}
                    </div>
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
