"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Head, Link, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { NavUser } from "@/components/nav-user";

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
    auth: { user: AuthUser };
    scope?: 'local' | 'global'; // Add scope to PageProps
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: "Books Library", href: "/books" },
];

export default function BookIndex() {
    const { books, flash, auth, scope } = usePage<PageProps>().props;
    const [search, setSearch] = useState("");
    const [filterCategory, setFilterCategory] = useState("All");
    const [filterSubCategory, setFilterSubCategory] = useState("All");
    const [filterBookcase, setFilterBookcase] = useState("All");
    const [filterShelf, setFilterShelf] = useState("All");
    const [filterGrade, setFilterGrade] = useState("All");
    const [filterSubject, setFilterSubject] = useState("All");
    const [filterCampus, setFilterCampus] = useState("All");
    const [filterLanguage, setFilterLanguage] = useState("All");

    // Collect unique filter options
    const categories = useMemo(() => Array.from(new Set(books.map((b) => b.category?.name).filter(Boolean))), [books]);
    const subcategories = useMemo(() => Array.from(new Set(books.map((b) => b.subcategory?.name).filter(Boolean))), [books]);
    const bookcases = useMemo(() => Array.from(new Set(books.map((b) => b.bookcase?.code).filter(Boolean))), [books]);
    const shelves = useMemo(() => Array.from(new Set(books.map((b) => b.shelf?.code).filter(Boolean))), [books]);
    const grades = useMemo(() => Array.from(new Set(books.map((b) => b.grade?.name).filter(Boolean))), [books]);
    const subjects = useMemo(() => Array.from(new Set(books.map((b) => b.subject?.name).filter(Boolean))), [books]);
    const campuses = useMemo(() => Array.from(new Set(books.map((b) => b.campus?.name).filter(Boolean))), [books]);
    const languages = useMemo(() => Array.from(new Set(books.map((b) => b.language).filter(Boolean))), [books]);

    // Filtered books logic
    const filteredBooks = useMemo(() => {
        return books.filter((book) => {
            if (book.type !== "physical") return false;

            const matchesSearch =
                book.title.toLowerCase().includes(search.toLowerCase()) ||
                book.author.toLowerCase().includes(search.toLowerCase());

            const matchesCategory = filterCategory === "All" || book.category?.name === filterCategory;
            const matchesSubCategory = filterSubCategory === "All" || book.subcategory?.name === filterSubCategory;
            const matchesBookcase = filterBookcase === "All" || book.bookcase?.code === filterBookcase;
            const matchesShelf = filterShelf === "All" || book.shelf?.code === filterShelf;
            const matchesGrade = filterGrade === "All" || book.grade?.name === filterGrade;
            const matchesSubject = filterSubject === "All" || book.subject?.name === filterSubject;
            const matchesCampus = filterCampus === "All" || book.campus?.name === filterCampus;
            const matchesLanguage = filterLanguage === "All" || book.language === filterLanguage;

            return (
                matchesSearch &&
                matchesCategory &&
                matchesSubCategory &&
                matchesBookcase &&
                matchesShelf &&
                matchesGrade &&
                matchesSubject &&
                matchesCampus &&
                matchesLanguage
            );
        });
    }, [books, search, filterCategory, filterSubCategory, filterBookcase, filterShelf, filterGrade, filterSubject, filterCampus, filterLanguage]);

    // Sound effect setup
    const hoverSoundRef = useRef<HTMLAudioElement | null>(null);
    useEffect(() => {
        hoverSoundRef.current = new Audio("/sounds/hover.mp3");
    }, []);

    const playHoverSound = () => {
        if (hoverSoundRef.current) {
            hoverSoundRef.current.currentTime = 0;
            hoverSoundRef.current.play().catch(() => {});
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} user={auth.user}>
            <Head title="Books Library" />

            {/* Main content container with no horizontal padding to fill full width */}
            <div className="py-4 space-y-8 bg-background transition-colors duration-300 w-full lg:pl-30 lg:pr-30">
                {/* 🔹 Top Bar (now uses padding to prevent content from touching edges) */}
                <div className="flex items-center justify-between mb-6 px-4 md:px-12">
                    <Link href="/" className="flex items-center space-x-2">
                        <img src="/images/DIS(no back).png" alt="Logo" className="h-12 w-12 object-contain" />
                    </Link>

                    <div className="origin-right">
                        <NavUser user={auth.user} />
                    </div>
                </div>

                {/* Flash message */}
                {flash.message && (
                    <div className="p-4 bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100 rounded-md shadow mx-4 md:mx-12">
                        {flash.message}
                    </div>
                )}

                {/* Main Content Header */}
                <div className="space-y-2 px-4 md:px-12">
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Books Library</h1>
                    <p className="text-muted-foreground">Browse and filter the school's collection of physical books.</p>
                    <hr className="my-6 border-t border-border" />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-4 px-4 md:px-12">
                    <Input
                        placeholder="Search any keyword"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-grow sm:w-40 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
                    />

                    {/* Category */}
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                        <SelectTrigger className="w-full sm:w-40">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Categories</SelectItem>
                            {categories.map((cat) => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* SubCategory */}
                    <Select value={filterSubCategory} onValueChange={setFilterSubCategory}>
                        <SelectTrigger className="w-full sm:w-40">
                            <SelectValue placeholder="Sub-Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All SubCategories</SelectItem>
                            {subcategories.map((sub) => (
                                <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Bookcase */}
                    <Select value={filterBookcase} onValueChange={setFilterBookcase}>
                        <SelectTrigger className="w-full sm:w-40">
                            <SelectValue placeholder="Bookcase" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Bookcases</SelectItem>
                            {bookcases.map((bc) => (
                                <SelectItem key={bc} value={bc}>{bc}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Shelf */}
                    <Select value={filterShelf} onValueChange={setFilterShelf}>
                        <SelectTrigger className="w-full sm:w-40">
                            <SelectValue placeholder="Shelf" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Shelves</SelectItem>
                            {shelves.map((sh) => (
                                <SelectItem key={sh} value={sh}>{sh}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Language with conditional labels */}
                    <Select value={filterLanguage} onValueChange={setFilterLanguage}>
                        <SelectTrigger className="w-full sm:w-40">
                            <SelectValue placeholder="Language" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Languages</SelectItem>
                            {languages.map((lang) => (
                                <SelectItem key={lang} value={lang}>
                                    {lang === 'en' ? 'English' : 'Khmer'}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Grade */}
                    <Select value={filterGrade} onValueChange={setFilterGrade}>
                        <SelectTrigger className="w-full sm:w-40">
                            <SelectValue placeholder="Grade" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Grades</SelectItem>
                            {grades.map((g) => (
                                <SelectItem key={g} value={g}>{g}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Subject */}
                    <Select value={filterSubject} onValueChange={setFilterSubject}>
                        <SelectTrigger className="w-full sm:w-40">
                            <SelectValue placeholder="Subject" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Subjects</SelectItem>
                            {subjects.map((s) => (
                                <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Campus (hidden for 'local' scope) */}
                    {scope !== 'local' && (
                        <Select value={filterCampus} onValueChange={setFilterCampus}>
                            <SelectTrigger className="w-full sm:w-40">
                                <SelectValue placeholder="Campus" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Campuses</SelectItem>
                                {campuses.map((c) => (
                                    <SelectItem key={c} value={c}>{c}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </div>

                {/* Book Grid */}
                <TooltipProvider>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8 px-4 md:px-12">
                        {filteredBooks.length > 0 ? (
                            filteredBooks.map((book) => (
                                <Tooltip key={book.id}>
                                    <TooltipTrigger
                                        onMouseEnter={playHoverSound}
                                        className="flex flex-col items-center space-y-2 cursor-pointer transition-transform duration-200 hover:scale-105"
                                    >
                                        {/* Book Cover */}
                                        <div className="relative w-full pb-[150%]">
                                            <img
                                                src={book.cover || "/images/placeholder-book.png"}
                                                alt={book.title}
                                                className="absolute inset-0 w-full h-full object-cover rounded-md shadow-lg"
                                            />
                                        </div>
                                        {/*<p className="text-sm font-medium text-center truncate w-full px-1">{book.title}</p>*/}
                                    </TooltipTrigger>

                                    {/* Extended Tooltip Content */}
                                    <TooltipContent side="right" className="max-w-xs p-4 space-y-2 rounded-lg shadow-xl">
                                        <h3 className="text-lg font-semibold">{book.title}</h3>
                                        <p className="text-sm"><span className="font-medium">Author:</span> {book.author}</p>
                                        <p className={`text-sm font-medium ${book.is_available ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                                            {book.is_available ? "Available" : "Unavailable"}
                                        </p>
                                        <div className="text-xs text-muted-foreground border-t pt-2 mt-2 space-y-1">
                                            {/*{book.category?.name && <p><span className="font-medium">Category:</span> {book.category.name}</p>}*/}
                                            {book.subcategory?.name && <p><span className="font-medium">Sub-Category:</span> {book.subcategory.name}</p>}
                                            {book.bookcase?.code && <p><span className="font-medium">Bookcase:</span> {book.bookcase.code}</p>}
                                            {book.shelf?.code && <p><span className="font-medium">Shelf:</span> {book.shelf.code}</p>}
                                            {book.grade?.name && <p><span className="font-medium">Grade:</span> {book.grade.name}</p>}
                                            {book.subject?.name && <p><span className="font-medium">Subject:</span> {book.subject.name}</p>}
                                            {book.campus?.name && scope !== "local" && <p><span className="font-medium">Campus:</span> {book.campus.name}</p>}
                                            {book.language && <p><span className="font-medium">Language:</span> {book.language}</p>}
                                            {book.publisher && <p><span className="font-medium">Publisher:</span> {book.publisher}</p>}
                                            {book.isbn && <p><span className="font-medium">ISBN:</span> {book.isbn}</p>}
                                            {book.code && <p><span className="font-medium">Code:</span> {book.code}</p>}
                                            {book.page_count && <p><span className="font-medium">Pages:</span> {book.page_count}</p>}
                                            {book.description && <p className="mt-2">{book.description}</p>}
                                        </div>
                                        <div className="flex flex-col items-start gap-2 pt-2 border-t mt-2">
                                            {book.flip_link && (
                                                <a
                                                    href={book.flip_link}
                                                    target="_blank"
                                                    className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline transition-colors"
                                                >
                                                    Open Flipbook
                                                </a>
                                            )}
                                            {book.pdf_url && (
                                                <a
                                                    href={book.pdf_url}
                                                    target="_blank"
                                                    className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline transition-colors"
                                                >
                                                    Download PDF
                                                </a>
                                            )}
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 dark:text-gray-400 col-span-full py-12">
                                No books found. Please adjust your filters.
                            </p>
                        )}
                    </div>
                </TooltipProvider>
            </div>
        </AppLayout>
    );
}
