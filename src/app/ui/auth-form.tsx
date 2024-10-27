import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SignupForm } from "./signup-form"
import { SigninForm } from "./signin-form"

export function AuthForm() {
  return (
    <div className="flex justify-center mt-80 h-full">
      <Tabs defaultValue="signin" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Log-In</TabsTrigger>
          <TabsTrigger value="signup">Sign-Up</TabsTrigger>
        </TabsList>
        <TabsContent value="signin">
          <SigninForm />
        </TabsContent>
        <TabsContent value="signup">
          <SignupForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}
