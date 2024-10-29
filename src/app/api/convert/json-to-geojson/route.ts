import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const formData = await req.formData()

  const file = formData.get("file")

  if (!file || !(file instanceof File)) {
    return NextResponse.json(
      { error: "Failed to parse JSON file" },
      {
        status: 500,
      }
    )
  }

  try {
    // Read the file content as text
    const text = await file.text() // Use .text() for file content
    const jsonData = JSON.parse(text) // Parse the text as JSON

    // Send the parsed JSON data as a response
    return NextResponse.json(
      { geojson: jsonData, filename: file.name },
      {
        status: 200,
      }
    )
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to parse JSON file" },
      {
        status: 500,
      }
    )
  }
}
