"use client"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { signInLogic } from "@/app/actions/signin"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-label"

export function SigninForm() {
  const { toast } = useToast()
  const handleSignIn = async (formData: FormData) => {
    const signInObj = {
      username: formData.get("username"),
      password: formData.get("password"),
    }

    const response = await signInLogic(signInObj)
    if (response?.error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: response.error,
      })
    }
  }

  return (
    <form action={handleSignIn}>
      <Card>
        <CardContent className="space-y-2">
          <div className="space-y-1">
            <Label htmlFor="username">Username</Label>
            <Input name="username" id="username" placeholder="Pedro Duarte" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input
              name="password"
              id="password"
              placeholder="********"
              type="password"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button>Login</Button>
        </CardFooter>
      </Card>
    </form>
  )
}
