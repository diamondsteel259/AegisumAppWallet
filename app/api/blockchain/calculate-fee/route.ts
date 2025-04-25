import { NextResponse } from "next/server"

// Get fee settings from database (same as in send route)
async function getFeeSettings() {
  try {
    // In a production app, this would come from a database
    // For now, we'll use a simple object
    return {
      enabled: true,
      percentage: 1.5,
      minFee: 0.001,
      maxFee: 2.0,
      devFundAddress: "aegs1qqu5j3hxmvujs258zc2xuy8k6vmkzp5qxhqhec7",
    }
  } catch (error) {
    console.error("Error fetching fee settings:", error)
    return null
  }
}

export async function POST(request: Request) {
  try {
    const { amount } = await request.json()

    // Validate input
    if (!amount || isNaN(Number(amount))) {
      return NextResponse.json({ success: false, error: "Valid amount is required" }, { status: 400 })
    }

    const numAmount = Number(amount)

    // Get fee settings
    const feeSettings = await getFeeSettings()

    // Calculate fee if enabled
    let fee = 0
    const networkFee = 0.0001 // Standard network fee
    let devFundFee = 0

    if (feeSettings && feeSettings.enabled) {
      // Calculate percentage-based fee
      fee = numAmount * (feeSettings.percentage / 100)

      // Apply min/max constraints
      fee = Math.max(feeSettings.minFee, fee)
      fee = Math.min(feeSettings.maxFee, fee)

      // Split fee between network fee and dev fund
      devFundFee = fee - networkFee
    }

    // Calculate final amount
    const finalAmount = numAmount - fee

    return NextResponse.json({
      success: true,
      amount: numAmount,
      fee,
      networkFee,
      devFundFee,
      finalAmount,
    })
  } catch (error) {
    console.error("Error calculating fee:", error)
    return NextResponse.json({ success: false, error: "Failed to calculate fee" }, { status: 500 })
  }
}
