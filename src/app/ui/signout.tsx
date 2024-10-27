import { Button } from "@/components/ui/button"
import { logout } from "../lib/session"

export const SignOut = () => {
  return (
    <Button
      onClick={async () => {
        "use server"
        await logout()
      }}
    >
      Sign Out
    </Button>
  )
}
