import { SECRET } from "@/app/constants"
import { ErrorHandler } from "@/app/utils/errorhandler"
import { dbConnect } from "@/lib/mongoose"
import User from "@/models/User"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { password, username } = await req.json()

    await dbConnect()
    const user = await User.findOne({ username })

    const passwordCorrect =
      user === null ? false : await bcrypt.compare(password, user.passwordHash)

    if (!(user && passwordCorrect)) {
      return NextResponse.json(
        {
          error: "Invalid User",
          message: "Invalid username or password",
        },
        { status: 400 }
      )
    }

    const userForToken = {
      id: user.id,
    }

    if (SECRET) {
      const token: string = jwt.sign(userForToken, SECRET, {
        expiresIn: 60 * 60,
      })
      const response = NextResponse.json(
        {
          message: "Successfully logged in",
        },
        { status: 200 }
      )

      response.cookies.set("token", token)

      return response
    } else {
      return NextResponse.json(
        {
          error: "Missing Secret",
          message: "SECRET missing from env",
        },
        { status: 500 }
      )
    }
  } catch (error) {
    ErrorHandler(error)
  }
}
