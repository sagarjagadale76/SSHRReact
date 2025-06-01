"use client"
import { Link, useLocation, useNavigate } from "react-router-dom"
import {
  LayoutDashboard,
  Package,
  Settings,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Menu,
  LogOut,
  Upload,
  User,
  CreditCard,
  Shield,
  FileText,
  Truck,
  House,
  Table2,
} from "lucide-react"
import { Button } from "./ui/button"
import { useToast } from "./hooks/use-toast"
import { useAuth } from "./contexts/auth-context"
//import { ThemeToggle } from "./ThemeToggle"
import { cn } from "src/utils"
import { signOut } from "aws-amplify/auth"

import * as React from 'react';

// Define submenu items for each main menu item
let menuItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    submenu: [], // No submenu for dashboard
    permissions: "View-Dash",
  },
  {
    href: "/parcels",
    label: "Parcels",
    icon: Package,
    submenu: [],
    permissions: "View-Parcel"
  },
  {
    href: "/batches",
    label: "Batch Upload",
    icon: Upload,
    submenu: [],
    permissions: "View-Batch"
  },
  {
    href: "/STCR",
    label: "Report",
    icon: Table2 ,
    submenu: [],
    permissions: "View-Reports"
  }

]

let settingsItems = [
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
    submenu: [
      { href: "/settings/warehouse", label: "Warehouse", icon: House, permissions:"Warehouses"},
      { href: "/settings/manage-access", label: "Manage Access", icon: User, permissions:"UsersManageAccess" }
      
    ],
    permissions: "View-Settings"
  }
]

interface User {
  UserName: string
  Role: string
  Permissions: string[]
}

export function Sidebar() {
  const location = useLocation()
  const [expanded, setExpanded] = React.useState(true)
  const [activeSubmenu, setActiveSubmenu] = React.useState<string | null>(null)
  const { setUser,user } = useAuth()
  const { toast } = useToast()
  const router = useNavigate()
  const [userDetail, setUserDetail] = React.useState<User>(null)

  debugger;
const stored : User = JSON.parse(localStorage.getItem("userdetails"));

  menuItems = menuItems.filter((item) => {

    if (!item.permissions) return true
    if (!stored || !stored.Permissions) return false
    return stored.Permissions.includes(item.permissions)
  });

settingsItems = settingsItems.filter((item) => {

    if (!item.permissions) return true
    if (!stored || !stored.Permissions) return false

    item.submenu = item.submenu.filter((subItem) => {
      if (!subItem.permissions) return true
      if (!stored || !stored.Permissions) return false
      return stored.Permissions.includes(subItem.permissions)});

    return stored.Permissions.includes(item.permissions) 
  });

  const clearCacheData = () => {
    caches.keys().then((names) => {
      names.forEach((name) => {
        caches.delete(name)
      })
    })
  }

  const handleLogout = async () => {
    try {
      await signOut()
      router("/login")
      setUser(null)
      clearCacheData()
      localStorage.clear();
      window.location.reload()
    } catch (error) {
      console.error("Error signing out: ", error)
    }
  }

  const toggleSubmenu = (href: string) => {
    if (activeSubmenu === href) {
      setActiveSubmenu(null)
    } else {
      setActiveSubmenu(href)
    }
  }

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + "/")
  }

  const hasSubmenu = (item: any) => {
    return item.submenu && item.submenu.length > 0
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
              <div key={item.href} className="flex flex-col">
                <div className="flex items-center">
                  {hasSubmenu(item) && !expanded ? (
                    <div
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors cursor-pointer",
                        isActive(item.href)
                          ? "bg-secondary text-secondary-foreground"
                          : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
                        expanded && "justify-center",
                      )}
                      onClick={() => toggleSubmenu(item.href)}
                    >
                      <item.icon className="h-4 w-4" />
                      {!expanded && (
                        <>
                          <span className="flex-1">{item.label}</span>
                          <ChevronRight
                            className={cn(
                              "h-4 w-4 transition-transform",
                              activeSubmenu === item.href && "transform rotate-90",
                            )}
                          />
                        </>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                        isActive(item.href)
                          ? "bg-secondary text-secondary-foreground"
                          : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
                        expanded && "justify-center",
                      )}
                      onClick={() => hasSubmenu(item) && !expanded && toggleSubmenu(item.href)}
                    >
                      <item.icon className="h-4 w-4" />
                      {!expanded && (
                        <>
                          <span className="flex-1">{item.label}</span>
                          {hasSubmenu(item) && (
                            <ChevronRight
                              className={cn(
                                "h-4 w-4 transition-transform",
                                activeSubmenu === item.href && "transform rotate-90",
                              )}
                            />
                          )}
                        </>
                      )}
                    </Link>
                  )}
                </div>

                {/* Submenu */}
                {hasSubmenu(item) && activeSubmenu === item.href && !expanded && (
                  <div className="ml-6 mt-1 space-y-1 border-l pl-2">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.href}
                        to={subItem.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-md text-xs transition-colors",
                          isActive(subItem.href)
                            ? "bg-secondary/70 text-secondary-foreground"
                            : "text-muted-foreground hover:bg-secondary/30 hover:text-foreground",
                        )}
                      >
                        <subItem.icon className="h-3.5 w-3.5" />
                        <span>{subItem.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-auto border-t p-3">
          <nav className="space-y-2">
            {settingsItems.map((item) => (
              <div key={item.href} className="flex flex-col">
                <div className="flex items-center">
                  {hasSubmenu(item) && !expanded ? (
                    <div
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors cursor-pointer",
                        isActive(item.href)
                          ? "bg-secondary text-secondary-foreground"
                          : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
                        expanded && "justify-center",
                      )}
                      onClick={() => toggleSubmenu(item.href)}
                    >
                      <item.icon className="h-4 w-4" />
                      {!expanded && (
                        <>
                          <span className="flex-1">{item.label}</span>
                          <ChevronRight
                            className={cn(
                              "h-4 w-4 transition-transform",
                              activeSubmenu === item.href && "transform rotate-90",
                            )}
                          />
                        </>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                        isActive(item.href)
                          ? "bg-secondary text-secondary-foreground"
                          : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
                        expanded && "justify-center",
                      )}
                      onClick={() => hasSubmenu(item) && !expanded && toggleSubmenu(item.href)}
                    >
                      <item.icon className="h-4 w-4" />
                      {!expanded && (
                        <>
                          <span className="flex-1">{item.label}</span>
                          {hasSubmenu(item) && (
                            <ChevronRight
                              className={cn(
                                "h-4 w-4 transition-transform",
                                activeSubmenu === item.href && "transform rotate-90",
                              )}
                            />
                          )}
                        </>
                      )}
                    </Link>
                  )}
                </div>

                {/* Submenu */}
                {hasSubmenu(item) && activeSubmenu === item.href && !expanded && (
                  <div className="ml-6 mt-1 space-y-1 border-l pl-2">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.href}
                        to={subItem.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-md text-xs transition-colors",
                          isActive(subItem.href)
                            ? "bg-secondary/70 text-secondary-foreground"
                            : "text-muted-foreground hover:bg-secondary/30 hover:text-foreground",
                        )}
                      >
                        <subItem.icon className="h-3.5 w-3.5" />
                        <span>{subItem.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        <div className="p-3">{/* <ThemeToggle /> */}</div>

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
