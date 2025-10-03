'use client'
import { useSession, signOut } from "next-auth/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { signInSchema } from "@/Schemas/signInSchema"
import { signIn } from "next-auth/react"
import { useEffect } from "react"
import { apiResponse } from "@/types/apiResponse"
import axios, { AxiosError } from "axios"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/options"



export default function LoginForm() {
  const router = useRouter()
  // const session = await getServerSession(authOptions)

  // if (session) {
  //   router.replace('/dashboard')
  // }

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  })



  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    //console.log("data is:", data);
    const response = await signIn('credentials', {
      redirect: false,
      email: data.email,
      password: data.password

    })

    //console.log("response is :", response)
    if (response?.error) {
      toast('Error', {
        description: response.error,
      })

    }
    if (response?.url)
      router.replace(`/dashboard`)

  }


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Unknown Message
          </h1>
          <p className="mb-10">Sign in to start your anonymous adventure</p>
        </div>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
                {
                  form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                    </>
                  ) : "Submit"
                }
              </Button>
            </form>
          </Form>
          <div className="text-center mt-4">
            <p>
              New member?{''}
              <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">Sign up</Link>
            </p>
          </div>
        </div>

      </div>
      </div>

      )
}


