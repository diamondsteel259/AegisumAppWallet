import { NextResponse } from "next/server"

export async function GET() {
  try {
    // In a real app, this would fetch dev fund data from the database
    // For demo purposes, we'll return mock data
    const data = {
      balance: 245.32,
      totalCollected: 325.75,
      lastWithdrawal: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
      withdrawalAddress: "aegs1qqu5j3hxmvujs258zc2xuy8k6vmkzp5qxhqhec7",
    }

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error("Error fetching dev fund data:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch dev fund data" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { amount, address } = await request.json()

    // Validate inputs
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return NextResponse.json({ success: false, error: "Valid amount is required" }, { status: 400 })
    }

    if (!address) {
      return NextResponse.json({ success: false, error: "Withdrawal address is required" }, { status: 400 })
    }

    // In a real app, this would process the withdrawal
    // For demo purposes, we'll just return updated mock data
    const data = {
      balance: 245.32 - Number(amount),
      totalCollected: 325.75,
      lastWithdrawal: new Date().toISOString(),
      withdrawalAddress: address,
    }

    return NextResponse.json({
      success: true,
      message: `Successfully withdrew ${amount} AEG to ${address}`,
      data,
    })
  } catch (error) {
    console.error("Error processing withdrawal:", error)
    return NextResponse.json({ success: false, error: "Failed to process withdrawal" }, { status: 500 })
  }
}
