import { Logo } from "@/components/brand/logo"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Settings, User, LogOut } from "lucide-react"

export function Header() {
  return (
    <header className="bg-white border-b border-[#C9D3E2]/20 py-4">
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Logo variant="icon" size="sm" />
          <span className="text-xl font-bold text-[#2C4079]">Aegisum</span>
        </Link>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/settings">
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Link>
          </Button>

          <Button variant="ghost" size="icon" asChild>
            <Link href="/profile">
              <User className="h-5 w-5" />
              <span className="sr-only">Profile</span>
            </Link>
          </Button>

          <Button variant="ghost" size="icon">
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
