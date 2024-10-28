import { NextRequest, NextResponse } from "next/server"
import { kml } from "@tmcw/togeojson"
import { DOMParser } from "xmldom"

export async function POST(req: NextRequest) {
  const formData = await req.formData()

  const file = formData.get("file")

  if (!file) {
    return NextResponse.json({ error: "No files received." }, { status: 400 })
  }

  if (!(file instanceof File) || file.type !== "application/octet-stream") {
    return NextResponse.json(
      { error: "Unsupported file type. Please upload a KML file." },
      { status: 400 }
    )
  }

  try {
    const fileText = await file.text() // Read file content as text
    const geojsonData = kml(
      new DOMParser().parseFromString(fileText, "text/xml")
    ) // Convert KML to GeoJSON

    return NextResponse.json(
      { geojson: geojsonData, filename: file.name },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to convert KML to GeoJSON." },
      { status: 500 }
    )
  }
}
