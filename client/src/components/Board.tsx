import React, { useEffect, useState } from 'react'
import { BsStar, BsStarFill } from 'react-icons/bs';
import { Button } from './ui/button';
import TaskForm from './TaskForm'
import axios from 'axios';
import Task from './Task';
import { useAuth } from '@/contexts/AuthContext';
import { useParams } from 'react-router-dom';

type Board = {
  board_id: string;
  board_title: string;
  date_created: string;
  favorite: boolean;
}

interface BoardProps {
  title: string | undefined;
  favorite: boolean;
  boardId: string;
  setBoards: React.Dispatch<React.SetStateAction<Board[]>>;
}

export type status =  "To-Do" | "In Progress" | "Completed";

type task = {
  id: string,
  title: string,
  description: string,
  status: "To-Do" | "In Progress" | "Completed",
}

const statuses: status[] = ['To-Do', 'In Progress', 'Completed'];

const Board = ({title,favorite, setBoards}: BoardProps) => {
  const {userId, boardId} = useParams();
  const {auth} = useAuth();
  const [isFavorite, setIsFavorite] = useState<boolean>(favorite || false);
  const [tasks, setTasks] = useState<task[]>([]);
  
  const columns = statuses.map((status) => {

    const tasksInColumn = tasks.filter((task) => task.status === status)
    return {
      status,
      tasks: tasksInColumn
    }
  })

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, status: status) => {
    e.preventDefault()
    console.log(status);
    const id = e.dataTransfer.getData("id")
    const task = tasks.find((task) => task.id == id)
    const newStatus = {
      status: status
    }
    if (task) {
      await axios.post(`http://localhost:5000/api/${userId}/task/updatestatus/${id}`, newStatus , {
        headers: {
          Authorization: auth
        }
      })
      setTasks(prevTasks => {
        console.log('previous Tasks', prevTasks);
        const updatedTasks = prevTasks.map(task => task.id == id ? {...task, status}: task) 
        console.log('UpdatedTasks:',updatedTasks)
        return updatedTasks;
      }
      )
      console.log(tasks);
    }
    
  }

  const toggleFavorite = async (favorite: boolean) => {
    const newFavorite = {
      favorite: !favorite
    }
    
    await axios.post(`http://localhost:5000/api/${userId}/board/updateFavorite/${boardId}`, newFavorite , {
      headers: {
        Authorization: auth
      }
    })
    

    setIsFavorite(prevFavorite => !prevFavorite)
    setBoards(prevBoards => 
      prevBoards.map( board => board.board_id === boardId ? {...board, favorite:!favorite}: board)
    )

  }

  useEffect(() => {
    setIsFavorite(favorite);

    const getTasks = async () => {
      const tasks = await axios.get(`http://localhost:5000/api/${userId}/task/getall/${boardId}`, {
        headers: {
          Authorization: auth
        }
      });
      console.log(tasks.data);
      setTasks(tasks.data);
      
    }
    getTasks();
  },[userId, auth, favorite, boardId])

  return (
    <div className='w-full m-20'>
      <div className='flex flex-row'>
        <h1 className='text-6xl mr-5 mb-6'>{title}</h1>
        <button onClick={() => toggleFavorite(isFavorite)}>
          {isFavorite ?  <BsStarFill size={40}/>: <BsStar size={40}/>}  
        </button>
      </div>
      <div id="boardMenu" className='flex flex-row w-full gap-2'>
        <Button className='w-40 h-16 text-xl'> Kanban</Button>
        <Button className='w-40 h-16 text-xl'> Timeline</Button>
        <TaskForm boardId={boardId} setTask={setTasks}/>
      </div>
      <div className='flex flex-row gap-4 w-auto'>
      {columns.map((column) => (
        <div  key={column.status}className='flex flex-col flex-1 mt-5' onDrop={(e) => handleDrop(e,column.status)} onDragOver={(e) => e.preventDefault()}>
          <h1 className='text-xl font-bold'>{column.status}</h1>
          {column.tasks.map((task) => 
          <Task
          key={task.id}
          title={task.title} 
          description = {task.description}
          status={task.status}
           id={task.id} 
           setTasks={setTasks}/>)}
        </div>
      )
        
      )}
      </div>
    </div>
  )
}

export default Board
