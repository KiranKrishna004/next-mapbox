import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { logout } from "@/lib/session"

export const Navbar = () => {
  return (
    <div>
      <div className="flex justify-end py-2 pr-12">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary">Kiran Krishna </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuItem
              onClick={async () => {
                "use server"
                await logout()
              }}
            >
              Log out
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Separator />
    </div>
  )
}
