import { useParams } from 'react-router-dom'
import Board from '../components/Board'
import Sidebar  from '../components/Sidebar'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';


type Board = {
  board_id: string | undefined;
  board_title: string;
  date_created: string;
  favorite: boolean;
}


const Boardpage = () => {
  const {auth} = useAuth();
  const {userId, boardId} = useParams();
  const [board, setBoard] = useState<Board>({
    board_id: '',
    board_title: '',
    date_created: '',
    favorite: false
  });
  

  useEffect(() => {
    const getBoard = async () => {
      const board = await axios.get(`http://localhost:5000/api/${userId}/board/${boardId}`, {
        headers: {
          Authorization: auth
        }
      })

      setBoard(board.data);
      
    }
    getBoard();
    
  }, [auth,userId, boardId])

  
  return (
    <div className='flex min-h-full w-full'>
      <div className='sticky top-0 h-full' >
        <Sidebar userId={userId}/>
      </div>

      <Board title={board.board_title} favorite={board.favorite} boardId={boardId} />
    </div>
  )
}

export default Boardpage
