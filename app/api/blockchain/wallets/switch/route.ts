import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { walletId } = await request.json()

    // Validate input
    if (!walletId) {
      return NextResponse.json({ success: false, error: "Wallet ID is required" }, { status: 400 })
    }

    // In a real app, this would switch the active wallet in the database
    // For demo purposes, we'll just return success

    return NextResponse.json({
      success: true,
      message: `Switched to wallet ${walletId}`,
    })
  } catch (error) {
    console.error("Error switching wallet:", error)
    return NextResponse.json({ success: false, error: "Failed to switch wallet" }, { status: 500 })
  }
}
