'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Button } from '@workspace/ui/components/ui/button'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null // Prevent hydration mismatch
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  )
}

