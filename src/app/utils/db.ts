import User from "@/models/User"

export async function getUserFromDB(username: string, pwHash: string) {
  return await User.findOne({ username, passwordHash: pwHash })
}
