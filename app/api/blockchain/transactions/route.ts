import { NextResponse } from "next/server"

export async function GET() {
  try {
    // In a real app, this would fetch transactions from the blockchain
    // For demo purposes, we'll return mock transactions
    const transactions = [
      {
        id: "tx_" + Math.random().toString(36).substring(2, 15),
        type: "receive",
        amount: 5.25,
        fee: 0.001,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        address: "aegs1qqu5j3hxmvujs258zc2xuy8k6vmkzp5qxhqhec7",
        status: "confirmed",
      },
      {
        id: "tx_" + Math.random().toString(36).substring(2, 15),
        type: "send",
        amount: 1.75,
        fee: 0.001,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        address: "aegs1qpu5j3hxmvujs258zc2xuy8k6vmkzp5qxhqhec7",
        status: "confirmed",
      },
      {
        id: "tx_" + Math.random().toString(36).substring(2, 15),
        type: "send",
        amount: 0.5,
        fee: 0.001,
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        address: "aegs1qpu5j3hxmvujs258zc2xuy8k6vmkzp5qxhqhec7",
        status: "pending",
      },
    ]

    return NextResponse.json({
      success: true,
      transactions,
    })
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch transactions" }, { status: 500 })
  }
}
