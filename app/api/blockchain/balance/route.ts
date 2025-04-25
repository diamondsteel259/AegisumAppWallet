import { NextResponse } from "next/server"

export async function GET() {
  try {
    // In a real app, this would fetch the balance from the blockchain
    // For demo purposes, we'll return a mock balance
    const balance = Math.random() * 100

    return NextResponse.json({
      success: true,
      balance,
    })
  } catch (error) {
    console.error("Error fetching balance:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch balance" }, { status: 500 })
  }
}
