import { z } from "zod"

const MAX_FILE_SIZE = 10000000

function checkFileType(file: File) {
  if (file?.name) {
    const fileType = file.name.split(".").pop()
    return fileType === "kml" || fileType === "tiff" || fileType === "geojson"
  }
  return false
}

// Define schema for each individual file
export const FileSchema = z
  .any()
  .refine((file) => file.size < MAX_FILE_SIZE, "Max size is 5MB.")
  .refine(
    (file) => checkFileType(file),
    "Only .tiff, .kml and .geojson formats are supported."
  )

export const SignInFormSchema = z.object({
  username: z
    .string()
    .min(5, { message: "Username must be at least 3 characters long." })
    .trim(),
  password: z
    .string()
    .min(8, { message: "Be at least 8 characters long." })
    .trim(),
})

export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long." })
    .trim(),
  username: z
    .string()
    .min(5, { message: "Username must be at least 3 characters long." })
    .trim(),
  password: z
    .string()
    .min(8, { message: "Be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Contain at least one special character.",
    })
    .trim(),
})

export type FormState =
  | {
      errors?: {
        name?: string[]
        password?: string[]
      }
      message?: string
    }
  | undefined

// export type SessionPayload = { username: string; password: string }
export type SessionPayload = { userName: string; expiresAt: Date }
