import { NextResponse } from "next/server"

// Get fee settings from database
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
    const { recipient, amount } = await request.json()

    // Validate inputs
    if (!recipient) {
      return NextResponse.json({ success: false, error: "Recipient address is required" }, { status: 400 })
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
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

    // In a real app, this would send the transaction to the blockchain
    // For demo purposes, we'll just return success
    return NextResponse.json({
      success: true,
      txId: "tx_" + Math.random().toString(36).substring(2, 15),
      amount: numAmount,
      fee,
      networkFee,
      devFundFee,
      finalAmount,
      recipient,
    })
  } catch (error) {
    console.error("Error sending transaction:", error)
    return NextResponse.json({ success: false, error: "Failed to send transaction" }, { status: 500 })
  }
}
