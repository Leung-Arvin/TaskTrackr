
import TypingAnimation from '@/components/magicui/typing-animation'
import ShimmerButton from '@/components/magicui/shimmer-button'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'


const LandingPage = () => {
  return (
    <div className='h-screen w-screen flex items-center justify-center '>
        <div className='flex flex-row justify-center items-center'>
            <div className='flex flex-col items-center gap-2 ' >
                <TypingAnimation className="text-7xl ml-0" text="TaskTrakr"/>
                <h3 className='text-2xl'>Tracking projects has never been easier</h3>
                <div className='flex flex-row gap-3'>
                <Link to={`/login`}>
                <Button className='p-6 rounded-3xl'>Sign In</Button>
                </Link>
                <Link to={`/signup`}>
                <ShimmerButton>Sign Up</ShimmerButton>
                </Link>
                
                </div>
            </div>
            <img className="h-96 w-96 ml-24"src={`../../notes.png`} alt="" />
        </div>
    </div>
  )
}

export default LandingPage