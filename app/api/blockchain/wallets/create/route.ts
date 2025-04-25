import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { name } = await request.json()

    // Validate input
    if (!name) {
      return NextResponse.json({ success: false, error: "Wallet name is required" }, { status: 400 })
    }

    // In a real app, this would create a new wallet in the database
    // For demo purposes, we'll just return a mock wallet
    const newWallet = {
      id: "wallet_" + Math.random().toString(36).substring(2, 9),
      name,
      isActive: false,
    }

    return NextResponse.json({
      success: true,
      wallet: newWallet,
    })
  } catch (error) {
    console.error("Error creating wallet:", error)
    return NextResponse.json({ success: false, error: "Failed to create wallet" }, { status: 500 })
  }
}
