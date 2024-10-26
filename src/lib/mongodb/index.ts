import { URI } from "@/app/constants"
import { connect } from "mongoose"

interface MongooseGlobal {
  conn: typeof import("mongoose") | null
  promise: Promise<typeof import("mongoose")> | null
}

// Extend global to add a custom `mongoose` property
declare global {
  // Ensure this is only defined once in the project
  // eslint-disable-next-line no-var
  var mongoose: MongooseGlobal
}

global.mongoose = {
  conn: null,
  promise: null,
}

export async function dbConnect() {
  if (global.mongoose && global.mongoose.conn) {
    console.log("already connected")
    return global.mongoose.conn
  } else {
    if (URI) {
      const promise = connect(URI, { autoIndex: true })

      global.mongoose = {
        conn: await promise,
        promise,
      }
      console.log("Connected to MongoDB.")

      return await promise
    } else {
      console.log("MONGODB_URI missing.")
    }
  }
}
