"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Head, Link, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { NavUser } from "@/components/nav-user";
import { Button } from "@/components/ui/button";
import {
    ChevronLeft,
    ChevronRight,
    BookOpen,
    Download,
    Info,
    Maximize,
    Minimize,
    CheckCircle,
    XCircle,
    Search,
    Menu,
    ArrowDownUp,
    LogIn,
    Eye
} from 'lucide-react';

// --- Interface Definitions ---
interface Book {
    language: any;
    code: any;
    publisher: any;
    isbn: any;
    page_count: any;
    pdf_url: any;
    id: number;
    title: string;
    author: string;
    description: string;
    cover?: string | null;
    type: string;
    flip_link?: string | null;
    is_available: boolean;
    downloadable: number;
    view?: number; // Used for "Most Viewed" sort
    posted_by_user_id?: number;
    poster_profile_url?: string;
    published_at?: string;
    created_at?: string;

    // NEW: Include user relation to get the name
    user?: { id: number; name: string } | null;

    // Relations
    category?: { id: number; name: string };
    subcategory?: { id: number; name: string } | null;
    bookcase?: { id: number; code: string } | null;
    shelf?: { id: number; code: string } | null;
    grade?: { id: number; name: string } | null;
    subject?: { id: number; name: string } | null;
    campus?: { id: number; name: string } | null;
}

interface AuthUser {
    name: string;
    email: string;
}

interface PageProps {
    flash: { message?: string };
    books: Book[];
    auth: { user: AuthUser | null };
    scope?: 'local' | 'global';
    bookType?: 'ebook' | 'physical';
}
// -----------------------------

// --- Utilities ---
const ITEMS_PER_PAGE = 20;

const getMockAvatar = (userId: number | undefined) => {
    if (!userId) return "/images/placeholder-avatar.png";
    return `https://api.dicebear.com/7.x/initials/svg?seed=${userId}&chars=2&size=32&backgroundColor=4f46e5,06b6d4&scale=90`;
};

// Utility to format date
const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'Unknown';
    try {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    } catch {
        return 'Invalid Date';
    }
};

