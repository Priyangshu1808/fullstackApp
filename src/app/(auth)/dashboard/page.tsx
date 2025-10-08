'use client'
import {MessageCard} from '@/components/messageCard'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { message } from '@/model/user'
import { acceptMessageSchema } from '@/Schemas/acceptMassageSchema'
import { apiResponse } from '@/types/apiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Loader2, RefreshCcw } from 'lucide-react'
import { set } from 'mongoose'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Controller } from "react-hook-form"
function Dashboard() {
  const [messages, setMessages] = useState<message[]>([])
  const [loading, setLoading] = useState(false)
  const [isSwitching, setIsSwitching] = useState(false)
  

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((msg) => msg._id !== messageId))
  }
  const { data: session} = useSession()

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema)
  })

  const {watch, register, setValue} = form

  const acceptMessage = watch('acceptMessage')

   //console.log("AcceptMessages:",acceptMessage)
   
   const fatchAcceptMessage = useCallback( async() => {
    setIsSwitching(true)
    try {
      const response = await axios.get<apiResponse>('/api/accept-message')
      setValue('acceptMessage',response.data.isAcceptMessage as boolean)
      //console.log("response.data.isAcceptMessage: ",response.data.isAcceptMessage)
    } catch (error) {
      const axiosError = error as AxiosError<apiResponse>
      console.log("Error fetching messages:", error)
      toast('Error',{
        description: axiosError.response?.data.message || 'Error fetching message preference'
      })
    } finally {
      setIsSwitching(false)
    }
   }, [setValue])

   const fatchMessage = useCallback( async(refresh: boolean = false) => {
    setLoading(true)
    setIsSwitching(false)
    //console.log("messages:", messages)
    try {
      const response = await axios.get<apiResponse>('/api/get-message')
      //console.log("Fetch Message Response:", response);
      
      setMessages(response.data.messages || [ ])
      if(refresh){
        toast('Refreshed Messages',{
          description: "Showing latest message"
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<apiResponse>
      console.log("Error fetching messages in dashboard:", error)
      toast('Error',{
        description: axiosError.response?.data.message || 'Error fetching message preference'
      })
      
    }
    
    finally {
      setLoading(false)
      setIsSwitching(false)
    }
   }, [setLoading, setMessages])

  

   useEffect(() => {
    if(!session || !session.user) return 
    fatchAcceptMessage()
    fatchMessage()
    
   },[session,setValue,fatchAcceptMessage,fatchMessage])
//console.log("messages:", messages)
  const handleSwitchChange = async() => {
    // setValue("acceptMessage", val)
    try {
      const response = await axios.post<apiResponse>('/api/accept-message',{acceptMessage: !acceptMessage})
      //console.log("Switch Response:", response);
      // setIsSwitching(!isSwitching)
      watch("acceptMessage")
      setValue('acceptMessage', !acceptMessage)
      toast('Success',{
        description: response.data.message
      })
    } catch (error) {
      const axiosError = error as AxiosError<apiResponse>
      console.log("Error switching message preference:", axiosError)
      toast('Sus',{
        description: axiosError.response?.data.message || 'Error switching message preference'
      })
      //setValue("acceptMessage", !val)
    }
    
   } 

   //console.log("messages:", messages)
   const userName = session?.user?.userName;
   const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
   //const baseUrl = `${window.location.protocol}//${window.location.host}` ;
   const profileUrl = `${baseUrl}/user/${userName}`

   const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl)
      toast('Copied to clipboard',{
        description: "Profile link copied to clipboard"
      })
    } catch (error) {
      console.log("Error copying to clipboard:", error)
      toast('Error',{
        description: "Failed to copy profile link"
      })
    }
  }

   if(!session || !session.user){
    return(
      <div>
        <p className='text-lg'>You must be logged in to view this page.</p>
      </div>
    )
    
   }
   //console.log("messages:", messages)

   return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>
      <div className="mb-4">
      {/* <Switch
        {...register('acceptMessage')}
        checked={acceptMessage}      
        onCheckedChange={handleSwitchChange}
        disabled={isSwitching}
       
      /> */}
      {/* <input
        type="checkbox"
        className="toggle toggle-primary"
        {...register('acceptMessage')}
        //  checked={acceptMessage}
         onChange={handleSwitchChange}
        // disabled={isSwitching}
      /> */}

      <Controller
  name="acceptMessage"
  control={form.control}
  render={({ field }) => (
    <input
      type="checkbox"
      className="toggle toggle-primary"
      checked={!!field.value}
      onChange={(e) => {
        field.onChange(e.target.checked);
        handleSwitchChange();
      }}
      disabled={isSwitching}
    />
  )}
/>
      
      <span className="ml-2">
        Accept Messages: {acceptMessage ? 'On' : 'Off'}
      </span>
    </div>
    

    <Separator />

    <Button
      className="mt-4"
      variant="outline"
      onClick={(e) => {
        e.preventDefault();
        fatchMessage(true)
      }}>{
        loading ? (<Loader2 className='h-4 w-4 animate-spin'/>) : (<RefreshCcw className='h-4 w-4'/>) 
      }</Button>
      <div className='w-full max-w-sm  flex flex-col   bg-white border border-gray-200 shadow-md'>
        {
          messages.length > 0 ? (messages.map((message, index) => (
             <MessageCard key={message._id as string} message={message} onMessageDelete={handleDeleteMessage}/>
            
          ))): (<p>No message found</p>)
        }
      </div>
    </div>
  );
}

export default Dashboard

