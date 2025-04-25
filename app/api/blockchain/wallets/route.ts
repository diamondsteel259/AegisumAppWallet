import { NextResponse } from "next/server"

export async function GET() {
  try {
    // In a real app, this would fetch wallets from the database
    // For demo purposes, we'll return mock wallets
    const wallets = [
      {
        id: "wallet_1",
        name: "Main Wallet",
        isActive: true,
      },
      {
        id: "wallet_2",
        name: "Savings",
        isActive: false,
      },
      {
        id: "wallet_3",
        name: "Business",
        isActive: false,
      },
    ]

    return NextResponse.json({
      success: true,
      wallets,
    })
  } catch (error) {
    console.error("Error fetching wallets:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch wallets" }, { status: 500 })
  }
}
