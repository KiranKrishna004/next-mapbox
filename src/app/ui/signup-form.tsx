"use client"

import { signUpLogic } from "@/app/actions/signup"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Label } from "@radix-ui/react-label"

export function SignupForm() {
  const { toast } = useToast()

  const handleSignUp = async (formData: FormData) => {
    const signUpObj = {
      name: formData.get("name"),
      username: formData.get("username"),
      password: formData.get("password"),
    }

    const response = await signUpLogic(signUpObj)

    if (response?.error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: response.error,
      })
    }
  }

  return (
    <form action={handleSignUp}>
      <Card>
        <CardContent className="space-y-2">
          <div className="space-y-1">
            <Label htmlFor="username">Username</Label>
            <Input name="username" id="username" placeholder="Pedro Duarte" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="name">Name</Label>
            <Input name="name" id="name" placeholder="Pedro Duarte" />
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
          <Button>Signup</Button>
        </CardFooter>
      </Card>
    </form>
  )
}
