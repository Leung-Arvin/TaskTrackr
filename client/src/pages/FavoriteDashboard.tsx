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

import { Link, useParams } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"

type Board = {
  board_id: string;
  board_title: string;
  date_created: string;
  favorite: boolean;
}


const FavoriteDashboard = () => {
  const {auth} = useAuth();
  const {userId} = useParams();
  const [Boards, setBoards] = useState<Board[]>([]);

  useEffect( () => {
    const getBoards = async () => {
      const Boards = await axios.get(`http://localhost:5000/api/board/favorites/${userId}`, {
        headers: {
          Authorization: auth
        }
      });
      setBoards(Boards.data);
    }

    
    getBoards();
  }, [auth, userId])


  return (
    
    <div className="flex">
      
      <Sidebar userId={userId}/>
      <div className="ml-4 mt-20 w-full">
        <h3 className="text-5xl">Favorites</h3>
      <Table className="mt-5">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-2xl">Board Title</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>

            {Boards.map( board => {  
              return (
                <TableRow  key={board.board_id}>
                  <TableCell id="board-title" className="text-lg">
                    <Link to={`/user/${userId}/board/${board.board_id}`}>
                    {board.board_title}
                    </Link>
                  </TableCell>

                </TableRow>
              )
            })}
            
        </TableBody>
      </Table>
      </div>
      
    </div>
  )
}

export default FavoriteDashboard
