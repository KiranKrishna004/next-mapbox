import "server-only"

import { cookies } from "next/headers"
import { BASE_URL } from "../constants"

export async function createSession(payload: {
  username: string
  password: string
}) {
  const response = await fetch(`${BASE_URL}/api/login`, {
    method: "POST",
    body: JSON.stringify(payload),
  })
  const token = response.headers.get("set-cookie")?.split("=")[1]
  console.log("Token: ", token)

  if (token) {
    const cookieStore = await cookies()
    cookieStore.set("session", token, {
      httpOnly: true,
      secure: true,
      expires: 60 * 60,
      sameSite: "lax",
      path: "/",
    })
  }
}

export async function getSession() {
  const cookieStore = await cookies()
  console.log("cookieStore: ", cookieStore)
  const session = cookieStore.get("session")?.value
  if (!session) return null

  return session
}

export async function logout() {
  await deleteSession()
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
}
