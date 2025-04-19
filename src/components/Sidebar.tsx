import * as React from 'react';
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Package, Settings, HelpCircle, ChevronDown, Menu, LogOut, Upload } from 'lucide-react'
import {useContext, createContext, useState } from "react"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { useAuth } from "./contexts/AuthContext"
import { useToast } from "./hooks/use-toast"
//import { ThemeToggle } from "./ThemeToggle"
import { cn } from "src/utils"

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/parcels", label: "Parcels", icon: Package },
  { href: "/batches", label: "Batch Upload", icon: Upload },
]

export function Sidebar() {
  const location = useLocation()
  const [expanded, setExpanded] = useState(true)
  const { logout } = useAuth()
  const { toast } = useToast()

  const handleLogout = () => {
    logout()
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
  }
  
  return (
    <div className="flex h-screen bg-background">
      <aside
        className={cn(
          "bg-background border-r flex flex-col transition-all duration-300",
          expanded ? "w-[60px]" : "w-[240px]",
        )}
      >
        <div className="p-3 flex items-center justify-between border-b h-[60px]">
          {!expanded && (
            <>
              <div className="flex items-center gap-2">
                <div className="bg-primary text-primary-foreground p-1 rounded">
                  <Package className="h-6 w-6" />
                </div>
                <span className="font-semibold text-foreground">Ship Trac</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setExpanded(true)}>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </>
          )}
          {expanded && (
            <Button variant="ghost" size="icon" className="w-full" onClick={() => setExpanded(false)}>
              <Menu className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex-1 flex flex-col gap-2 p-3">
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                  window.location.href === item.href
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
                    expanded && "justify-center",
                )}
              >
                <item.icon className="h-4 w-4" />
                {!expanded && <span>{item.label}</span>}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-auto border-t p-3">
          <nav className="space-y-2">
            <Link
              to="/settings"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
                expanded && "justify-center",
              )}
            >
              <Settings className="h-4 w-4" />
              {!expanded && <span>Settings</span>}
            </Link>
            <Link
              to="/help"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
                expanded && "justify-center",
              )}
            >
              <HelpCircle className="h-4 w-4" />
              {!expanded && <span>Help & Center</span>}
            </Link>
          </nav>

          
        </div>

        <div className="p-3">
          {/* <ThemeToggle /> */}
        </div>

        <div className="p-3">
          <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            {!expanded && <span>Log out</span>}
          </Button>
        </div>
      </aside>      
    </div> 
  )
}

function NavItem({ to, icon, label, active, isExpanded }: { 
  to: string
  icon: React.ReactNode
  label: string
  active?: boolean
  isExpanded: boolean 
}) {
  return (
    
    <Link
      to={to}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors
        ${active
          ? 'bg-orange-400 text-white justify-start' 
          : 'hover:bg-teal-700 justify-center'
        }`}
    >
      {icon}      
      <span  className={`overflow-hidden transition-all ${
          (isExpanded ? "w-52 ml-3" : "w-0") 
        }`}>{label}</span>
      
    </Link>
  )
}

