import { getSession } from "@/lib/session"
import { SignOut } from "@/app/ui/signout"
import { AuthForm } from "./ui/auth-form"

export default async function Home() {
  const session = await getSession()

  console.log("session: ", session)
  return session ? <SignOut /> : <AuthForm />
}
