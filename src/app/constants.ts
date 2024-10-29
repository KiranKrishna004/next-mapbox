const URI = process.env.MONGODB_URI
const SALT_ROUNDS = process.env.SALT_ROUNDS || 10
const SECRET = process.env.SECRET
const BASE_URL = process.env.NEXTAUTH_URL
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
const INITIAL_CENTER: [number, number] = [
  -71.97722138410576, -13.517379300798098,
]
const INITIAL_ZOOM = 2

export {
  URI,
  SALT_ROUNDS,
  SECRET,
  BASE_URL,
  MAPBOX_TOKEN,
  INITIAL_CENTER,
  INITIAL_ZOOM,
}
