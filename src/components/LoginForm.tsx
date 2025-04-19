'use client'

import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { useToast } from './hooks/use-toast'
//import users from './db/users.JSON'
import { useAuth } from './contexts/AuthContext'


const users = [
  {
    "username": "admin",
    "password": "admin123",
    "role": "admin",
    "ShipperName":"Just in Time Consulting Ltd"
  },
  {
    "username": "user",
    "password": "user123",
    "role": "user",
    "ShipperName":"Just in Time Consulting Ltd"
  }
]


export default function LoginForm() {
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const { toast } = useToast()
  let navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await login(username, password)
    if (success) {
      toast({
        title: "Login Successful",
        description: `Welcome, ${username}! Redirecting to dashboard...`,
      })
      navigate('/dashboard')
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid username or password.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
    <Card className="w-[350px]">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Login</CardTitle>
        <CardDescription>Enter your credentials to access your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">Login</Button>
        </form>
      </CardContent>
    </Card>
    </div>
  )
}

