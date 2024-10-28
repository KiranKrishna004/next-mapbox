import { getSession } from "@/lib/session"
import { HomePage } from "./ui/home-page"

export default async function Home() {
  const session = await getSession()
  console.log(session)

  // return session ? (
  //   <div>
  //     <Navbar />
  //   </div>
  // ) : (
  //   // <Navbar />
  //   <AuthForm />
  // )

  return <HomePage />
}
