export async function GET() {
  try {
    // In a real app, this would fetch transaction chart data from the database
    // For demo purposes, we'll return mock data
    const data = [
      {
        date: "2023-06-01",
        volume: 125.5,
        count: 12,
      },
      {
        date: "2023-06-02",
        volume: 87.25,
        count: 8,
      },
      {
        date: "2023-06-03",
        volume: 210.75,
        count: 15,
      },
      {
        date: "2023-06-04",
        volume: 150.0,
        count: 10,
      },
      {
        date: "2023-06-05",
        volume: 175.25,
        count: 14,
      },
      {\
        date: "2023-06-
