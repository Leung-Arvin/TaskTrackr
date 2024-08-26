import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form" 
import {Input} from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowBigLeft } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"


const formSchema = z.object({
  boardTitle: z.string().min(1 ,
    {
      message: "Your board title has to be at least 1 character"
    }
  ),
})

const BoardForm = () => {
  // const [title,setTitle] = useState('');
  const {auth} = useAuth();
  const {userId} = useParams();
  const navigate = useNavigate();

  // defining form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      boardTitle: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const newTitle = { boardTitle: values.boardTitle};
    try {
      await axios.post(`http://localhost:5000/api/board/${userId}`, newTitle, {
        headers: {
          Authorization: auth
        }
      })
      navigate(`/${userId}`);
    } catch (err: unknown) {
      console.error((err as Error).message)
    }
  }

  return (
    <div className='h-full w-full flex items-center justify-center'>
      <Card className='p-20 rounded-xl'>
        <Button 
          onClick={()=> {navigate(`/${userId}`)}} 
          variant="link"
          > <ArrowBigLeft/> Back</Button>
        <CardHeader>
          <CardTitle className=" text-4xl">Board Creation</CardTitle>
          <CardDescription className=" text-md">Time to make a new board</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control= {form.control}
                name="boardTitle"
                render={({field})=> (
                  <FormItem>
                    <FormLabel>Board Title</FormLabel>
                    <FormControl>
                      <Input className='rounded-[5px]' placeholder="Epic board name" {...field}/>
                    </FormControl>
                    <FormDescription>
                      This will become your board name
                    </FormDescription>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              
              <Button>Create Board</Button>
             
            </form>

          </Form>

         
        </CardContent>
      </Card>
    </div>
  )

}

export default BoardForm
