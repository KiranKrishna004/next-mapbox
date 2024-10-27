"use server"
import { SignupFormSchema } from "@/lib/definitions"

export const signUpLogic = async (userCred: unknown) => {
  const result = SignupFormSchema.safeParse(userCred)

  if (!result.success) {
    let errorMessage = ""
    result.error.issues.forEach(
      (issue) =>
        (errorMessage =
          errorMessage + issue.path[0] + ": " + issue.message + "\n")
    )
    return { error: errorMessage }
  } else {
    return { message: "Clicked" }
  }
}
