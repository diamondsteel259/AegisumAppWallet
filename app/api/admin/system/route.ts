import { NextResponse } from "next/server"

export async function GET() {
  try {
    // In a real app, this would fetch system status from the node
    // For demo purposes, we'll return mock data
    const status = {
      nodeStatus: "online", // "online" | "offline" | "syncing"
      blockHeight: 1234567,
      syncProgress: 100,
      peerCount: 8,
      cpuUsage: 25,
      memoryUsage: 40,
      diskUsage: 60,
      uptime: 3600 * 24 * 3 + 3600 * 5 + 60 * 30, // 3 days, 5 hours, 30 minutes in seconds
    }

    return NextResponse.json({
      success: true,
      status,
    })
  } catch (error) {
    console.error("Error fetching system status:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch system status" }, { status: 500 })
  }
}
