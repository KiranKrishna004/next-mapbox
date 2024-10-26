import { model, models, Schema } from "mongoose"

const userSchema = new Schema({
  username: { type: String, required: true, minLength: 3, unique: true },
  name: String,
  passwordHash: String,
})

userSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()

    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  },
})

const User = models.User || model("User", userSchema)

export default User
