"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { signUpLogic } from "@/app/actions/signup"

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
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" placeholder="Name" />
      </div>

      <div>
        <label htmlFor="username">User Name</label>
        <input id="username" name="username" placeholder="Username" />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
        />
      </div>

      <Button type="submit">Sign Up</Button>
    </form>
  )
}
