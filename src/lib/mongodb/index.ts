import { connect } from "mongoose"

export const connectMongoDB = async () => {
  try {
    await connect(process.env.MONGODB_URI)
    console.log("Connected to MongoDB.")
  } catch (error) {
    console.log(error)
  }
}
