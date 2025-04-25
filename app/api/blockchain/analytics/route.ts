import { NextResponse } from "next/server"

export async function GET() {
  try {
    // In a real app, this would fetch analytics data from the database
    // For demo purposes, we'll return mock data
    const data = {
      totalSent: 25.75,
      totalReceived: 50.25,
      netChange: 24.5,
      transactionCount: 12,
      dailyVolume: [
        {
          date: "2023-06-01",
          sent: 5.5,
          received: 10.25,
        },
        {
          date: "2023-06-02",
          sent: 2.75,
          received: 0,
        },
        {
          date: "2023-06-03",
          sent: 0,
          received: 15.5,
        },
        {
          date: "2023-06-04",
          sent: 7.5,
          received: 5.25,
        },
        {
          date: "2023-06-05",
          sent: 10,
          received: 19.25,
        },
      ],
    }

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch analytics" }, { status: 500 })
  }
}
