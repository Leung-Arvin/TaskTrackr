import { ArrowLeft, ArrowRight, User } from "lucide-react"
import { useState, useEffect } from "react";
import axios from 'axios';
import { Link, NavLink } from "react-router-dom";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  userId: string | undefined;
  setBoards?: React.Dispatch<React.SetStateAction<number | null>>;
}



const Sidebar = ({userId}: SidebarProps) => {
  const {auth, setAuth} = useAuth();
  const [visible, setVisible]= useState(true);
  const [username,setUsername] = useState('');

  useEffect( () => {
    const getUser = async () => {
      try {
        
        const user = await axios.get(`http://localhost:5000/api/users/id/${userId}`, {
          headers: {
            Authorization: auth
          }
        });
        console.log(user)
        setUsername(user.data.username)
      } catch (err: unknown) {
        console.error((err as Error).message);
      }
      
    }

    getUser();
  }, [auth, userId])

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setUsername('')
    setAuth(null)
  }

  return (
    <>
      
      {visible ? 
      
        (<div className={` h-screen w-80 bg-blue-950 flex flex-col items-center gap-8`}>
          <button className="p-0 m-0" onClick={() => setVisible(false)}>
            <ArrowLeft className='h-10 w-10 ml-64 stroke-white'/>
          </button>
          <div className="flex flex-row gap-1">
            <User className='mr-5 h-10 w-10 stroke-white'/>
            <DropdownMenu>
              <DropdownMenuTrigger>{username ? <p className="text-white text-2xl">{username}</p>: <p className="text-white text-2xl">Guest</p>}</DropdownMenuTrigger>
              <DropdownMenuContent className="p-5">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator/>
                {username ? <DropdownMenuItem><Link to="/" onClick={()=>handleSignOut}>Sign Out</Link></DropdownMenuItem>:  (
                  <>
                  <DropdownMenuItem><Link to="/signup">Sign Up</Link></DropdownMenuItem>
                  <DropdownMenuItem><Link to="/login">Log In</Link></DropdownMenuItem>
                  </>
                  )  }
              </DropdownMenuContent>
            </DropdownMenu>
            
        
          </div>
          <Link to={`/boardForm/${userId}`}>
            <button className='text-white text-2xl px-12 py-4 bg-purple-500 rounded-md' onClick={() => console.log("Hello World")}>
              Add Board
            </button>
          </Link>
          <NavLink to={`/${userId}`} className={({isActive}) => isActive ? "text-2xl text-purple-500" : "text-2xl text-white"}>
            Boards
          </NavLink>
          <NavLink to={`/favorites/${userId}`} className={({isActive}) => isActive ? "text-2xl text-purple-500" : "text-2xl text-white"}>
            Favorites
          </NavLink>
        </div>)
      : (<div>
          <ArrowRight className='h-10 w-10 stroke-black' onClick={() => setVisible(true)}/>
          
      </div> ) 
      
    }
    </>
    
  )
}

export default Sidebar
