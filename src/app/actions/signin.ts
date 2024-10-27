"use server"
import { SignInFormSchema } from "@/app/lib/definitions"
import { createSession } from "../lib/session"

export const signInLogic = async (userCred: unknown) => {
  const result = SignInFormSchema.safeParse(userCred)

  if (!result.success) {
    let errorMessage = ""
    result.error.issues.forEach(
      (issue) =>
        (errorMessage =
          errorMessage + issue.path[0] + ": " + issue.message + "\n")
    )
    return { error: errorMessage }
  } else {
    await createSession(result.data)
  }
}