export default function Index() {
    const { books, flash, auth, scope, bookType = 'physical' } = usePage<PageProps>().props;
    const [search, setSearch] = useState("");
    const [filterCategory, setFilterCategory] = useState("All");
    const [filterSubCategory, setFilterSubCategory] = useState("All");
    const [filterBookcase, setFilterBookcase] = useState("All");
    const [filterShelf, setFilterShelf] = useState("All");
    const [filterGrade, setFilterGrade] = useState("All");
    const [filterSubject, setFilterSubject] = useState("All");
    const [filterCampus, setFilterCampus] = useState("All");
    const [filterLanguage, setFilterLanguage] = useState("All");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [sortBy, setSortBy] = useState("Newest"); // Options: Newest, Title A-Z, Most Viewed
    const [currentPage, setCurrentPage] = useState(1);

    // --- Memoized Filter Data ---
    const categories = useMemo(() => Array.from(new Set(books.map((b) => b.category?.name).filter(Boolean))), [books]);
    const subcategories = useMemo(() => Array.from(new Set(books.map((b) => b.subcategory?.name).filter(Boolean))), [books]);
    const bookcases = useMemo(() => Array.from(new Set(books.map((b) => b.bookcase?.code).filter(Boolean))), [books]);
    const shelves = useMemo(() => Array.from(new Set(books.map((b) => b.shelf?.code).filter(Boolean))), [books]);
    const grades = useMemo(() => Array.from(new Set(books.map((b) => b.grade?.name).filter(Boolean))), [books]);
    const subjects = useMemo(() => Array.from(new Set(books.map((b) => b.subject?.name).filter(Boolean))), [books]);
    const campuses = useMemo(() => Array.from(new Set(books.map((b) => b.campus?.name).filter(Boolean))), [books]);
    const languages = useMemo(() => Array.from(new Set(books.map((b) => b.language).filter(Boolean))), [books]);

    // Filtered and Sorted books logic
    const allFilteredBooks = useMemo(() => {
        let filtered = books.filter((book) => {
            if (book.type !== bookType) return false;
            const matchesSearch =
                book.title.toLowerCase().includes(search.toLowerCase()) ||
                book.author.toLowerCase().includes(search.toLowerCase()) ||
                String(book.isbn)?.toLowerCase().includes(search.toLowerCase());

            const matchesCategory = filterCategory === "All" || book.category?.name === filterCategory;
            const matchesSubCategory = filterSubCategory === "All" || book.subcategory?.name === filterSubCategory;
            const matchesBookcase = bookType === 'ebook' || filterBookcase === "All" || book.bookcase?.code === filterBookcase;
            const matchesShelf = bookType === 'ebook' || filterShelf === "All" || book.shelf?.code === filterShelf;
            const matchesGrade = filterGrade === "All" || book.grade?.name === filterGrade;
            const matchesSubject = filterSubject === "All" || book.subject?.name === filterSubject;
            const matchesCampus = bookType === 'ebook' || scope !== 'local' || filterCampus === "All" || book.campus?.name === filterCampus;
            const matchesLanguage = filterLanguage === "All" || book.language === filterLanguage;

            return (
                matchesSearch && matchesCategory && matchesSubCategory && matchesBookcase &&
                matchesShelf && matchesGrade && matchesSubject && matchesCampus && matchesLanguage
            );
        });

        // Sorting Logic
        return filtered.sort((a, b) => {
            if (sortBy === "Newest") {
                const dateA = a.created_at || a.published_at;
                const dateB = b.created_at || b.published_at;
                if (dateA && dateB) {
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                }
                return 0;
            } else if (sortBy === "Title A-Z") {
                return a.title.localeCompare(b.title);
            } else if (sortBy === "Most Viewed") {
                const viewA = a.view ?? 0;
                const viewB = b.view ?? 0;
                return viewB - viewA; // Descending order
            }
            return 0;
        });

    }, [books, search, filterCategory, filterSubCategory, filterBookcase, filterShelf, filterGrade, filterSubject, filterCampus, filterLanguage, bookType, scope, sortBy]);

    // Pagination Logic
    const totalPages = Math.ceil(allFilteredBooks.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedBooks = allFilteredBooks.slice(startIndex, endIndex);

    // Reset page on filter/sort change
    useEffect(() => {
        setCurrentPage(1);
    }, [search, filterCategory, filterSubCategory, filterBookcase, filterShelf, filterGrade, filterSubject, filterCampus, filterLanguage, sortBy]);

    // Pagination handlers
    const goToPreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const goToNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };


    // --- Effects and Handlers ---
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isModalOpen) {
                if (e.key === "Escape") { setIsModalOpen(false); }
                else if (e.key === "f" || e.key === "F") { setIsFullScreen(!isFullScreen); }
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isModalOpen, isFullScreen]);

    // Define the primary accent color
    const accentColor = 'cyan';
    const isAuthenticated = auth.user !== null;

    return (
        <AppLayout user={auth.user}>
            <Head title={bookType === 'ebook' ? "eBooks Library" : "Books Library"} />

            {/* Main content container */}
            <div className="py-4 space-y-12 bg-white dark:bg-gray-950 transition-colors duration-300 w-full lg:pl-4 lg:pr-4 xl:pl-8 xl:pr-8 max-w-full mx-auto min-h-screen text-gray-900 dark:text-gray-100">
                {/* Top Bar (Search in middle) */}
                <header className="flex items-center justify-between px-6 md:px-16 lg:px-24 border-b border-gray-100 dark:border-gray-800 pb-4">
                    <div className="flex items-center space-x-6 w-1/3 min-w-max">
                        <Link href="/" className="flex items-center space-x-3">
                            <img
                                src="/images/DIS(no back).png"
                                alt="Logo"
                                className="h-14 w-14 object-contain filter drop-shadow-lg dark:invert"
                            />
                        </Link>
                    </div>

                    {/* Center: Search Bar (Primary focus) - Uses flex-grow for space and mx-auto for internal centering */}
                    <div className="relative flex-grow mx-4 max-w-xl hidden sm:block">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                            <Input
                                placeholder="Search by Title, Author, or ISBN"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className={`w-full bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 rounded-full shadow-inner pl-10 h-11
                            dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-500
                            focus:ring-2 focus:ring-${accentColor}-500 focus:border-${accentColor}-500 transition-all pr-3`}
                            />
                        </div>
                    </div>

                    {/* Right: User Widget - Explicitly set to w-1/3 and justify-end */}
                    <div className="origin-right w-1/8 flex justify-end">
                        {isAuthenticated ? (
                            <NavUser user={auth.user!} />
                        ) : (
                            <Link href="/login">
                                <Button
                                    variant="outline"
                                    className={`bg-transparent border-${accentColor}-500 text-${accentColor}-600 dark:border-${accentColor}-400 dark:text-${accentColor}-400
                                hover:bg-${accentColor}-50 dark:hover:bg-${accentColor}-900/50 transition-colors shadow-sm`}
                                >
                                    <LogIn className="w-5 h-5 mr-2" />
                                    Log In
                                </Button>
                            </Link>
                        )}
                    </div>
                </header>

                {/* Flash message */}
                {flash.message && (
                    <div className="p-4 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-lg shadow-lg mx-6 md:px-16 lg:px-24">
                        {flash.message}
                    </div>
                )}

                {/* Main Content Header & Second Content (e.g., Stats/Links) */}
                <div className="space-y-4 px-6 md:px-16 lg:px-24">
                    {/* Filters, Mobile Search, and Book Count (Consolidated) */}
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-4 max-w-8xl mx-auto">
                        {/* Mobile Search Bar */}
                        <div className="relative flex-grow min-w-full sm:hidden">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                            <Input
                                placeholder="Search by Title, Author, or ISBN"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className={`w-full bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 rounded-full shadow-inner pl-10 h-11
                        dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-500
                        focus:ring-2 focus:ring-${accentColor}-500 focus:border-${accentColor}-500 transition-all pr-3`}
                            />
                        </div>

                        {/* Filter components */}
                        {[
                            { label: "Category", value: filterCategory, onChange: setFilterCategory, options: categories },
                            { label: "Sub-Category", value: filterSubCategory, onChange: setFilterSubCategory, options: subcategories },
                            { label: "Language", value: filterLanguage, onChange: setFilterLanguage, options: languages, display: (lang: string) => lang === 'en' ? 'English' : lang === 'kh' ? 'Khmer' : lang },
                            { label: "Grade", value: filterGrade, onChange: setFilterGrade, options: grades },
                            { label: "Subject", value: filterSubject, onChange: setFilterSubject, options: subjects },
                            ...(bookType === 'physical' ? [
                                { label: "Bookcase", value: filterBookcase, onChange: setFilterBookcase, options: bookcases },
                                { label: "Shelf", value: filterShelf, onChange: setFilterShelf, options: shelves },
                            ] : []),
                            ...(bookType === 'physical' && scope !== 'local' ? [
                                { label: "Campus", value: filterCampus, onChange: setFilterCampus, options: campuses },
                            ] : []),
                                            ].map(({ label, value, onChange, options, display }) => (
                                                <Select key={label} value={value} onValueChange={onChange}>
                                                    <SelectTrigger className={`w-full sm:w-40 bg-white border border-gray-300 text-gray-900 hover:border-gray-400
                                    dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:border-gray-600
                                    focus:ring-${accentColor}-500 transition`}>
                                    <SelectValue placeholder={label} />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-gray-200 text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                                    <SelectItem value="All" className="hover:bg-gray-100 dark:hover:bg-gray-700">All {label}s</SelectItem>
                                    {options.map((opt) => (
                                        <SelectItem key={opt} value={opt} className="hover:bg-gray-100 dark:hover:bg-gray-700">{display ? display(opt) : opt}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        ))}
                        {/* Sort Dropdown */}
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className={`w-full sm:w-40 bg-white border border-gray-300 text-gray-900 hover:border-gray-400
                                                dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:border-gray-600
                                                  focus:ring-${accentColor}-500 transition font-semibold`}
                            >
                                <ArrowDownUp className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                                <SelectValue placeholder="Sort By" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-gray-200 text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                                <SelectItem value="Newest" className="hover:bg-gray-100 dark:hover:bg-gray-700">Newest</SelectItem>
                                <SelectItem value="Title A-Z" className="hover:bg-gray-100 dark:hover:bg-gray-700">Title (A-Z)</SelectItem>
                                <SelectItem value="Most Viewed" className="hover:bg-gray-100 dark:hover:bg-gray-700">Most Viewed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Book Grid */}
                <TooltipProvider>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 2xl:grid-cols-8 gap-6 md:gap-8 px-6 md:px-16 lg:px-24">
                        {paginatedBooks.length > 0 ? (
                            paginatedBooks.map((book) => {

                                // Determine contributor info
                                const contributorId = book.posted_by_user_id || book.user?.id;
                                const contributorName = book.user?.name || (contributorId ? `User #${contributorId}` : 'Unknown');

                                return (
                                    <Tooltip key={book.id}>
                                        <TooltipTrigger
                                            className={`group flex flex-col items-start space-y-3 cursor-pointer p-3 rounded-xl bg-white border border-gray-200 shadow-lg
                                            dark:bg-gray-800 dark:border-gray-700 dark:shadow-2xl dark:shadow-gray-900/50
                                            transition-all duration-300 transform relative overflow-hidden
                                            hover:scale-[1.05] hover:shadow-2xl hover:border-${accentColor}-500 focus:outline-none focus:ring-2 focus:ring-${accentColor}-500 w-full`}
                                        >
                                            {/* Book Cover Container (Adjusted ratio to be significantly wider: pb-[170%] to pb-[160%]) */}
                                            <div className="relative w-full pb-[160%]">
                                                <img
                                                    src={book.cover || "/images/placeholder-book.png"}
                                                    alt={book.title}
                                                    className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-xl transition-transform duration-300 group-hover:scale-105"
                                                />
                                            </div>

                                             {/*Book Title/Author (Footer)*/}
                                            <div className="w-full mt-2 space-y-1">
                                                <h3 className="text-base font-bold truncate text-gray-900 dark:text-gray-50">{book.title}</h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate font-light">{book.author}</p>
                                            </div>

                                            {/* Contributor */}
                                            <div className="flex items-center space-x-2 pt-1 border-t border-gray-100 dark:border-gray-700 w-full">
                                                <img
                                                    src={getMockAvatar(contributorId)}
                                                    alt="Contributor Avatar"
                                                    className="w-6 h-6 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                                                />
                                                <span className="text-xs text-gray-400 dark:text-gray-500 truncate font-medium">
                                                {contributorName}
                                            </span>
                                            </div>
                                        </TooltipTrigger>

                                        {/*hover card*/}
                                        <TooltipContent
                                            side="right"
                                            className={`max-w-2xl p-5 rounded-xl shadow-2xl border-l-4 border-gray-200 bg-white text-gray-900
                                            dark:border-gray-700 dark:bg-gray-800 dark:text-white z-50
                                            ${book.type === 'ebook'
                                                ? `border-${accentColor}-500`
                                                : 'border-amber-500'
                                            }`}
                                        >
                                            <div className="space-y-4">
                                                {/* Book Title (Increased text size) */}
                                                <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">{book.title}</h3>
                                                <p className="text-base text-gray-600 dark:text-gray-300"><span className="font-semibold">Author:</span> {book.author}</p>

                                                {/* Dynamic Status/Views (Book Status Restored) */}
                                                {book.type === 'physical' ? (
                                                    <div className={`flex items-center text-base font-semibold ${book.is_available ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                                        {book.is_available ? <CheckCircle className="w-5 h-5 mr-1 text-green-500" /> : <XCircle className="w-5 h-5 mr-1 text-red-500" />}
                                                        Status:{book.is_available ? 'Available' : 'Unavailable'}
                                                    </div>
                                                ) : (
                                                    book.view !== undefined && (
                                                        <p className="text-base text-gray-700 dark:text-gray-300 flex items-center">
                                                            <Eye className="w-5 h-5 mr-2 text-blue-500 dark:text-blue-400" />
                                                            {book.view?.toLocaleString()}
                                                        </p>
                                                    )
                                                )}

                                                {/* Detailed Info Section (Increased text size) */}
                                                <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1.5 pt-3 border-t border-gray-200 dark:border-gray-600">
                                                    {book.publisher && <p><span className="font-medium text-gray-700 dark:text-gray-300">Publisher:</span> {book.publisher}</p>}
                                                    {book.isbn && <p className="break-words"><span className="font-medium text-gray-700 dark:text-gray-300">ISBN:</span> {book.isbn}</p>}
                                                    {book.page_count && <p><span className="font-medium text-gray-700 dark:text-gray-300">Pages:</span> {book.page_count}</p>}
                                                    {book.category?.name && <p><span className="font-medium text-gray-700 dark:text-gray-300">Category:</span> {book.category.name}</p>}
                                                    {book.language && <p><span className="font-medium text-gray-700 dark:text-gray-300">Language:</span> {book.language === 'en' ? 'English' : book.language === 'kh' ? 'Khmer' : book.language}</p>}
                                                    {book.bookcase?.code && <p><span className="font-medium text-gray-700 dark:text-gray-300">Location:</span> {book.bookcase.code} / {book.shelf?.code}</p>}
                                                    {book.published_at && <p><span className="font-medium text-gray-700 dark:text-gray-300">Published Date:</span> {formatDate(book.published_at)}</p>}
                                                </div>

                                                {/* Ebook Actions */}
                                                {book.type === 'ebook' && (
                                                    <div className="flex flex-col items-start w-full space-y-2 pt-3 border-t border-gray-200 dark:border-gray-600">
                                                        {book.flip_link && (
                                                            <button
                                                                onClick={() => {
                                                                    setIsModalOpen(true);
                                                                    setSelectedBook(book);
                                                                }}
                                                                role={"link"}
                                                                // Added 'group' class to the button to allow styling the child icon on hover
                                                                className={`group text-sm flex items-center font-semibold transition-all text-gray-700 dark:text-gray-300 p-2 rounded-md w-full justify-start
                                                                        hover:bg-green-50 dark:hover:bg-green-700 hover:text-green-600 dark:hover:text-green-400`}
                                                            >
                                                                {/* Updated BookOpen icon to use 'group-hover' to inherit or change color */}
                                                                <BookOpen className={`w-5 h-5 mr-3 text-green-500 dark:text-green-400 group-hover:text-green-600 dark:group-hover:text-green-400`} />
                                                                Launch Reader
                                                            </button>
                                                        )}
                                                        {book.pdf_url && book.downloadable === 1 && (
                                                            <a
                                                                href={book.pdf_url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                // Added 'group' class to the link
                                                                className={`group text-sm flex items-center font-semibold transition-all text-gray-700 dark:text-gray-300 p-2 rounded-md w-full justify-start
                                                                          hover:bg-blue-50 dark:hover:bg-blue-700 hover:text-blue-600 dark:hover:text-blue-400`}
                                                            >
                                                                {/* Updated Download icon to use 'group-hover' to inherit or change color */}
                                                                <Download className="w-5 h-5 mr-3 text-blue-500 dark:text-blue-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                                                                Download PDF
                                                            </a>
                                                        )}
                                                        <Link
                                                            href={`/books/${book.id}/show`}
                                                            // KEY CHANGE 1: Added 'group' class
                                                            className={`group text-sm flex items-center font-semibold transition-all text-gray-700 dark:text-gray-300 p-2 rounded-md w-full justify-start
                                                                      hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-${accentColor}-600 dark:hover:text-${accentColor}-400`}
                                                        >
                                                            {/* KEY CHANGE 2: Added group-hover utility to change icon color */}
                                                            <Info className={`w-5 h-5 mr-3 text-gray-500 dark:text-gray-400 group-hover:text-${accentColor}-600 dark:group-hover:text-${accentColor}-400`} />
                                                            View Details
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>
                                        </TooltipContent>
                                    </Tooltip>
                                )})
                        ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400 col-span-full py-20 text-xl font-light">
                            No {bookType === 'ebook' ? 'digital editions' : 'physical assets'} found. Try broadening your criteria.
                        </p>
                        )}
                    </div>
                </TooltipProvider>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-4 pt-8 pb-4">
                        <Button
                            onClick={goToPreviousPage}
                            disabled={currentPage === 1}
                            variant="outline"
                            className={`flex items-center text-${accentColor}-600 dark:text-${accentColor}-400 disabled:opacity-50`}
                        >
                            <ChevronLeft className="w-5 h-5 mr-1" />
                            Previous
                        </Button>
                        <span className="text-md font-semibold text-gray-700 dark:text-gray-300">
                            Page {currentPage} of {totalPages}
                        </span>
                        <Button
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages}
                            variant="outline"
                            className={`flex items-center text-${accentColor}-600 dark:text-${accentColor}-400 disabled:opacity-50`}
                        >
                            Next
                            <ChevronRight className="w-5 h-5 ml-1" />
                        </Button>
                    </div>
                )}


                {/* Modal for Book Display (Reader/Viewer) */}
                {isModalOpen && selectedBook && (
                    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[100]">
                        <div className={`bg-white dark:bg-gray-900 rounded-lg shadow-2xl flex flex-col transition-all duration-300 ${isFullScreen ? 'w-full h-full max-w-none max-h-none' : 'w-11/12 max-w-7xl h-[95vh]'}`}>

                            {/* Modal Header */}
                            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedBook.title}</h2>
                                <div className="flex space-x-4 items-center">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <button
                                                onClick={() => setIsFullScreen(!isFullScreen)}
                                                className={`text-${accentColor}-600 dark:text-${accentColor}-400 hover:text-${accentColor}-800 dark:hover:text-${accentColor}-300 transition-colors p-1 rounded-md`}
                                            >
                                                {isFullScreen ? <Minimize className="h-7 w-7" /> : <Maximize className="h-7 w-7" />}
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent side="bottom" className="bg-gray-700 text-white">
                                            {isFullScreen ? 'Exit Full Screen (Esc or F)' : 'Go Full Screen (F)'}
                                        </TooltipContent>
                                    </Tooltip>

                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="text-gray-400 hover:text-red-600 transition-colors text-4xl leading-none font-light p-1 rounded-md"
                                    >
                                        &times;
                                    </button>
                                </div>
                            </div>

                            {/* Iframe Content Area */}
                            <div className="flex-1 overflow-hidden p-0 bg-gray-100 dark:bg-gray-900">
                                <iframe
                                    src={selectedBook.flip_link || selectedBook.pdf_url || ""}
                                    title={selectedBook.title}
                                    className="w-full h-full border-0"
                                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
