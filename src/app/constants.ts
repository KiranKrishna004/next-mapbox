const URI = process.env.MONGODB_URI
const SALT_ROUNDS = process.env.SALT_ROUNDS || 10
const SECRET = process.env.SECRET

export { URI, SALT_ROUNDS, SECRET }
