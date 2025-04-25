import { NextResponse } from "next/server"

export async function GET() {
  try {
    // In a real app, this would fetch user settings from the database
    // For demo purposes, we'll return mock settings
    const settings = {
      notifications: true,
      autoLockTimeout: 15,
      defaultCurrency: "USD",
      theme: "system",
    }

    return NextResponse.json({
      success: true,
      settings,
    })
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch settings" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const settings = await request.json()

    // In a real app, this would update user settings in the database
    // For demo purposes, we'll just return success

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
    })
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json({ success: false, error: "Failed to update settings" }, { status: 500 })
  }
}
