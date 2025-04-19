'use client'

import * as React from 'react';
import { createContext, useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";


type User = {
  username: string;
  role: string;
  ShipperName: string;
}

type AuthContextType = {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useNavigate()

  useEffect(() => {
    // Check for existing session on initial load
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (username: string, password: string) => {
    // In a real app, you'd validate credentials against your backend
    const users = [
      { username: 'admin', password: 'admin123', role: 'admin',ShipperName:'Just in Time Consulting Ltd' },
      { username: 'user', password: 'user123', role: 'user', ShipperName:'Just in Time Consulting Ltd' },
    ]
    const user = users.find(u => u.username === username && u.password === password)
    if (user) {
      setUser({ username: user.username, role: user.role, ShipperName:user.ShipperName})
      localStorage.setItem('user', JSON.stringify({ username: user.username, role: user.role }))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    router('/login')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
 
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

