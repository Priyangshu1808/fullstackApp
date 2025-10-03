'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useEffect, useState } from "react"
import { useDebounceCallback} from 'usehooks-ts'
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/Schemas/signUpSchema"
import { Loader2 } from "lucide-react"
import axios, { AxiosError } from "axios"
import { apiResponse } from "@/types/apiResponse"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/options"


 export default function ProfileForm() {
  const [userName, setUserName] = useState("")
  const [userNameMessage, setUserNameMessage] = useState("")
  const [isSubmitting, setisSubmitting] = useState(false)
  const [isCheackingUserName, setisCheackingUserName] = useState(false)
  const router = useRouter()

  const debouncedvalue = useDebounceCallback(setUserName,600)
  
  


  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      userName: "",
      email: "",
      password: ""
    },
  })


  useEffect(() => {
    const checkUserName = async () => {
      if (userName) {
        setisCheackingUserName(true)
        setUserNameMessage('')
        try {
          const response = await axios.get(`/api/check-user-unique?userName=${userName}`)
          setUserNameMessage(response.data.message)
          //console.log("response: ",response)
        } catch (error) {
          const axiosError = error as AxiosError<apiResponse>
          setUserNameMessage(axiosError.response?.data.message || 'An error occurred in checking username')
        }
        finally {
          setisCheackingUserName(false)
        }
      }
    }
    checkUserName()
  }, [userName])


  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    //console.log("data is:", data.userName);
    
    setisSubmitting(true)
    try {
      const response = await axios.post<apiResponse>('/api/sign-up', data)
      //console.log("RESPONSE :",response);
      
      toast('Success', {
        description: response.data.message,
      })
      router.replace(`/verifyCode/${userName}`)
      setisSubmitting(false)
    } catch (error) {
      console.error("Error in signup of user", error)
      const axiosError = error as AxiosError<apiResponse>
      let errorMessage = axiosError.response?.data.message
      toast('Error',
        {
          description: errorMessage || 'Something went wrong!',
          // variant: 'destructive'
        })
      setisSubmitting(false)
    }
  }


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Unknown Message
          </h1>
          <p className="mb-10">Sign up to start your anonymous adventure</p>          
        </div>
        <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="userName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Username" {...field}
                          onChange={(event) => {
                            field.onChange(event)
                            debouncedvalue(event.target.value)
                          }}
                        />
                      </FormControl>

                      {isCheackingUserName && <Loader2 className="animate-spin" />}
                      <p className={`text-sm ${userNameMessage === "Username is available" ? "text-green-500" : "text-red-500"}`}
                      >{userNameMessage}</p>

                      <FormMessage />
                      
                    </FormItem>
                  )}
                />
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
                <Button type="submit" disabled={isSubmitting}>
                  {
                    isSubmitting  ? (
                    <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please wait
                    </>
                    ) : "Submit"
                  }
                </Button>
              </form>
            </Form>
            <div className="text-center mt-4">
              <p>
                Already a member?{''}
                <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">Sign in</Link>
              </p>
            </div>
          </div>
      </div>
    </div>
  )
}





