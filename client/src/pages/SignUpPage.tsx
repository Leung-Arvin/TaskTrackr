import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"

import {
  toast,

} from "@/components/ui/use-toast"

import { z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import axios from "axios"

import { useNavigate }from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext"
import { useUri } from "@/contexts/UriContext"

const formSchema = z.object({
  username: z.string().min(2, {
    message: "username must be longer than 2 characters"
  }),
  password: z.string().min(8, {
    message: "password must be longer than 8 characters"
  })
})


const SignUpPage = () => {
  const {setAuth} = useAuth();
  const {uri} = useUri();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: ""
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
    const user = {username:values.username, password: values.password};
    const newUserAccessToken = await axios.post(`${uri}/api/users`, user);
    if (newUserAccessToken.data.accessToken != "unauthorized") {
      const user = await axios.get(`${uri}/api/users/${values.username}`, {
        headers: {
          Authorization: 'Bearer ' + newUserAccessToken.data.accessToken
        }
      });
      
      localStorage.setItem('token', 'Bearer ' + newUserAccessToken.data.accessToken)
      setAuth('Bearer ' + newUserAccessToken.data.accessToken)      
      navigate(`/${user.data.id}`)
    } else {
      toast({title:"User is not authorized"})
    }  
    
  
    
    } catch (err) {
      toast({title: "Something went wrong"})
      console.error(err)
    }
  }

  return (
    <div className="h-full flex justify-center items-center">
      <Card>
        <CardHeader>
          Welcome, please sign up below
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control= {form.control}
                name="username"
                render={({field})=> (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input className='rounded-[5px]' placeholder="Epic username" {...field}/>
                    </FormControl>
                    <FormDescription>
                      Please insert a username longer than 2 characters
                    </FormDescription>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <FormField
                control= {form.control}
                name="password"
                render={({field})=> (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input  type="password" className='rounded-[5px]' placeholder="Epic password" {...field}/>
                    </FormControl>
                    <FormDescription>
                      Please insert a secure password longer than 8 characters
                    </FormDescription>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              
              <Button>Sign Up</Button>
             
            </form>

          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default SignUpPage
