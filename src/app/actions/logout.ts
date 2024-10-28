"use server"

import { logout } from "@/lib/session"

export const Logout = async () => {
  await logout()
}
