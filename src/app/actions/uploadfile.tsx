"use server"
import { FileSchema } from "@/lib/definitions"
import { BASE_URL } from "../constants"

export async function uploadfile(files: File[]) {
  const filesResult = files.map(async (file) => {
    const result = FileSchema.safeParse(file)
    if (!result.success) {
      let errorMessage = ""
      result.error.issues.forEach(
        (issue) =>
          (errorMessage =
            errorMessage + issue.path[0] + ": " + issue.message + "\n")
      )
      return { error: errorMessage }
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

        default:
          return {}
      }
    }
  })

  const response = await Promise.all(filesResult)

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
