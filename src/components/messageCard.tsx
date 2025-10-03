import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import axios from "axios"
import { message } from "@/model/user"
import { apiResponse } from "@/types/apiResponse"
import { toast } from "sonner"
import { X } from "lucide-react"

type messageProps = {
  message: message
  onMessageDelete: (messageId: string) => void
}

export function MessageCard({message, onMessageDelete}: messageProps) {
  
  //console.log("Message ID:", message._id);


    const handleDeleteConfirm = async() => {
        const response = await axios.delete<apiResponse>(`/api/delete-message/${message._id}`)
        toast('Success', {
        description: response.data.message,
      })
      onMessageDelete(message._id as string)
    }

  return (
    <Card className="w-full max-w-sm  flex flex-col justify-between bg-white border border-gray-200 shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Message 👇🏻</CardTitle>
        
 
    
  

        <CardDescription className="break-words text-3xl text-center text-black font-serif">
         <div> {message.content}</div>
        </CardDescription>
        <AlertDialog>
      <AlertDialogTrigger asChild className="mt-4 mb-0 pt-0">
        <Button variant="destructive" className="p-2">Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

        <CardAction>
         
        </CardAction>
      </CardHeader>
      <CardContent>
        
      </CardContent>
      <CardFooter >
        
      </CardFooter>
    </Card>
  )
}

