import { type SharedData } from '@/types'
import { Head, Link, usePage } from '@inertiajs/react'
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, NavigationMenuTrigger, NavigationMenuContent } from "@/components/ui/navigation-menu"
import { UserIcon, InfoIcon, BookOpenIcon } from "lucide-react"
import { useEffect, useState } from "react"

export default function Welcome() {
    const { auth } = usePage<SharedData>().props

    // Example interactive counters
    const [stats, setStats] = useState({ books: 0, members: 0, borrowed: 0 })

    useEffect(() => {
        const target = { books: 1234, members: 321, borrowed: 87 }
        const interval = setInterval(() => {
            setStats(prev => {
                const next = { ...prev }
                let done = true
                Object.keys(target).forEach(key => {
                    if (prev[key as keyof typeof prev] < target[key as keyof typeof prev]) {
                        next[key as keyof typeof next] = prev[key as keyof typeof prev] + Math.ceil(target[key as keyof typeof prev]/100)
                        done = false
                    }
                })
                if (done) clearInterval(interval)
                return next
            })
        }, 20)
    }, [])

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <div className="flex min-h-screen flex-col bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#0a0a0a] dark:text-[#EDEDEC]">
                {/* Header */}
                <header className="w-full border-b dark:border-gray-800 shadow-sm">
                    <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
                        <img src="/images/DIS(no back).png" alt="Logo" className="h-12 w-auto hover:scale-105 transition-transform" />

                        <NavigationMenu>
                            <NavigationMenuList className="flex gap-6 items-center">
                                <NavigationMenuItem>
                                    <NavigationMenuLink asChild>
                                        <Link href="/" className="hover:text-blue-600 transition">Home</Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>

                                <NavigationMenuItem>
                                    <NavigationMenuTrigger>Catalog</NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid w-[200px] gap-2 p-4">
                                            <li><NavigationMenuLink asChild><Link href="#">All Books</Link></NavigationMenuLink></li>
                                            <li><NavigationMenuLink asChild><Link href="#">Categories</Link></NavigationMenuLink></li>
                                            <li><NavigationMenuLink asChild><Link href="#">Authors</Link></NavigationMenuLink></li>
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>

                                <NavigationMenuItem>
                                    <NavigationMenuLink asChild>
                                        <Link href="#" className="flex items-center gap-1 hover:text-blue-600 transition">
                                            <InfoIcon size={16} /> About Us
                                        </Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>

                                {/* User Menu */}
                                <NavigationMenuItem className="ml-auto">
                                    {auth.user ? (
                                        <NavigationMenuLink asChild>
                                            <Link
                                                href={route('dashboard')}
                                                className="flex items-center gap-1 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
                                            >
                                                <UserIcon size={16} /> Dashboard
                                            </Link>
                                        </NavigationMenuLink>
                                    ) : (
                                        <div className="flex gap-2">
                                            <NavigationMenuLink asChild>
                                                <Link href={route('login')} className="px-4 py-2 rounded-md hover:underline">Sign In</Link>
                                            </NavigationMenuLink>
                                            <NavigationMenuLink asChild>
                                                <Link href={route('register')} className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition">Sign Up</Link>
                                            </NavigationMenuLink>
                                        </div>
                                    )}
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>
                </header>

                {/* Hero Section */}
                <main className="flex flex-col items-center text-center max-w-4xl mx-auto p-12 gap-8">
                    <h2 className="text-4xl font-bold mb-4">
                        {auth.user ? <>Hello, <span className="text-blue-600">{auth.user.name}</span></> :
                            <>Welcome to <span className="text-blue-600">Dewey Digital Library</span></>}
                    </h2>
                    <p className="text-lg text-gray-700 dark:text-gray-300">
                        {auth.user ? "We’re glad to have you back. Access your dashboard to manage your library activities."
                            : "Your modern solution for managing books, members, and reports — all in one place."}
                    </p>

                    {/* Stats */}
                    <div className="flex gap-10 mt-8 flex-wrap justify-center">
                        <div className="bg-white dark:bg-[#1b1b18] rounded-xl shadow p-6 w-40 hover:scale-105 transition">
                            <h3 className="text-2xl font-bold">{stats.books}</h3>
                            <p className="text-gray-600 dark:text-gray-300 mt-1">Books</p>
                        </div>
                        <div className="bg-white dark:bg-[#1b1b18] rounded-xl shadow p-6 w-40 hover:scale-105 transition">
                            <h3 className="text-2xl font-bold">{stats.members}</h3>
                            <p className="text-gray-600 dark:text-gray-300 mt-1">Members</p>
                        </div>
                        <div className="bg-white dark:bg-[#1b1b18] rounded-xl shadow p-6 w-40 hover:scale-105 transition">
                            <h3 className="text-2xl font-bold">{stats.borrowed}</h3>
                            <p className="text-gray-600 dark:text-gray-300 mt-1">Borrowed</p>
                        </div>
                    </div>

                    {/* CTA */}
                    {!auth.user && (
                        <div className="mt-10 flex gap-4">
                            <Link href={route('register')} className="rounded-lg bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition">
                                Get Started
                            </Link>
                            <Link href={route('login')} className="rounded-lg border border-gray-400 px-6 py-3 font-medium hover:border-gray-600 dark:border-gray-500 dark:hover:border-gray-300">
                                Sign In
                            </Link>
                        </div>
                    )}
                </main>

                {/* Footer */}
                <footer className="mt-auto text-sm text-gray-500 dark:text-gray-400 text-center p-6 border-t dark:border-gray-800">
                    © {new Date().getFullYear()} Dewey Digital Library. All rights reserved.
                </footer>
            </div>
        </>
    )
}
