import { NextRequest, NextResponse } from "next/server"

export function withErrorHandler(
  routeHandler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      return await routeHandler(req)
    } catch (error: unknown) {
      if (error instanceof Error) {
        switch (error.name) {
          case "ValidationError": {
            return NextResponse.json({
              message: error.message,
              status: 400,
              error: error.name,
            })
          }
        }
      }
    }
  }
}
