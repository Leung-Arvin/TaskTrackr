import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import {
  useToast,

} from "@/components/ui/use-toast"

import { z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import axios from "axios"

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useAuth } from "@/contexts/AuthContext"
import { useParams } from "react-router-dom"
import { useUri } from "@/contexts/UriContext"



type task = {
  id: string,
  title: string,
  description: string,
  status: "To-Do" | "In Progress" | "Completed",
}


interface TaskFormProps {
  boardId: string | undefined;
  setTask: React.Dispatch<React.SetStateAction<task[]>>;
}

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be longer than 2 characters"
  }),
  taskDescription: z.string().min(2 , {
    message: "Description must be longer than 2 characters"
  })
})


const TaskForm = ({boardId, setTask} : TaskFormProps) => {
  const {userId} = useParams();
  const {auth} = useAuth();
  const {uri} = useUri();
  const {toast} = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      taskDescription: "",
    }
  })

  const onSubmit = async (values: z.infer<typeof formSchema> ) => {
  
    const newTask = {
      title: values.title,
      description: values.taskDescription,
      status: "To-Do"
    }

    const createdTask = await axios.post(`${uri}/api/${userId}/createtask/${boardId}`, newTask, {
      headers: {
        Authorization: auth
      }
    });

    setTask(prevTasks => 
    [...prevTasks, createdTask.data]
   )
    toast({title: "New Task has been added"
    })
  }

  return (
    <div>
      <Dialog>
        
        <DialogTrigger><Button className="p-8 text-xl">Add Task</Button></DialogTrigger>
        <DialogContent>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
          <FormField 
            control = {form.control}
            name="title"
            render={({field})=> (
              <FormItem>
                <FormLabel>Task Title</FormLabel>
                <FormControl>
                  <Input type="title" placeholder="task name" {...field}/>
                </FormControl>
                
                </FormItem>
              
              
            )}
          />
          <FormField 
            control = {form.control}
            name="taskDescription"
            render={({field})=> (
              <FormItem>
                
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input type="description" placeholder="task description" {...field}/>
                </FormControl>
                <FormMessage/>
              </FormItem>
              
              
            )}
          />
          <Button type="submit">Create Task</Button>
          </div>
        </form>
      </Form>

        </DialogContent>
      </Dialog>
    </div>
  )
}

export default TaskForm
