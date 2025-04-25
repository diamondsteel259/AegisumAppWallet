import { NextResponse } from "next/server"

export async function GET() {
  try {
    // In a real app, this would fetch stats from the database
    // For demo purposes, we'll return mock stats
    const stats = {
      totalUsers: 125,
      activeWallets: 98,
      totalTransactions: 1243,
      totalVolume: 15432.75,
      devFundBalance: 245.32,
      averageFee: 0.0015,
    }

    return NextResponse.json({
      success: true,
      stats,
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch stats" }, { status: 500 })
  }
}
