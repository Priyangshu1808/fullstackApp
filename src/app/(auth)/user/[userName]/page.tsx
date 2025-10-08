'use client'

import { Separator } from "@/components/ui/separator"
import { messageSchema } from "@/Schemas/massageSchema"
import { apiResponse } from "@/types/apiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { useParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"



function Page() {
  const params = useParams()
  //console.log("params: ", params)
  const form = useForm<z.infer<typeof messageSchema>>({
          resolver: zodResolver(messageSchema),
          defaultValues: {
            content: ""
          }
  
      })

      const onSubmit = async (data:z.infer<typeof messageSchema>) =>     
      {
        //console.log("data:",data);
        try {
            const response = await axios.post(`/api/send-message`,{
            userName: params.userName,
            content: data.content
        })
        toast('Success', {
        description: response.data.message,
      })
        

    
        } catch (error) {
            console.error("User not accept message", error)
                  const axiosError = error as AxiosError<apiResponse>
                  const errorMessage = axiosError.response?.data.message
                  toast('Error',
                    {
                      description: errorMessage || 'Something went wrong!',
                      // variant: 'destructive'
                    })
            
        }
    }
    const handleSuggest = async () => {
      try {
        const response = await axios.post('/api/suggest-massage');
        console.log('Suggestions response:', response);
        const suggestions = response.data.suggestions;
        console.log('Suggestions:', suggestions);
        form.setValue('content', suggestions);
        toast('Success', {
          description: 'Suggestions fetched successfully!',
        });
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        toast('Error', {
          description: 'Failed to fetch suggestions. Please try again later.',
        });
      }
    }

    
  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4 text-center">Public profile link</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Send anonymous message to {params.userName}</h2>
        <div className="flex items-center">
          {/* <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          /> */}
          {/* <Button onClick={copyToClipboard}>Copy</Button> */}
        </div>
      </div>
      <div className="mb-4">
      {/* <Switch
        {...register('acceptMessage')}
       checked={acceptMessage}
        onCheckedChange={handleSwitchChange}
        disabled={isSwitching}
      /> */}
      {/* <span className="ml-2">
        Accept Messages: {acceptMessage ? 'On' : 'Off'}
      </span> */}
    </div>
    

   

    {/* <Button
      className="mt-4"
      variant="outline"
      onClick={(e) => {
        e.preventDefault();
        fatchMessage(true)
      }}>{
        loading ? (<Loader2 className='h-4 w-4 animate-spin'/>) : (<RefreshCcw className='h-4 w-4'/>) 
      }</Button> */}

      <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel>Content</FormLabel>
                      <Separator />
                      <FormControl className="">
                        <Input placeholder="content" {...field}
                        />
                      </FormControl>


                      <FormMessage />
                      
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {
                    form.formState.isSubmitting  ? (
                    <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please wait
                    </>
                    ) : "Send It"
                  }
                </Button>
              </form>
            </Form>
      <div className='mt-8 flex flex-row gap-4'>
        {/* {
          messages.length > 0 ? (messages.map((message, Index) => (
             <MessageCard key={Index} message={message} index= {Index+1} onMessageDelete={handleDeleteMessage}/>
            
          ))): (<p>No message found</p>)
        } */}
      </div>



      {/* <Button variant="outline" onClick={handleSuggest} className="mt-4">
        Suggest Message
      </Button> */}



    </div>
  );
}

export default Page