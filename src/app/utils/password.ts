import bcrypt from "bcrypt"
import { SALT_ROUNDS } from "@/app/constants"

export async function saltAndHashPassword(password: string) {
  return await bcrypt.hash(password, Number(SALT_ROUNDS))
}
