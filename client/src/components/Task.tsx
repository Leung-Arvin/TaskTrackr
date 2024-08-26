import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from './ui/badge';
import { PencilIcon, X } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';

type task = {
  id: string,
  title: string,
  description: string,
  status: "To-Do" | "In Progress" | "Completed",
}

interface taskProps {
  title: string,
  description: string,
  status: string,
  id: string,
  setTasks: React.Dispatch<React.SetStateAction<task[]>>,
  
}

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

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

import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import { Button } from './ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useParams } from 'react-router-dom';

const formSchema = z.object({
  task_title: z.string().min(2, {
    message: "Task title must be longer than two characters"
  }),
  task_description: z.string().min(2, {
    message: "description must be longer than two characters"
  })
})

const Task = ({title, description,status, id, setTasks}:taskProps) => {
  const {userId} = useParams();
  const {auth} = useAuth();
  const [hover,setHover] = useState(false);
  const [active, setActive] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      task_title: title,
      task_description: description,
    },
  })

  const handleDelete = async () => {
    
    await axios.delete(`http://localhost:5000/api/${userId}/task/delete/${id}`, {
      headers: {
        Authorization: auth
      }
    });
    
    setTasks(prevTasks => prevTasks.filter((task) => task.id !== id ))
  }

  const handleEdit = async (values: z.infer<typeof formSchema>, taskId: string|null) => {
    if (values.task_title != title) {
      const newTitle = {
        title: values.task_title
      }

      await axios.post(`http://localhost:5000/api/${userId}/task/updatetitle/${taskId}`, newTitle, {
        headers: {
          Authorization: auth
        }
      })
    }

    if (values.task_description != description) {
      const newDescription = {
        description: values.task_description
      }

      await axios.post(`http://localhost:5000/api/${userId}/task/updatedescript/${taskId}`, newDescription, {
        headers: {
          Authorization: auth
        }
      })
    }

    setTasks(prevTasks => 
      prevTasks.map( task => 
        task.id == taskId ? { ...task, title: values.task_title, description: values.task_description } : task
      )
    )

  }

  return (
      
      <Card className={`p-2 max-w-md cursor-grabbing ${active && "bg-slate-500"}`} draggable 
      onDragStart={(e) => { e.dataTransfer.setData("id", id); setActive(true)}} 
      onDragEnd={() => setActive(false)}
      onMouseEnter={() => setHover(true)} 
      onMouseLeave={() => setHover(false)}>
        
        {hover && <X onClick={() => handleDelete()}/>}
        
        <CardHeader>
        <CardTitle className='flex flex-row gap-2'>
          {title}
          <Dialog>
          {hover && <DialogTrigger> <PencilIcon size={20}/></DialogTrigger>}
         
                
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Table Name</DialogTitle>
                        <DialogDescription>Fill out your new table</DialogDescription>
                      </DialogHeader>
                      <Form {...form}>
                      <form onSubmit={form.handleSubmit((values) => { handleEdit(values,id)}) } className="space-y-8">
                        <FormField
                          control= {form.control}
                          name="task_title"
                          render={({field})=> (
                            <FormItem>
                              <FormLabel>Edit Task Title</FormLabel>
                              <FormControl>
                                <Input className='rounded-[5px]' placeholder="Epic task name" {...field}/>
                              </FormControl>
                              <FormDescription>
                                This will become your task name
                              </FormDescription>
                              <FormMessage/>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control= {form.control}
                          name="task_description"
                          render={({field})=> (
                            <FormItem>
                              <FormLabel>Edit Task Description</FormLabel>
                              <FormControl>
                                <Input className='rounded-[5px]' placeholder="Epic task description" {...field}/>
                              </FormControl>
                              <FormDescription>
                                This will become your task description
                              </FormDescription>
                              <FormMessage/>
                            </FormItem>
                          )}
                        />
                        
                        <Button>Finish editing</Button>
                      
                      </form>
                </Form>
                    </DialogContent>
                </Dialog>
        </CardTitle>
        <CardDescription>
          {status === "To-Do" ? <Badge className="bg-red-500"variant="default">{status}</Badge> :
           status === "In Progress" ? <Badge className="bg-orange-600"variant="default">{status}</Badge> :
           <Badge className="bg-green-600"variant="default">{status}</Badge>}
          
        </CardDescription>
        </CardHeader>
        <CardContent className='max-w-50'>
          {description}
        </CardContent>
      </Card>
  )
}

export default Task
