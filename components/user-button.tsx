import { ChevronDown, Loader, LogOut, Settings, User } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import Link from "next/link"
const UserButton = () => {
    const router = useRouter()

    const { data: session, status} = useSession()

    if (status === 'loading') {
        return (
            <Loader className="size-6 mr-4 mt-4 float-right animate-spin" />
        )
    }

    const avatarFallback = session?.user?.name?.charAt(0).toUpperCase()

    const handleSignOut = async () => {
        await signOut({
            redirect: false
        })
        router.push("/")
    }

    return (
        <nav>
            {
                session ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    <span className="text-sm font-medium">{avatarFallback}</span>
                                </div>
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{session.user?.name}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <User className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <Link href="/">
                                <DropdownMenuItem>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <Button onClick={handleSignOut}>Logout</Button>
                                </DropdownMenuItem>
                            </Link>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <div className="flex justify-end p-4 gap-4">

                        <Button>
                            <Link href={"/login"}>Login</Link>
                        </Button>

                    </div>
                )
            }
        </nav>
    )
}

export default UserButton