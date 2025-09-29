import { type SharedData } from '@/types'
import { Head, Link, usePage } from '@inertiajs/react'
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, NavigationMenuTrigger, NavigationMenuContent } from "@/components/ui/navigation-menu"
import { BookOpenIcon, BarChart3Icon, LayoutDashboardIcon, BookTextIcon, MenuIcon, XIcon, UserIcon } from 'lucide-react';
import { useState, useEffect } from "react" // <-- Added useEffect

// Define the props interface, including 'auth' again
type WelcomeProps = SharedData & {
    auth: { user: { name: string; role?: number; role_id?: number } | null }; // Auth is back
    bookCount: number;
    ebookCount: number;
    userCount: number;
    canLogin?: boolean;
    canRegister?: boolean;
};

// --- NEW CountingStat Component ---
interface CountingStatProps {
    endValue: number;
    duration: number; // Duration in milliseconds
}

const CountingStat: React.FC<CountingStatProps> = ({ endValue, duration }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime: number;
        const animateCount = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            const currentValue = Math.floor(percentage * endValue);
            setCount(currentValue);

            if (percentage < 1) {
                requestAnimationFrame(animateCount);
            }
        };

        const animationFrameId = requestAnimationFrame(animateCount);

        // Cleanup function to stop animation if component unmounts
        return () => cancelAnimationFrame(animationFrameId);
    }, [endValue, duration]);

    return <>{count.toLocaleString()}</>;
};
// --- END CountingStat Component ---


