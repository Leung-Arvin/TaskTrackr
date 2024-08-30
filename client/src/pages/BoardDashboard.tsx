import { useEffect, useState } from "react"
import Sidebar from "../components/Sidebar"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import axios from "axios"

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

import { BsStar, BsStarFill } from "react-icons/bs"
import { Link, useParams} from "react-router-dom"
import { Button } from "@/components/ui/button"
import { PencilIcon, Trash } from "lucide-react"
import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import { useAuth } from "@/contexts/AuthContext"
import { useUri } from "@/contexts/UriContext"

export type Board = {
  id: string;
  board_title: string;
  date_created: string;
  favorite: boolean;
}

const formSchema = z.object({
  boardTitle: z.string().min(1 ,
    {
      message: "Your board title has to be at least 1 character"
    }
  )
})



const BoardDashboard = () => {
  const {userId} = useParams();
  
  const [editingBoardId, setEditingBoardId] = useState<string | null>(null);
  const [Boards, setBoards] = useState<Board[]>([]);
  const {auth} = useAuth();
  const {uri} = useUri();


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      boardTitle: "",
    },
  })

  useEffect( () => {
    const getBoards = async () => {

      
      const Boards = await axios.get(`${uri}/api/board/all/${userId}`, {
        headers: {
          Authorization: auth
        }
      });
      
      setBoards(Boards.data);
      
    }

    
    getBoards();
  }, [uri, auth, userId])

  const toggleFavorite = async (boardId:string,favorite:boolean) => {
    
    const newFavorite = {
      favorite: !favorite,
    }  

    await axios.post(`${uri}/api/${userId}/board/updateFavorite/${boardId}`,newFavorite, {
      headers: {
        Authorization: auth
      }
    })
  
    setBoards((prevBoards) => (
      prevBoards.map( board => (board.id === boardId) ? {...board, favorite: !board.favorite} : board )
    ))

  }
  
  const handleDelete = async (boardId: string) => {
    await axios.delete(`${uri}/api/${userId}/board/delete/${boardId}`, {
      headers: {
        Authorization: auth
      }
    })
    setBoards(prevBoards => 
      prevBoards.filter( (board) =>  board.id !== boardId)
    )
  }

  const handleEdit = async (values: z.infer<typeof formSchema>, boardId: string | null) => {
    const newTitle = {
      boardTitle: values.boardTitle
    }
    
    await axios.post(`${uri}/api/${userId}/board/updateTitle/${boardId}`, newTitle, {
      headers: {
        Authorization: auth
      }
    });

    
    setBoards(prevBoards =>
      prevBoards.map( board => 
        board.id === boardId ? {...board, board_title: values.boardTitle} : board
      )
     )
  }

  
  return (
    
    <div className="flex">
      
      <Sidebar userId={userId}/>
      <div className="ml-4 mt-20 w-full">
        <h3 className="text-5xl">Board Dashboard</h3>
      <Table className="mt-5">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-2xl">Board Title</TableHead>

            <TableHead className="w-[100px]">Favorite</TableHead>
            <TableHead className="w-[100px]">Edit Table Name</TableHead>
            <TableHead className="w-[100px]">Delete Table</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
         
            {userId ? Boards.map( board => {  
              return (
                
                <TableRow  key={board.id}>
                  <Link to={`/user/${userId}/board/${board.id}`}>
                  <TableCell id="board-title" className="text-lg">
                    
                    {board.board_title}
                  </TableCell>
                  </Link>
                  <TableCell>
                    <button onClick={() => {
                      toggleFavorite(board.id,board.favorite)
                      }}>
                      {board.favorite ? <BsStarFill size={30}/> : <BsStar size={30} />}
                    </button>
                  </TableCell>
                  <TableCell>
                  <Dialog>
                <DialogTrigger className='text-white text-2xl px-4 py-2 bg-blue-950 rounded-lg ml-auto' onClick={() => setEditingBoardId(board.id)}>
                    <PencilIcon/>
                </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Table Name</DialogTitle>
                        <DialogDescription>Fill out your new table</DialogDescription>
                      </DialogHeader>
                      <Form {...form}>
                      <form onSubmit={form.handleSubmit((values) => handleEdit(values, editingBoardId)) } className="space-y-8">
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
                        
                        <Button>Change name</Button>
                      
                      </form>
                </Form>
                    </DialogContent>
                </Dialog>
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => handleDelete(board.id)}variant="destructive"><Trash/></Button>
                  </TableCell>
                      
                </TableRow>
                
              )
            }): <p className="justify-center">Please Login to see Tables</p>}
            
        </TableBody>
      </Table>
      </div>
      
    </div>
  )
}

export default BoardDashboard
