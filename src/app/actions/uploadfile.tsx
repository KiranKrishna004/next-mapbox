"use server"
import { FileSchema } from "@/lib/definitions"
import type { FeatureCollection } from "geojson"
import { BASE_URL } from "../constants"

export interface UploadFileErrorType {
  error: string
  filename: string
}

export interface GeoJsonType {
  geojson: FeatureCollection
  filename: string
}

export type UploadFileType = (GeoJsonType | UploadFileErrorType)[]

export async function uploadfile(files: File[]) {
  const filesResult: Array<Promise<UploadFileType>> = files.map(
    async (file) => {
      const result = FileSchema.safeParse(file)
      if (!result.success) {
        let errorMessage = ""
        result.error.issues.forEach(
          (issue) =>
            (errorMessage =
              errorMessage + issue.path[0] + ": " + issue.message + "\n")
        )
        return { error: errorMessage, filename: file.name }
      } else {
        const file = result.data

        switch (file.type) {
          case "image/tiff": {
            return await parseLogic(
              file,
              `${BASE_URL}/api/convert/tiff-to-geojson`
            )
          }

          case "application/octet-stream": {
            return await parseLogic(
              file,
              `${BASE_URL}/api/convert/kml-to-geojson`
            )
          }

          case "application/json": {
            return await parseLogic(
              file,
              `${BASE_URL}/api/convert/json-to-geojson`
            )
          }

          default:
            return { error: "Invalid mime type", filename: file.name }
        }
      }
    }
  )

  const response = await Promise.all(filesResult)

  console.log("respone: ", response)

  return response
}

async function parseLogic(file: File, BASE_URL: string) {
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch(BASE_URL, {
    method: "POST",
    body: formData,
  })

  const jsonResponse = await response.json()
  return jsonResponse
}
