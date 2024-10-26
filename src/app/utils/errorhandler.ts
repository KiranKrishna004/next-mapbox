import { NextResponse } from "next/server"

export function ErrorHandler(error: unknown) {
  if (error instanceof Error) {
    let responseObj = {}
    let status = 500

    switch (error.name) {
      case "ValidationError": {
        status = 400
        responseObj = {
          message: error.message,
          error: error.name,
        }
      }
      case "MongooseError": {
        status = 500
        responseObj = {
          message: error.message,
          error: error!.error,
        }
      }
      default:
        {
          responseObj = {
            message: error.message,
            error: error.name,
          }
        }

        return NextResponse.json(responseObj, { status })
    }
  }
}