export default function Welcome() {
    // Destructure all required props, including 'auth'
    const { auth, bookCount, ebookCount, userCount, canLogin, canRegister } = usePage<WelcomeProps>().props;

    // State for mobile menu
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // 1. ROLE DETERMINATION LOGIC
    const userRole = auth.user ? (auth.user.role_id ?? auth.user.role ?? 0) : 0;
    const isRegularUser = userRole === 1; // Role 1 is a regular user
    const isStaffOrAdmin = userRole >= 2; // Role 2 and up is staff/admin

    // Calculate total items
    const totalLibraryItems = bookCount + ebookCount;

    // Animation duration for the counting effect
    const animationDuration = 2000; // 2 seconds

    // Function to close menu on navigation
    const handleNavigation = () => setIsMenuOpen(false);

    // --- Component Render ---
    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <div className="flex min-h-screen flex-col bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#0a0a0a] dark:text-[#EDEDEC] font-['Instrument_Sans']">

                {/* Header */}
                <header className="w-full border-b dark:border-gray-800 shadow-sm sticky top-0 z-20 bg-[#FDFDFC]/95 dark:bg-[#0a0a0a]/95 backdrop-blur-sm">
                    {/* Main container now uses flex to align three sections: Logo | Navigation | Actions */}
                    <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8 py-4 relative">

                        {/* 1. Logo (Left Column) */}
                        <Link href="/">
                            <img
                                src="/images/DIS(no back).png"
                                alt="Dewey Digital Library Logo"
                                className="h-10 w-auto hover:scale-105 transition-transform duration-300"
                            />
                        </Link>

                        {/* 2. Desktop Navigation & Auth Buttons container */}
                        {/* 2. Desktop Navigation & Auth Buttons container */}
                        <div className="hidden sm:flex items-center w-full justify-end">

                            {/* Navigation Menu (Centered Column) - Absolute positioning is kept for centering, but it only contains core nav links now */}
                            <NavigationMenu className="absolute left-1/2 -translate-x-1/2">
                                <NavigationMenuList className="flex gap-6 items-center">
                                    <NavigationMenuItem>
                                        <NavigationMenuLink asChild>
                                            <Link href="/" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition p-2 rounded-md">Home</Link>
                                        </NavigationMenuLink>
                                    </NavigationMenuItem>

                                    {/* About Us Dropdown */}
                                    <NavigationMenuItem>
                                        {/* This is the trigger */}
                                        <NavigationMenuTrigger className="text-sm font-medium p-2">About Us</NavigationMenuTrigger>
                                        {/* Removed redundant className="absolute" from NavigationMenuContent */}
                                        <NavigationMenuContent>
                                            <ul className="grid w-[200px] gap-2 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-xl border dark:border-gray-700">
                                                <li><NavigationMenuLink asChild><Link href="/about/mission" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition duration-150">Our Mission</Link></NavigationMenuLink></li>
                                                <li><NavigationMenuLink asChild><Link href="/about/team" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition duration-150">Our Team</Link></NavigationMenuLink></li>
                                                <li><NavigationMenuLink asChild><Link href="/about/contact" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition duration-150">Contact</Link></NavigationMenuLink></li>
                                            </ul>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>
                                </NavigationMenuList>
                            </NavigationMenu>

                            {/* 3. User Status/Auth Buttons (Right Column) */}
                            <div className="flex gap-3 ml-auto">
                                {/* BROWSE BOOKS (PROMINENT LINK FOR REGULAR USERS - NOW HERE) */}
                                {auth.user && isRegularUser && (
                                    <Link href={route('library-type-dashboard')}
                                          className="flex items-center gap-1 text-sm font-medium rounded-full bg-green-500 text-white px-4 py-2 hover:bg-green-600 transition duration-150 shadow-md"
                                    >
                                        <BookOpenIcon size={16} /> Browse Books
                                    </Link>
                                )}

                                {/* Dashboard */}
                                {auth.user && isStaffOrAdmin && (
                                    <Link
                                        href={route('dashboard')}
                                        className="flex items-center gap-1 rounded-full bg-blue-600 px-4 py-2 text-sm text-white font-medium shadow-md hover:bg-blue-700 dark:hover:bg-blue-500 transition duration-150"
                                    >
                                        <LayoutDashboardIcon size={16} /> Dashboard
                                    </Link>
                                )}

                                {/* Login/Logout Button */}
                                {auth.user ? (
                                    <Link href={route('logout')} method="post" as="button"
                                          className="px-4 py-2 text-sm font-medium rounded-full bg-red-600 text-white shadow-md hover:bg-red-700 transition duration-150"
                                    >
                                        Logout
                                    </Link>
                                ) : (
                                    <Link href={route('login')}
                                          className="px-4 py-2 text-sm font-medium rounded-full bg-blue-600 text-white shadow-md hover:bg-blue-700 transition duration-150"
                                    >
                                        Login
                                    </Link>
                                )}

                                {/* Sign Up Button (Only for Guests) */}
                                {!auth.user && canRegister && (
                                    <Link href={route('register')} className="px-4 py-2 text-sm font-medium rounded-full bg-blue-600 text-white hover:bg-blue-700 dark:hover:bg-blue-500 transition duration-150 shadow-md">
                                        Sign Up
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Hamburger Icon */}
                        <button
                            className="sm:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-expanded={isMenuOpen}
                            aria-label="Toggle navigation menu"
                        >
                            {isMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
                        </button>
                    </div>
                </header>

                {/* Mobile Menu Content */}
                {isMenuOpen && (
                    <div className="sm:hidden fixed top-[64px] inset-x-0 bg-white dark:bg-[#0a0a0a] border-b dark:border-gray-800 shadow-lg z-50 p-5 transition-all duration-300">
                        <nav className="flex flex-col gap-4">
                            {/* Main Navigation */}
                            <Link
                                onClick={handleNavigation}
                                href="/about"
                                className="px-4 py-2 text-base font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                            >
                                About Us
                            </Link>

                            {/* Browse Books */}
                            {auth.user && isRegularUser && (
                                <Link
                                    onClick={handleNavigation}
                                    href={route('library-type-dashboard')}
                                    className="px-4 py-2 text-base font-medium rounded-full bg-green-500 text-white hover:bg-green-600 transition duration-150 flex items-center justify-center gap-2 shadow-md w-full"
                                >
                                    <BookOpenIcon size={18} /> Browse Books
                                </Link>
                            )}

                            {/* Auth Section */}
                            <div className="mt-6 pt-4 border-t dark:border-gray-800 flex flex-col gap-3">
                                {/* Dashboard */}
                                {auth.user && isStaffOrAdmin && (
                                    <Link
                                        onClick={handleNavigation}
                                        href={route('dashboard')}
                                        className="px-4 py-2 text-sm font-medium rounded-full bg-blue-600 text-white hover:bg-blue-700 transition duration-150 flex items-center justify-center gap-2 shadow-md"
                                    >
                                        <LayoutDashboardIcon size={16} /> Dashboard
                                    </Link>
                                )}

                                {/* Login / Logout */}
                                {auth.user ? (
                                    <Link
                                        onClick={handleNavigation}
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="px-4 py-2 text-sm font-medium rounded-full bg-red-600 text-white hover:bg-red-700 transition duration-150 shadow-md w-full"
                                    >
                                        Logout
                                    </Link>
                                ) : (
                                    <Link
                                        onClick={handleNavigation}
                                        href={route('login')}
                                        className="px-4 py-2 text-sm font-medium rounded-full bg-blue-600 text-white shadow-md hover:bg-blue-700 transition duration-150 w-full text-center"
                                    >
                                        Login
                                    </Link>
                                )}

                                {/* Sign Up */}
                                {!auth.user && canRegister && (
                                    <Link
                                        onClick={handleNavigation}
                                        href={route('register')}
                                        className="px-4 py-2 text-sm font-medium rounded-full bg-blue-600 text-white hover:bg-blue-700 dark:hover:bg-blue-500 transition duration-150 shadow-md w-full"
                                    >
                                        Sign Up
                                    </Link>
                                )}
                            </div>
                        </nav>
                    </div>
                )}

                {/* Main Content / Hero Section */}
                <main className="flex flex-col items-center text-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 gap-6 sm:gap-8 flex-grow">

                    {/* Dynamic Headline*/}
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-0 leading-tight">
                        {auth.user ? (
                            <>Welcome back, <span className="text-blue-600 dark:text-blue-400 block sm:inline-block mt-2 sm:mt-0">{auth.user.name}</span></>
                        ) : (
                            <> <span className="text-blue-600 dark:text-blue-400">Dewey Digital Library</span></>
                        )}
                    </h2>

                    {/* Dynamic Subheadline */}
                    <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl">
                        {auth.user ? (
                            isStaffOrAdmin ? (
                                // Message for Staff/Admin (Role 2+)
                                <>Admin Dashboard:Manage the entire Dewey ecosystem—from inventory and user accounts to system configurations—all from your centralized dashboard.</>
                            ) : (
                                // Message for Regular User (Role 1)
                                <>Seamlessly explore new books and e-books, track the progress of what you're currently reading, and manage your personalized library lists.</>
                            )
                        ) : (
                            <>Discover a curated collection of {totalLibraryItems.toLocaleString()} titles, available in physical and digital formats.Let's get started!</>
                        )}
                    </p>

                    {/* Stats Section using Real Data (4 columns) */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 mt-8 sm:mt-10 justify-center w-full max-w-4xl">

                        {/* 1. Total Library Items (Physical + E-books) */}
                        <div className="bg-white dark:bg-[#1b1b18] rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-7 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                            <BookOpenIcon className="mx-auto text-blue-600 dark:text-blue-400 mb-3" size={32} />
                            <h3 className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                                {/* Use CountingStat */}
                                <CountingStat endValue={totalLibraryItems} duration={animationDuration} />
                            </h3>
                            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1">Total Books</p>
                        </div>

                        {/* 2. Physical Book Count */}
                        <div className="bg-white dark:bg-[#1b1b18] rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-7 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                            <BarChart3Icon className="mx-auto text-blue-600 dark:text-blue-400 mb-3" size={32} />
                            <h3 className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                                {/* Use CountingStat */}
                                <CountingStat endValue={bookCount} duration={animationDuration} />
                            </h3>
                            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1">Physical Books</p>
                        </div>

                        {/* 3. E-book Count */}
                        <div className="bg-white dark:bg-[#1b1b18] rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-7 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                            <BookTextIcon className="mx-auto text-blue-600 dark:text-blue-400 mb-3" size={32} />
                            <h3 className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                                {/* Use CountingStat */}
                                <CountingStat endValue={ebookCount} duration={animationDuration} />
                            </h3>
                            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1">E-books</p>
                        </div>

                        {/* 4. Active User Count */}
                        <div className="bg-white dark:bg-[#1b1b18] rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-7 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                            <UserIcon className="mx-auto text-blue-600 dark:text-blue-400 mb-3" size={32} />
                            <h3 className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                                {/* Use CountingStat */}
                                <CountingStat endValue={userCount} duration={animationDuration} />
                            </h3>
                            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1">Active Members</p>
                        </div>
                    </div>

                    {/* Call to Action (CTA) for Guests */}
                    {!auth.user && canLogin && canRegister && (
                        <div className="mt-12 sm:mt-16 flex flex-col sm:flex-row gap-4">
                            <Link href={route('register')} className="rounded-full bg-blue-600 px-8 py-3 text-base font-semibold text-white shadow-lg hover:bg-blue-700 dark:hover:bg-blue-500 transition duration-150 transform hover:scale-[1.05]">
                                Start Your Journey Today
                            </Link>
                            <Link href={route('login')} className="rounded-full border-2 border-gray-400 px-8 py-3 text-base font-medium hover:border-blue-600 dark:border-gray-500 dark:hover:border-blue-400 transition duration-150 transform hover:scale-[1.05]">
                                Explore Catalog
                            </Link>
                        </div>
                    )}
                </main>

                {/* Footer */}
                <footer className="mt-auto text-sm text-gray-500 dark:text-gray-400 text-center p-4 sm:p-6 border-t dark:border-gray-800">
                    © {new Date().getFullYear()} Dewey Digital Library. All rights reserved. Powered by Dewey Steam.
                </footer>
            </div>
        </>
    )
}
