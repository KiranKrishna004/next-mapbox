import { connect } from "mongoose"

export const connectMongoDB = async () => {
  try {
    const URI = process.env.MONGODB_URI
    if (URI) {
      await connect(URI)

      console.log("Connected to MongoDB.")
    } else {
      console.log("MONGODB_URI missing.")
    }
  } catch (error) {
    console.log(error)
  }
}
