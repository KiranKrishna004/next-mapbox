import { ErrorHandler } from "@/app/utils/errorhandler"
import { dbConnect } from "@/lib/mongoose"
import { saltAndHashPassword } from "@/app/utils/password"
import User from "@/models/User"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-static"

export async function GET() {
  try {
    await dbConnect()
    const users = await User.find({})
    return NextResponse.json(users)
  } catch (error) {
    return ErrorHandler(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const { username, name, password } = await request.json()
    const passwordHash = await saltAndHashPassword(password)

    const user = new User({
      username,
      name,
      passwordHash,
    })

    const savedUser = await user.save()

    return NextResponse.json(savedUser)
  } catch (error) {
    return ErrorHandler(error)
  }
}
