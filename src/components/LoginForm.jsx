"use client"

import { useState,useCallback } from "react"
import { useNavigate, useLocation, Link, data } from "react-router-dom"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn,signOut } from "aws-amplify/auth"
import { Loader2, Lock, Mail, AlertCircle } from "lucide-react"

import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Alert, AlertDescription } from "./ui/alert"
import { Separator } from "./ui/separator"
import { useAuth } from "./contexts/auth-context"
import axios from "axios"

// Form validation schema
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
})

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [userdetails, setUserDetails] = useState({
    "UserName": "",
    "Role": "",
    "Permissions": [""]

  });
 
  const navigate = useNavigate()
  const location = useLocation()
  const { setUser } = useAuth()

  // Get the redirect path from location state or default to dashboard
  const from = location.state?.from?.pathname || "/dashboard"

  // Initialize form
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const userdetail = useCallback((username) => {
        const userData = {
           UserName: username,
      
        };
      debugger;
      axios(
        {
          method: "POST",
          url: "https://j34183xbc8.execute-api.eu-west-2.amazonaws.com/dev/getSystemUsers",
          headers: { "x-api-key" : "TYXQrJvtOT1ac268C3eb0962We9XUlJu1Dls8Rvu" },
          data: userData
        }            
    )
    .then(response => { 
      debugger;
      const results = {
        UserName: response.data[0].UserName,
        Role: response.data[0].Role,
        Permissions: response.data[0].UserPermissions.split(","),
        ShipperAccountCode: response.data[0].ClientNumber || ""
      };
      // Store results in the results array
      
  
      setUserDetails(results);
      localStorage.setItem("userdetails", JSON.stringify(results));    
          window.location.reload();    

    })
    
  });

  // Handle form submission
  const onSubmit = async (data) => {
    debugger;
    setIsLoading(true)
    setError(null)

    

    try {
      // Sign in with Cognito
      const { isSignedIn, nextStep } = await signIn({
        username: data.username,
        password: data.password,
      })

      if (isSignedIn) {
        debugger
        userdetail(data.username);
        // Update auth context
        setUser({ username: data.username, role: userdetails.Role, permissions: userdetails.Permissions });
        
        // Redirect to dashboard or previous page
        navigate(from, { replace: true })        
        
      } else if (nextStep?.signInStep === "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED") {
        navigate(`/reset-password?username=${encodeURIComponent(data.username)}`)
      }
    } catch (err) {
      // Handle different error types
      if (err instanceof Error) {
        switch (err.name) {
          case "UserNotConfirmedException":
            setError("Please confirm your account via the email we sent you")
            break
          case "NotAuthorizedException":
            setError("Incorrect username or password")
            break
          case "UserNotFoundException":
            setError("User not found")
            break
          case "UserAlreadyAuthenticatedException":
             navigate(from, { replace: true })
             window.location.reload();
            break
          default:
            setError(`Login failed: ${err.message}`)
        }

        await signOut();
      } else {
        setError("An unknown error occurred")
        await signOut();
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Handle forgot password
  const handleForgotPassword = () => {
    const username = form.getValues("username")

    if (username) {
      navigate(`/forgot-password?username=${encodeURIComponent(username)}`)
    } else {
      navigate("/forgot-password")
    }
  }

  return (
  <div className="flex items-center justify-center min-h-screen bg-background"> 
    <Card className="w-[450px]">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
        <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username or Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Enter your username or email"
                        className="pl-10"
                        {...field}
                        disabled={isLoading}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        className="pl-10"
                        {...field}
                        disabled={isLoading}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>
        
      </CardContent>
      
    </Card>
    </div> 
  )
}
