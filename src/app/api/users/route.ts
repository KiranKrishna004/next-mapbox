import { connectMongoDB } from "@/lib/mongodb"
import User from "@/models/User"
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcrypt"
import { withErrorHandler } from "@/app/utils/errorhandler"

async function GetUser() {
  await connectMongoDB()
  const users = await User.find({})
  return NextResponse.json(users)
}

async function CreatetUser(request: NextRequest) {
  const { username, name, password } = await request.json()

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  return NextResponse.json(savedUser)
}

export const GET = withErrorHandler(GetUser)
export const POST = withErrorHandler(CreatetUser)
