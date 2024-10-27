"use client"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { signInLogic } from "@/app/actions/signin"

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

      <Button type="submit">Sign in</Button>
    </form>
  )
}
