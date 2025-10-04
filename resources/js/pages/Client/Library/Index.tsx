"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Head, Link, usePage, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
    ArrowDownUp,
    LogIn,
    Eye,
    BadgeCheck,
    X,
    User,
    LogOut,
    UserCircle, Menu
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
    view?: number;
    posted_by_user_id?: number;
    poster_profile_url?: string;
    published_at?: string | number;
    created_at?: string;
    user?: { id: number; name: string; isVerified: boolean; avatar: string } | null;
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
    avatar?: string;
}

interface PageProps {
    flash: { message?: string };
    books: Book[];
    auth: { user: AuthUser | null };
    scope?: 'local' | 'global';
    bookType?: 'ebook' | 'physical';
}

// --- Utilities ---
const ITEMS_PER_PAGE = 16;

const formatDate = (dateInput: string | number | undefined): string => {
    if (!dateInput) return 'Unknown';
    if (typeof dateInput === 'number') {
        return dateInput.toString();
    }
    try {
        return new Date(dateInput).toLocaleDateString('en-US', {
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
    const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    const [sortBy, setSortBy] = useState("Newest");
    const [currentPage, setCurrentPage] = useState(1);
    const [openBookCard, setOpenBookCard] = useState<number | null>(null);
    const cardRef = useRef<HTMLDivElement>(null);

    // Determine current library type for the dropdown
    const currentLibrary = bookType === 'ebook' ? 'ebook' : scope === 'global' ? 'global' : 'local';

    // Handle library switch
    const handleLibraryChange = (value: string) => {
        if (value === 'ebook') {
            router.get(route('global e-library'));
        } else if (value === 'local') {
            router.get(route('local library'));
        } else if (value === 'global') {
            router.get(route('global library'));
        }
    };

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
                //define which field can be search
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

        return filtered.sort((a, b) => {
            if (sortBy === "Newest") {
                const dateA = a.created_at || a.published_at;
                const dateB = b.created_at || b.published_at;
                if (dateA && dateB) {
                    if (typeof dateA === 'number' && typeof dateB === 'number') {
                        return dateB - dateA;
                    }
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                }
                return 0;
            } else if (sortBy === "Title A-Z") {
                return a.title.localeCompare(b.title);
            } else if (sortBy === "Most Viewed") {
                const viewA = a.view ?? 0;
                const viewB = b.view ?? 0;
                return viewB - viewA;
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

    // Handle outside click to close card
    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
                setOpenBookCard(null);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    // Handle modal and card keydown events
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isModalOpen) {
                if (e.key === "Escape") { setIsModalOpen(false); }
                else if (e.key === "f" || e.key === "F") { setIsFullScreen(!isFullScreen); }
            } else if (openBookCard !== null && e.key === "Escape") {
                setOpenBookCard(null);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isModalOpen, isFullScreen, openBookCard]);

    const accentColor = 'cyan';
    const isAuthenticated = auth.user !== null;

    // Updated NavUser with dropdown
    const NavUser = ({ user }: { user: AuthUser }) => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex items-center space-x-3 text-sm sm:text-base px-4 h-10 sm:h-11 rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm"
                >
                    <img
                        src={"https://fls-9fd96a88-703c-423b-a3c6-5b74b203b091.laravel.cloud/"+user.avatar}
                        alt={user.name}
                        className="h-8 w-8 rounded-full object-contain border border-gray-300 dark:border-gray-600"
                    />
                    <span className="truncate max-w-32 sm:max-w-48 font-medium">{user.name}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700">
                <DropdownMenuLabel className="flex flex-col space-y-1 pb-2">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">{user.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="my-2" />
                <DropdownMenuItem
                    onClick={() => router.post(route('logout'))}
                    className="flex items-center space-x-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors text-red-600 dark:text-red-400"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );

    // Common card content component to avoid duplication
    const BookCardContent = ({ book }: { book: Book }) => (
        <div className="space-y-4">
            <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white">{book.title}</h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300"><span className="font-semibold">អ្នកនិពន្ធ:</span> {book.author}</p>
            {book.category && (
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300"><span className="font-semibold">ប្រភេទ:</span> {book.category.name}</p>
            )}
            {book.subcategory && (
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300"><span className="font-semibold">ប្រភេទរង:</span> {book.subcategory.name}</p>
            )}
            {book.type === 'physical' && (
                <div className={`flex items-center text-sm sm:text-base font-semibold ${book.is_available ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {book.is_available ? <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 mr-1 text-green-500" /> : <XCircle className="w-4 sm:w-5 h-4 sm:h-5 mr-1 text-red-500" />}
                    ស្ថានភាព: {book.is_available ? 'មិនទាន់ខ្ចី' : 'ត្រូវបានខ្ចី'}
                </div>
            )}
            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 space-y-1.5 pt-3 border-t border-gray-200 dark:border-gray-600">
                {book.publisher && <p><span className="font-medium text-gray-700 dark:text-gray-300">បោះពុម្ពផ្សាយ:</span> {book.publisher}</p>}
                {book.isbn && <p className="break-words"><span className="font-medium text-gray-700 dark:text-gray-300">ISBN:</span> {book.isbn}</p>}
                {book.page_count && <p><span className="font-medium text-gray-700 dark:text-gray-300">ចំនួនទំព័រ:</span> {book.page_count}</p>}
                {book.language && <p><span className="font-medium text-gray-700 dark:text-gray-300">ភាសា:</span> {book.language === 'en' ? 'អង់គ្លេស' : book.language === 'kh' ? 'ខ្មែរ' : book.language}</p>}
                {book.bookcase?.code && <p><span className="font-medium text-gray-700 dark:text-gray-300">ទីតាំង:</span> {book.bookcase.code} / {book.shelf?.code}</p>}
                {book.published_at && <p><span className="font-medium text-gray-700 dark:text-gray-300">ឆ្នាំបោះពុម្ព:</span> {formatDate(book.published_at)}</p>}
            </div>
            {book.type === 'ebook' && (
                <div className="flex flex-col items-start w-full space-y-2 pt-3 border-t border-gray-200 dark:border-gray-600">
                    {book.flip_link && (
                        <button
                            onClick={() => {
                                setIsModalOpen(true);
                                setSelectedBook(book);
                                setOpenBookCard(null);
                            }}
                            role="link"
                            className={`group text-xs sm:text-sm flex items-center font-semibold transition-all text-gray-700 dark:text-gray-300 p-2 rounded-md w-full justify-start
                                    hover:bg-green-50 dark:hover:bg-green-700 hover:text-green-600 dark:hover:text-green-400`}
                        >
                            <BookOpen className={`w-4 sm:w-5 h-4 sm:h-5 mr-3 text-green-500 dark:text-green-400 group-hover:text-green-600 dark:group-hover:text-green-400`} />
                            ចាប់ផ្តើមអាន
                        </button>
                    )}
                    {book.pdf_url && book.downloadable === 1 && (
                        <a
                            href={book.pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`group text-xs sm:text-sm flex items-center font-semibold transition-all text-gray-700 dark:text-gray-300 p-2 rounded-md w-full justify-start
                                      hover:bg-blue-50 dark:hover:bg-blue-700 hover:text-blue-600 dark:hover:text-blue-400`}
                        >
                            <Download className="w-4 sm:w-5 h-4 sm:h-5 mr-3 text-blue-500 dark:text-blue-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                            ទាញយក
                        </a>
                    )}
                    {/*route to Library Client Show(not implement yet*/}
                    <a
                        href={"#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`group text-xs sm:text-sm flex items-center font-semibold transition-all p-2 rounded-md w-full justify-start
                  text-gray-700 dark:text-gray-300
                  hover:bg-amber-50 dark:hover:bg-amber-800/50 hover:text-amber-700 dark:hover:text-amber-400`}
                    >
                        <Info className="w-4 sm:w-5 h-4 sm:h-5 mr-3 transition-colors
                   text-amber-600 dark:text-amber-400
                   group-hover:text-amber-700 dark:group-hover:text-amber-400" />
                        មើលពណ៌មានបន្ថែម
                    </a>
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
            <Head title={bookType === 'ebook' ? "eBooks Library" : "Books Library"} />

            <div className="py-4 space-y-12 w-full max-w-full mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 text-gray-900 dark:text-gray-100">
                {/* Header */}
                <header className="flex flex-col border-b border-gray-100 dark:border-gray-800 pb-4 gap-4 px-2
                   sm:flex-row sm:items-center sm:justify-between sm:pb-4">

                    {/* NEW CONTAINER for Logo and Mobile Controls (for the top row on mobile) */}
                    <div className="flex items-center justify-between w-full sm:w-auto">

                        {/* 1. Logo Section (Left Aligned) - NO CHANGE */}
                        <div className="flex items-center space-x-4 sm:space-x-6 min-w-max">
                            <Link href="/" className="flex items-center space-x-3">
                                <img
                                    src="/images/DIS(no back).png"
                                    alt="Logo"
                                    className="h-12 sm:h-14 w-14 sm:w-14 object-fit"
                                />
                            </Link>
                        </div>

                        {/* 3. User Controls Section (Right Aligned on Mobile) - MODIFIED */}
                        <div className="flex justify-end items-center min-w-max sm:hidden">
                            {/* Hamburger Button (Menu Lucide Icon) for Small Screens */}
                            <Button
                                variant="ghost"
                                className="p-2" // Removed sm:hidden as this div is hidden on sm
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                {isMenuOpen ? (
                                    <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                                ) : (
                                    <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                                )}
                            </Button>
                        </div>

                    </div>

                    {/* 2. Search Bar Section (Center Aligned on Desktop, Full Width on Mobile) - NO CHANGE */}
                    <div className="relative w-full max-w-md sm:max-w-lg sm:mx-auto ">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 sm:h-5 w-4 sm:w-5 text-gray-400 dark:text-gray-500" />
                        <Input
                            placeholder="ស្វែងរក"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className={`w-full bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 rounded-full shadow-inner pl-10 h-10 sm:h-11
                    dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-500
                      focus:ring-2 focus:ring-${accentColor}-500 focus:border-${accentColor}-500 transition-all pr-3 text-sm sm:text-base`}
                        />
                    </div>

                    {/* 3. User Controls Section (Right Aligned) - DESKTOP ONLY */}
                    <div className="hidden sm:w-auto sm:flex justify-end items-center min-w-max">
                        {/* User Menu for Larger Screens */}
                        {isAuthenticated && (
                            <NavUser user={auth.user!} />
                        )}
                    </div>

                    {/* Mobile Menu (Positioning adjusted to be relative to the header) - Keep this as is */}
                    {isMenuOpen && (
                        <div className="sm:hidden absolute top-20 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl p-4 w-48 z-50">
                            {isAuthenticated ? (
                                <>
                                    <div className="flex flex-col space-y-2 mb-4 border-b pb-3 border-gray-100 dark:border-gray-700">
                                        <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">{auth.user!.name}</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 truncate">{auth.user!.email}</span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            router.post(route('logout'), {}, {
                                                onSuccess: () => setIsMenuOpen(false),
                                            });
                                        }}
                                        className="flex items-center space-x-2 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md w-full text-left"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Logout</span>
                                    </button>
                                </>
                            ) : (
                                <Link
                                    href={route("login")}
                                    className="flex items-center space-x-2 py-2 text-cyan-600 dark:text-cyan-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <LogIn className="w-4 h-4" />
                                    <span>Sign In</span>
                                </Link>
                            )}
                        </div>
                    )}
                </header>

                {flash.message && (
                    <div className="p-4 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-lg shadow-lg">
                        {flash.message}
                    </div>
                )}

                {/* Filters */}
                <div className="flex flex-col sm:flex-row flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-4 justify-center">
                    {/* Library Selector: Updated for full responsiveness */}
                    <Select value={currentLibrary} onValueChange={handleLibraryChange}>
                        <SelectTrigger className={`w-full sm:w-auto min-w-max bg-white border border-gray-300 text-gray-900 hover:border-gray-400
                                                dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:border-gray-600
                                                  focus:ring-${accentColor}-500 transition rounded-full text-sm sm:text-base text-center
                                                  `}>
                            <SelectValue placeholder="Select Library" className="whitespace-nowrap" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200 text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                            <SelectItem value="global">បណ្ណាល័យសកល</SelectItem>
                            <SelectItem value="local">បណ្ណាល័យក្នុងក្នុងតំបន់</SelectItem>
                            <SelectItem value="ebook">បណ្ណាល័យអេឡិចត្រូនិក</SelectItem>
                        </SelectContent>
                    </Select>
                    {[
                        { label: "ប្រភេទ", value: filterCategory, onChange: setFilterCategory, options: categories },
                        { label: "ប្រភេទរង", value: filterSubCategory, onChange: setFilterSubCategory, options: subcategories },
                        { label: "ភាសា", value: filterLanguage, onChange: setFilterLanguage, options: languages, display: (lang: string) => lang === 'en' ? 'ភាសាអង់គ្លេស' : lang === 'kh' ? 'ភាសាខ្មែរ' : lang },
                        { label: "កម្រិតថ្នាក់", value: filterGrade, onChange: setFilterGrade, options: grades },
                        { label: "មុខវិជ្ជា", value: filterSubject, onChange: setFilterSubject, options: subjects },
                        ...(bookType === 'physical' ? [
                            // { label: "ទូរសៀវភៅ", value: filterBookcase, onChange: setFilterBookcase, options: bookcases },
                            // { label: "ធ្នើរ", value: filterShelf, onChange: setFilterShelf, options: shelves },
                        ] : []),
                        ...(bookType === 'physical' && scope !== 'local' ? [
                            { label: "ទីតាំង", value: filterCampus, onChange: setFilterCampus, options: campuses },
                        ] : []),
                    ].map(({ label, value, onChange, options, display }) => (
                        <Select key={label} value={value} onValueChange={onChange}>
                            <SelectTrigger
                                className={`w-full sm:w-40 md:w-48 bg-white border border-gray-300 text-gray-900 hover:border-gray-400
                          dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:border-gray-600
                          focus:ring-${accentColor}-500 transition rounded-full text-sm sm:text-base text-center`}
                            >
                                <SelectValue placeholder={label} />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-gray-200 text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-white min-w-[150px] max-w-[90vw]">
                                <SelectItem value="All" className="hover:bg-gray-100 dark:hover:bg-gray-700 text-center whitespace-normal">{label}ទាំងអស់</SelectItem>
                                {options.map((opt) => (
                                    <SelectItem key={opt} value={opt} className="hover:bg-gray-100 dark:hover:bg-gray-700 text-center whitespace-normal">
                                        {display ? display(opt) : opt}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    ))}
                    {/* Sort Selector*/}
                    {/*<Select value={sortBy} onValueChange={setSortBy}>*/}
                    {/*    <SelectTrigger className={`w-full sm:w-40 md:w-48 bg-white border border-gray-300 text-gray-900 hover:border-gray-400*/}
                    {/*             dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:border-gray-600*/}
                    {/*             focus:ring-${accentColor}-500 transition font-semibold rounded-full text-sm sm:text-base text-center`}*/}
                    {/*    >*/}
                    {/*        <ArrowDownUp className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />*/}
                    {/*        <SelectValue placeholder="Sort By" />*/}
                    {/*    </SelectTrigger>*/}
                    {/*    <SelectContent className="bg-white border-gray-200 text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-white min-w-[150px] max-w-[90vw]">*/}
                    {/*        <SelectItem value="Newest" className="hover:bg-gray-100 dark:hover:bg-gray-700 text-center whitespace-normal">ថ្មីបំផុត</SelectItem>*/}
                    {/*        <SelectItem value="Title A-Z" className="hover:bg-gray-100 dark:hover:bg-gray-700 text-center whitespace-normal">ចំណងជើង(ក-អ)</SelectItem>*/}
                    {/*        <SelectItem value="Most Viewed" className="hover:bg-gray-100 dark:hover:bg-gray-700 text-center whitespace-normal">ពេញនិយម</SelectItem>*/}
                    {/*    </SelectContent>*/}
                    {/*</Select>*/}
                </div>

                {/* Book Grid */}
                <TooltipProvider>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4 sm:gap-6 lg:gap-8 relative">
                        {paginatedBooks.length > 0 ? (
                            paginatedBooks.map((book) => {
                                const contributorId = book.posted_by_user_id || book.user?.id;
                                const contributorName = book.user?.name || (contributorId ? `User #${contributorId}` : 'Unknown');
                                const isContributorVerified = !!book.user?.isVerified;

                                return (
                                    <div key={book.id} className="relative">
                                        {/* Book Card */}
                                        <Tooltip>
                                            <TooltipTrigger
                                                asChild
                                                className="lg:cursor-pointer"
                                            >
                                                <div
                                                    onClick={() => setOpenBookCard(book.id)}
                                                    className={`group flex flex-col items-start space-y-3 cursor-pointer p-3 rounded-xl bg-white border border-gray-200 shadow-lg
                                                                dark:bg-gray-800 dark:border-gray-700 dark:shadow-2xl dark:shadow-gray-900/50
                                                                transition-all duration-300 transform relative overflow-hidden
                                                                hover:scale-[1.03] sm:hover:scale-[1.05] hover:shadow-2xl hover:border-${accentColor}-500 focus:outline-none focus:ring-2 focus:ring-${accentColor}-500 w-full`}
                                                >
                                                    <div className="relative w-full pb-[155%]">
                                                        <img
                                                            src={book.cover || "/images/placeholder-book.png"}
                                                            alt={book.title}
                                                            className="absolute inset-0 w-full h-full object-fill rounded-lg shadow-xl transition-transform duration-300 group-hover:scale-105"
                                                        />
                                                    </div>
                                                    <div className="flex items-center justify-center space-x-2 pt-1 border-t border-gray-100 dark:border-gray-700 w-full">
                                                        <img
                                                            src={"https://fls-9fd96a88-703c-423b-a3c6-5b74b203b091.laravel.cloud/" + book.user?.avatar}
                                                            alt="Contributor Avatar"
                                                            className="w-5 sm:w-6 h-5 sm:h-6 rounded-full object-cover border border-gray-300 dark:border-gray-600 flex-shrink-0"
                                                        />
                                                        <span className="text-xs text-gray-400 dark:text-gray-500 truncate font-medium flex items-center min-w-0">
                                                            <span className="truncate flex-grow">{contributorName}</span>
                                                            {isContributorVerified && (
                                                                <BadgeCheck className="w-3 sm:w-4 h-3 sm:h-4 ml-1 text-blue-500 dark:text-blue-400 fill-white dark:fill-gray-900 flex-shrink-0" />
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TooltipTrigger>
                                            {/* Hover Card for Large Screens */}
                                            <TooltipContent
                                                side="right"
                                                className={`hidden lg:block max-w-md w-full p-5 rounded-xl shadow-2xl border-l-4 border-gray-200 bg-white text-gray-900
                                                            dark:border-gray-700 dark:bg-gray-800 dark:text-white z-50
                                                            ${book.type === 'ebook' ? `border-${accentColor}-500` : 'border-amber-500'}`}
                                            >
                                                <BookCardContent book={book} />
                                            </TooltipContent>
                                        </Tooltip>

                                        {/* Click-Based Card for Smaller Screens */}
                                        {openBookCard === book.id && (
                                            <div
                                                ref={cardRef}
                                                className={`lg:hidden fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[90]
                                                            max-w-[90vw] w-full sm:max-w-md p-4 sm:p-5 rounded-xl shadow-2xl border-l-4 border-gray-200 bg-white text-gray-900
                                                            dark:border-gray-700 dark:bg-gray-800 dark:text-white
                                                            ${book.type === 'ebook' ? `border-${accentColor}-500` : 'border-amber-500'}`}
                                            >
                                                <div className="flex justify-between items-center mb-4">
                                                    <button
                                                        onClick={() => setOpenBookCard(null)}
                                                        className="text-gray-400 hover:text-red-600 transition-colors text-xl sm:text-2xl leading-none font-light"
                                                    >
                                                        <X className="w-5 sm:w-6 h-5 sm:h-6" />
                                                    </button>
                                                </div>
                                                <BookCardContent book={book} />
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-center text-gray-500 dark:text-gray-400 col-span-full py-12 sm:py-20 text-base sm:text-xl font-light">
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
                            className={`flex items-center text-${accentColor}-600 dark:text-${accentColor}-400 disabled:opacity-50 text-sm sm:text-base px-3 sm:px-4 h-10 sm:h-11`}
                        >
                            <ChevronLeft className="w-4 sm:w-5 h-4 sm:h-5 mr-1" />
                            Previous
                        </Button>
                        <span className="text-sm sm:text-md font-semibold text-gray-700 dark:text-gray-300">
                            Page {currentPage} of {totalPages}
                        </span>
                        <Button
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages}
                            variant="outline"
                            className={`flex items-center text-${accentColor}-600 dark:text-${accentColor}-400 disabled:opacity-50 text-sm sm:text-base px-3 sm:px-4 h-10 sm:h-11`}
                        >
                            Next
                            <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5 ml-1" />
                        </Button>
                    </div>
                )}

                {/* Modal for Book Display (Reader/Viewer) */}
                {isModalOpen && selectedBook && (
                    <div className="fixed inset-0 flex items-center justify-center z-[100] bg-gray-800 bg-opacity-30 dark:bg-opacity-40">
                        <div
                            className={`bg-white dark:bg-gray-850 rounded-lg shadow-2xl flex flex-col transition-all duration-300 ${
                                isFullScreen ? 'w-full h-full max-w-none max-h-none' : 'w-11/12 max-w-[90vw] h-[90vh] sm:h-[95vh]'
                            } relative z-[110]`}
                        >
                            <div className="flex justify-between items-center p-3 sm:p-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
                                <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">{selectedBook.title}</h2>
                                <div className="flex space-x-2 sm:space-x-4 items-center">
                                    <button
                                        onClick={() => setIsFullScreen(!isFullScreen)}
                                        className={`text-${accentColor}-600 dark:text-${accentColor}-400 hover:text-${accentColor}-800 dark:hover:text-${accentColor}-300 transition-colors p-1 rounded-md`}
                                    >
                                        {isFullScreen ? <Minimize className="h-6 sm:h-7 w-6 sm:w-7" /> : <Maximize className="h-6 sm:h-7 w-6 sm:w-7" />}
                                    </button>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="text-gray-400 hover:text-red-600 transition-colors text-2xl sm:text-4xl leading-none font-light p-1 rounded-md"
                                    >
                                        &times;
                                    </button>
                                </div>
                            </div>
                            <div className="flex-1 overflow-hidden p-3 sm:p-4 bg-gray-50 dark:bg-gray-800">
                                <iframe
                                    src={selectedBook.flip_link || selectedBook.pdf_url || ""}
                                    title={selectedBook.title}
                                    className="w-full h-full border-0 bg-white dark:bg-gray-900"
                                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                                    style={{ background: 'inherit' }}
                                ></iframe>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
