import { NextResponse } from "next/server"

export function ErrorHandler(error: unknown) {
  if (error instanceof Error) {
    let responseObj = {}

    switch (error.name) {
      case "ValidationError": {
        return (responseObj = {
          message: error.message,
          status: 400,
          error: error.name,
        })
      }
      case "MongooseError": {
        responseObj = {
          message: error.message,
          status: 500,
          error: error!.error,
        }
      }
      default:
        {
          responseObj = {
            message: error.message,
            status: 500,
            error: error.name,
          }
        }

        return NextResponse.json(responseObj)
    }
  }
}
