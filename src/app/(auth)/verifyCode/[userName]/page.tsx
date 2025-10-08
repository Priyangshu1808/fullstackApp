'use client'
import { verifySchema } from '@/Schemas/verifySchema'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { useParams, useRouter } from 'next/navigation'
import axios, { AxiosError } from 'axios'
import { toast } from 'sonner'
import { apiResponse } from '@/types/apiResponse'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export default function VerifyAccount() {

    const router = useRouter()
    const params = useParams()

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
          otp: ""
        }

    })
    const onSubmit = async (data:z.infer<typeof verifySchema>) =>     
      {
        //console.log("data:",data);
        try {
            const response = await axios.post(`/api/verifyCode`,{
            userName: params.userName,
            otp: data.otp
        })
        toast('Success', {
        description: response.data.message,
      })
      router.replace(`/sign-in`)

    
        } catch (error) {
            console.error("Error in signup of user", error)
                  const axiosError = error as AxiosError<apiResponse>
                  let errorMessage = axiosError.response?.data.message
                  toast('Error',
                    {
                      description: errorMessage || 'Something went wrong!',
                      // variant: 'destructive'
                    })
            
        }
    }


    return (   
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>
             <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verification Code</FormLabel>
                      <FormControl>
                        <Input type=""placeholder="Enter your code" {...field}
                          
                        />
                      </FormControl>

                      <FormMessage />
                      
                    </FormItem>
                  )}
                />
                <Button type="submit" >
                  {
                    form.formState.isSubmitting ? (
                    <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please wait
                    </>
                    ) : "Submit"
                  }         
                </Button>
              </form>
            </Form>
      </div>
      <div id='resend-otp' className='flex justify-center mt-4'>
        <button className='text-sm text-blue-500 hover:underline'>
          Resend OTP
        </button>
      </div>
    </div>
    )

}

