
import { useTheme } from './contexts/ThemeContext'
import { Button } from "./ui/button"
import { Moon, Sun, Settings, HelpCircle, ChevronDown, Menu, LogOut, Upload } from 'lucide-react'
import * as React from 'react';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleTheme}
      className="text-muted-foreground hover:text-foreground hover:bg-secondary/50"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </Button>
  )
}

