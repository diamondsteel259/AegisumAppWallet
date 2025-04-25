import { NextResponse } from "next/server"

export async function GET() {
  try {
    // In a real app, this would fetch users from the database
    // For demo purposes, we'll return mock users
    const users = [
      {
        id: "user_1",
        username: "admin",
        email: "admin@aegisum.com",
        role: "admin",
        status: "active",
        walletCount: 3,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), // 30 days ago
      },
      {
        id: "user_2",
        username: "john_doe",
        email: "john@example.com",
        role: "user",
        status: "active",
        walletCount: 2,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(), // 15 days ago
      },
      {
        id: "user_3",
        username: "jane_smith",
        email: "jane@example.com",
        role: "user",
        status: "active",
        walletCount: 1,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
      },
      {
        id: "user_4",
        username: "bob_johnson",
        email: "bob@example.com",
        role: "user",
        status: "suspended",
        walletCount: 1,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
      },
      {
        id: "user_5",
        username: "alice_williams",
        email: "alice@example.com",
        role: "user",
        status: "pending",
        walletCount: 0,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
      },
    ]

    return NextResponse.json({
      success: true,
      users,
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { userId, status } = await request.json()

    // Validate inputs
    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 })
    }

    if (!status || !["active", "suspended"].includes(status)) {
      return NextResponse.json({ success: false, error: "Valid status is required" }, { status: 400 })
    }

    // In a real app, this would update the user status in the database
    // For demo purposes, we'll just return success

    return NextResponse.json({
      success: true,
      message: `User ${userId} status updated to ${status}`,
    })
  } catch (error) {
    console.error("Error updating user status:", error)
    return NextResponse.json({ success: false, error: "Failed to update user status" }, { status: 500 })
  }
}
