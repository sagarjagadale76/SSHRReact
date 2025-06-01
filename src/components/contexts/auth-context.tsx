"use client"

import * as React from 'react';
import { getCurrentUser, fetchUserAttributes, fetchAuthSession } from "aws-amplify/auth"

interface User {
  username: string
  name?: string
  role?: string
  permissions?: string[]
}

interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
  isLoading: boolean  
}

const AuthContext = React.createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  isLoading: true
  
})

export const useAuth = () => React.useContext(AuthContext)

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = React.useState<User | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
 

  React.useEffect(() => {
    const checkUser = async () => {
      try {
        // Check if user is authenticated
        const currentUser = await getCurrentUser()

        // Get user attributes
        const attributes = await fetchUserAttributes()

        const res = await fetchAuthSession();

        

        setUser({
          username: attributes.email || currentUser.username,
          name: attributes.name,
        })
      } catch (error) {
        // User is not authenticated
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkUser()
  }, [])

  return <AuthContext.Provider value={{ user, setUser, isLoading }}>{children}</AuthContext.Provider>
}
