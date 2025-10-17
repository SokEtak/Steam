"use client";

import { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from '@/components/ui/select';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    ChevronLeft,
    ChevronRight,
    Search,
    ArrowDownUp,
    LogIn,
    BadgeCheck,
    X,
    User,
    LogOut,
    Menu,
    ArrowUpAZ,
    Clock,
    Eye,
    Globe,
    Crown,
} from 'lucide-react';
import { translations } from '@/utils/translations';

interface Book {
    language: any;
    program?: string | null;
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
    lang?: 'en' | 'kh';
}

const ITEMS_PER_PAGE = 40;

const formatDate = (dateInput: string | number | undefined): string => {
    if (!dateInput) return translations.kh.unknownContributor;
    if (typeof dateInput === 'number') {
        return dateInput.toString();
    }
    try {
        return new Date(dateInput).toLocaleDateString('km-KH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    } catch {
        return 'កាលបរិច្ឆេទមិនត្រឹមត្រូវ';
    }
};

export default function Index() {
    const { books, flash, auth, scope, bookType = 'physical', lang = 'kh' } = usePage<PageProps>().props;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [filterSubCategory, setFilterSubCategory] = useState('All');
    const [filterBookcase, setFilterBookcase] = useState('All');
    const [filterShelf, setFilterShelf] = useState('All');
    const [filterGrade, setFilterGrade] = useState('All');
    const [filterSubject, setFilterSubject] = useState('All');
    const [filterCampus, setFilterCampus] = useState('All');
    const [filterLanguage, setFilterLanguage] = useState('All');
    const [sortProgram, setSortProgram] = useState('All');
    const [sortBy, setSortBy] = useState('None');
    const [currentPage, setCurrentPage] = useState(1);
    const [language, setLanguage] = useState<'en' | 'kh'>(() => {
        const savedLanguage = typeof window !== 'undefined' ? localStorage.getItem('language') : null;
        return (savedLanguage === 'en' || savedLanguage === 'kh' ? savedLanguage : lang) as 'en' | 'kh';
    });

    useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);

    const t = translations[language];

    const toggleLanguage = () => {
        setLanguage((prev) => (prev === 'kh' ? 'en' : 'kh'));
    };

    const currentLibrary = bookType === 'ebook' ? 'ebook' : scope === 'global' ? 'global' : 'local';

    const handleLibraryChange = (value: string) => {
        if (value === 'ebook') {
            router.get(route('global e-library'));
        } else if (value === 'local') {
            router.get(route('local library'));
        } else if (value === 'global') {
            router.get(route('global library'));
        }
    };

    const categories = useMemo(
        () => Array.from(new Set(books.map((b) => b.category?.name).filter(Boolean))),
        [books]
    );
    const subcategories = useMemo(
        () => Array.from(new Set(books.map((b) => b.subcategory?.name).filter(Boolean))),
        [books]
    );
    const bookcases = useMemo(
        () => Array.from(new Set(books.map((b) => b.bookcase?.code).filter(Boolean))),
        [books]
    );
    const shelves = useMemo(
        () => Array.from(new Set(books.map((b) => b.shelf?.code).filter(Boolean))),
        [books]
    );
    const grades = useMemo(() => {
        const gradeNames = Array.from(
            new Set(
                books
                    .map((b) => b.grade?.name)
                    .filter((name): name is string => !!name)
                    .filter((name) => {
                        const match = name.match(/(\d+)/);
                        const num = match ? parseInt(match[0], 10) : null;
                        return num !== null && num >= 1 && num <= 12;
                    })
            )
        );
        return gradeNames.sort((a, b) => {
            const numA = parseInt(a.match(/(\d+)/)![0], 10);
            const numB = parseInt(b.match(/(\d+)/)![0], 10);
            return numA - numB;
        });
    }, [books]);
    const subjects = useMemo(
        () => Array.from(new Set(books.map((b) => b.subject?.name).filter(Boolean))),
        [books]
    );
    const campuses = useMemo(
        () => Array.from(new Set(books.map((b) => b.campus?.name).filter(Boolean))),
        [books]
    );
    const languages = useMemo(
        () => Array.from(new Set(books.map((b) => b.language).filter(Boolean))),
        [books]
    );
    const programs = useMemo(
        () => Array.from(new Set(books.map((b) => b.program?.toLowerCase()).filter(Boolean))),
        [books]
    );

    const allFilteredBooks = useMemo(() => {
        let filtered = books.filter((book) => {
            if (book.type !== bookType) return false;

            const title = String(book.title || '');
            const author = String(book.author || '');
            const code = String(book.code || '');
            const query = search.toLowerCase();

            const matchesSearch =
                title.toLowerCase().includes(query) ||
                author.toLowerCase().includes(query) ||
                code.toLowerCase().includes(query);

            const matchesCategory = filterCategory === 'All' || book.category?.name === filterCategory;
            const matchesSubCategory =
                filterSubCategory === 'All' || book.subcategory?.name === filterSubCategory;
            const matchesBookcase =
                bookType === 'ebook' || filterBookcase === 'All' || book.bookcase?.code === filterBookcase;
            const matchesShelf =
                bookType === 'ebook' || filterShelf === 'All' || book.shelf?.code === filterShelf;
            const matchesGrade = filterGrade === 'All' || book.grade?.name === filterGrade;
            const matchesSubject = filterSubject === 'All' || book.subject?.name === filterSubject;
            const matchesCampus =
                bookType === 'ebook' ||
                scope !== 'local' ||
                filterCampus === 'All' ||
                book.campus?.name === filterCampus;
            const matchesLanguage = filterLanguage === 'All' || book.language === filterLanguage;
            const matchesProgram =
                sortProgram === 'All' ||
                String(book.program || '').toLowerCase() === sortProgram.toLowerCase();

            return (
                matchesSearch &&
                matchesCategory &&
                matchesSubCategory &&
                matchesBookcase &&
                matchesShelf &&
                matchesGrade &&
                matchesSubject &&
                matchesCampus &&
                matchesLanguage &&
                matchesProgram
            );
        });

        return filtered.sort((a, b) => {
            if (sortBy === 'Newest') {
                const dateA = a.created_at || a.published_at;
                const dateB = b.created_at || b.published_at;
                if (dateA && dateB) {
                    if (typeof dateA === 'number' && typeof dateB === 'number') {
                        return dateB - dateA;
                    }
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                }
                return 0;
            } else if (sortBy === 'Title A-Z') {
                return a.title.localeCompare(b.title);
            } else if (sortBy === 'Most Viewed') {
                const viewA = a.view ?? 0;
                const viewB = b.view ?? 0;
                return viewB - viewA;
            }
            return 0;
        });
    }, [
        books,
        search,
        filterCategory,
        filterSubCategory,
        filterBookcase,
        filterShelf,
        filterGrade,
        filterSubject,
        filterCampus,
        filterLanguage,
        sortProgram,
        sortBy,
        bookType,
        scope,
    ]);

    // Find the book with the highest view count
    const maxViews = allFilteredBooks.length > 0 ? Math.max(...allFilteredBooks.map(b => b.view ?? 0)) : 0;

    const totalPages = Math.ceil(allFilteredBooks.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedBooks = allFilteredBooks.slice(startIndex, endIndex);

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [
        search,
        filterCategory,
        filterSubCategory,
        filterBookcase,
        filterShelf,
        filterGrade,
        filterSubject,
        filterCampus,
        filterLanguage,
        sortProgram,
        sortBy,
    ]);

    const accentColor = 'cyan';
    const isAuthenticated = auth.user !== null;
    const allText = language === 'en' ? 'All' : 'ទាំងអស់';
    const BASE_URL = 'https://fls-9fd96a88-703c-423b-a3c6-5b74b203b091.laravel.cloud';

    const NavUser = ({ user }: { user: AuthUser }) => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex items-center space-x-3 text-sm sm:text-base px-4 h-10 sm:h-11 rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm"
                >
                    <img
                        src={user.avatar ? user.avatar : 'https://via.placeholder.com/40'}
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
                    onClick={toggleLanguage}
                    className="flex items-center space-x-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors text-gray-700 dark:text-gray-300"
                >
                    <Globe className="w-5 h-5" />
                    <span>{language === 'kh' ? t.switchToEnglish : t.switchToKhmer}</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => router.post(route('logout'))}
                    className="flex items-center space-x-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors text-red-600 dark:text-red-400"
                >
                    <LogOut className="w-5 h-5" />
                    <span>{t.logout}</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
            <Head
                title={
                    bookType === 'ebook'
                        ? t.ebooksLibrary
                        : t.language === 'kh'
                            ? 'បណ្ណាល័យសៀវភៅ'
                            : 'Books Library'
                }
            />
            <div className="py-4 space-y-12 w-full max-w-full mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 text-gray-900 dark:text-gray-100">
                <header className="flex flex-col border-b border-gray-100 dark:border-gray-800 pb-4 gap-4 px-2 sm:flex-row sm:items-center sm:justify-between sm:pb-4">
                    <div className="flex items-center justify-between w-full sm:w-auto">
                        <div className="flex items-center space-x-4 sm:space-x-6 min-w-max">
                            <Link href="/" className="flex items-center space-x-3">
                                <img
                                    src="/images/DIS(no back).png"
                                    alt={t.language === 'en' ? 'Logo' : 'រូបសញ្ញា'}
                                    className="h-12 sm:h-14 w-14 sm:w-14 object-fit"
                                />
                            </Link>
                        </div>
                        <div className="flex justify-end items-center min-w-max sm:hidden">
                            <Button
                                variant="ghost"
                                className="p-2"
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
                    <div className="relative w-full max-w-md sm:max-w-lg sm:mx-auto md:left-30">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 sm:h-5 w-4 sm:w-5 text-gray-400 dark:text-gray-500" />
                        <Input
                            placeholder={t.searchPlaceholder}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className={`w-full bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 rounded-full shadow-inner pl-10 h-10 sm:h-11
                    dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-500
                      focus:ring-2 focus:ring-${accentColor}-500 focus:border-${accentColor}-500 transition-all pr-3 text-sm sm:text-base`}
                        />
                    </div>
                    <div className="hidden sm:w-auto sm:flex justify-end items-center min-w-max">
                        {isAuthenticated && <NavUser user={auth.user!} />}
                    </div>
                    {isMenuOpen && (
                        <div className="sm:hidden absolute top-20 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl p-4 w-48 z-50">
                            {isAuthenticated ? (
                                <>
                                    <div className="flex flex-col space-y-2 mb-4 border-b pb-3 border-gray-100 dark:border-gray-700">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {auth.user!.name}
                    </span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {auth.user!.email}
                    </span>
                                    </div>
                                    <button
                                        onClick={toggleLanguage}
                                        className="flex items-center space-x-2 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md w-full text-left"
                                    >
                                        <Globe className="w-4 h-4" />
                                        <span>{language === 'kh' ? t.switchToEnglish : t.switchToKhmer}</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            router.post(route('logout'), {}, { onSuccess: () => setIsMenuOpen(false) });
                                        }}
                                        className="flex items-center space-x-2 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md w-full text-left"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>{t.logout}</span>
                                    </button>
                                </>
                            ) : (
                                <Link
                                    href={route('login')}
                                    className="flex items-center space-x-2 py-2 text-cyan-600 dark:text-cyan-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <LogIn className="w-4 h-4" />
                                    <span>{t.signIn}</span>
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
                <div className="flex flex-col sm:flex-row flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-4 justify-center">
                    <Select value={currentLibrary} onValueChange={handleLibraryChange}>
                        <SelectTrigger
                            className={`w-full sm:w-auto min-w-max bg-white border border-gray-300 text-gray-900 hover:border-gray-400
                                                dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:border-gray-600
                                                  focus:ring-${accentColor}-500 transition rounded-full text-sm sm:text-base text-center px-2`}
                        >
                            <SelectValue placeholder={t.selectLibrary} className="whitespace-nowrap" />
                        </SelectTrigger>
                        <SelectContent className="w-auto bg-white border-gray-200 text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                            <SelectItem value="global">{t.globalLibrary}</SelectItem>
                            <SelectItem value="local">{t.localLibrary}</SelectItem>
                            <SelectItem value="ebook">{t.ebooksLibrary}</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={sortProgram} onValueChange={setSortProgram}>
                        <SelectTrigger
                            className={`w-full sm:w-auto min-w-max bg-white border border-gray-300 text-gray-900 hover:border-gray-400
                                     dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:border-gray-600
                                       focus:ring-${accentColor}-500 transition rounded-full text-sm sm:text-base text-center`}
                        >
                            <SelectValue placeholder={t.programPlaceholder} />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200 text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-white min-w-[150px] max-w-[90vw]">
                            <SelectItem value="All" className="hover:bg-gray-100 dark:hover:bg-gray-700 text-center whitespace-normal">
                                {t.programAll}
                            </SelectItem>
                            <SelectItem value="Cambodia" className="hover:bg-gray-100 dark:hover:bg-gray-700 text-center whitespace-normal">
                                {t.programCambodia}
                            </SelectItem>
                            <SelectItem value="American" className="hover:bg-gray-100 dark:hover:bg-gray-700 text-center whitespace-normal">
                                {t.programAmerican}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    {[
                        { label: t.category, value: filterCategory, onChange: setFilterCategory, options: categories },
                        { label: t.subcategory, value: filterSubCategory, onChange: setFilterSubCategory, options: subcategories },
                        ...(bookType === 'physical'
                            ? [
                                { label: t.bookcase, value: filterBookcase, onChange: setFilterBookcase, options: bookcases },
                                { label: t.shelf, value: filterShelf, onChange: setFilterShelf, options: shelves },
                            ]
                            : []),
                        {
                            label: t.language,
                            value: filterLanguage,
                            onChange: setFilterLanguage,
                            options: languages,
                            display: (lang: string) =>
                                lang === 'en' ? (t.language === 'en' ? 'English' : 'អង់គ្លេស') : lang === 'kh' ? (t.language === 'en' ? 'Khmer' : 'ខ្មែរ') : lang,
                        },
                        { label: t.grade, value: filterGrade, onChange: setFilterGrade, options: grades },
                        { label: t.subject, value: filterSubject, onChange: setFilterSubject, options: subjects },
                        ...(bookType === 'physical' && scope === 'global'
                            ? [{ label: t.campus, value:filterCampus, onChange: setFilterCampus, options: campuses }]
                            : []),
                    ].map(({ label, value, onChange, options, display }) => (
                        <Select key={label} value={value} onValueChange={onChange}>
                            <SelectTrigger
                                className={`lg:w-auto sm:w-auto md:w-auto bg-white border border-gray-300 text-gray-900 hover:border-gray-400
                          dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:border-gray-600
                          focus:ring-${accentColor}-500 transition rounded-full text-sm sm:text-base px-2 sm:text-center`}
                            >
                                <SelectValue placeholder={label} />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-gray-200 text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-white min-w-[150px] max-w-[90vw]">
                                <SelectItem value="All" className="hover:bg-gray-100 dark:hover:bg-gray-700 text-center whitespace-normal">
                                    {language === 'en' ? `${allText} ${label}` : `${label}${allText}`}
                                </SelectItem>
                                {options.map((opt) => (
                                    <SelectItem
                                        key={opt}
                                        value={opt}
                                        className="hover:bg-gray-100 dark:hover:bg-gray-700 text-center whitespace-normal"
                                    >
                                        {display ? display(opt) : opt}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    ))}
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger
                            className={`w-full sm:w-auto min-w-max bg-white border border-gray-300 text-gray-900 hover:border-gray-400
      dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:border-gray-600
      focus:ring-${accentColor}-500 transition rounded-full text-sm sm:text-base text-center flex items-center justify-center`}
                        >
                            {sortBy === 'Title A-Z' ? (
                                <ArrowUpAZ className="h-4 w-4 mr-2 text-blue-500 dark:text-blue-400" />
                            ) : sortBy === 'Newest' ? (
                                <Clock className="h-4 w-4 mr-2 text-red-500 dark:text-red-400" />
                            ) : sortBy === 'Most Viewed' ? (
                                <Eye className="h-4 w-4 mr-2 text-orange-500 dark:text-orange-400" />
                            ) : (
                                <ArrowDownUp className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                            )}
                            <SelectValue placeholder={t.sortBy} />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200 text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-white min-w-[150px] max-w-[90vw]">
                            <SelectItem value="None" className="hover:bg-gray-100 dark:hover:bg-gray-700 text-center whitespace-normal">
                                {t.defaultSort}
                            </SelectItem>
                            <SelectItem value="Newest" className="hover:bg-gray-100 dark:hover:bg-gray-700 text-center whitespace-normal">
                                {t.newest}
                            </SelectItem>
                            <SelectItem value="Title A-Z" className="hover:bg-gray-100 dark:hover:bg-gray-700 text-center whitespace-normal">
                                {t.titleAZ}
                            </SelectItem>
                            <SelectItem value="Most Viewed" className="hover:bg-gray-100 dark:hover:bg-gray-700 text-center whitespace-normal">
                                {t.mostViewed}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4 sm:gap-6 lg:gap-8">
                    {paginatedBooks.length > 0 ? (
                        paginatedBooks.map((book) => {
                            const contributorId = book.posted_by_user_id || book.user?.id;
                            const contributorName =
                                book.user?.name || (contributorId ? `អ្នកប្រើ #${contributorId}` : t.unknownContributor);
                            const isContributorVerified = !!book.user?.isVerified;

                            return (
                                <div
                                    key={book.id}
                                    onClick={() => router.get(route('library.show', book.id))}
                                    onKeyDown={(e) => e.key === 'Enter' && router.get(route('library.show', book.id))}
                                    tabIndex={0}
                                    aria-label={`View details for ${book.title} by ${book.author}`}
                                    className={`group flex flex-col items-start space-y-3 cursor-pointer p-4 rounded-xl bg-white border border-gray-200 shadow-md
                        dark:bg-gray-800 dark:border-gray-700 dark:shadow-gray-900/40
                        transition-all duration-300 transform
                        hover:scale-[1.03] sm:hover:scale-[1.05] hover:shadow-xl hover:border-image-linear-gradient-to-right-#3b82f6-#ec4899
                        focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 w-full`}
                                >
                                    <div className="relative w-full pb-[140%] sm:pb-[155%]">
                                        <img
                                            src={book.cover || '/images/placeholder-book.png'}
                                            alt={book.title}
                                            loading="lazy"
                                            className="absolute inset-0 w-full h-full object-fill rounded-lg shadow-md transition-all duration-300 group-hover:scale-105"
                                        />

                                        {/* Most Viewed Badge */}
                                        {book.view === maxViews && (
                                            <div className="absolute top-2 right-2 flex items-center space-x-1 bg-yellow-400/95 dark:bg-yellow-500/95 text-gray-900 text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm
                                border border-yellow-300 dark:border-yellow-400">
                                                <Crown className="w-3 h-3 text-yellow-700 dark:text-yellow-800" />
                                                <span>{t.mostViewed}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Book Title and Author with Tooltip */}
                                    <div className="text-center w-full">
                                        <div className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 truncate" title={book.title}>
                                            {book.title}
                                        </div>
                                        {/*<div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate" title={book.author}>*/}
                                        {/*    {book.author}*/}
                                        {/*</div>*/}
                                    </div>

                                    <div className="flex items-center justify-center space-x-2 pt-2 border-t border-gray-100 dark:border-gray-700 w-full">
                                        <img
                                            src={book.user?.avatar ? `${BASE_URL}/${book.user.avatar}` : '/images/placeholder-book.png'}
                                            alt={t.language === 'en' ? "Contributor's avatar" : 'រូបភាពអ្នកបរិច្ចាគ'}
                                            loading="lazy"
                                            className="w-6 h-6 rounded-full object-cover border border-gray-300 dark:border-gray-600 flex-shrink-0"
                                        />
                                        <span className="text-xs text-gray-400 dark:text-gray-500 truncate font-medium flex items-center min-w-0">
                            <span className="truncate flex-grow" title={contributorName}>{contributorName}</span>
                                            {isContributorVerified && (
                                                <BadgeCheck className="w-4 h-4 ml-1 text-blue-500 dark:text-blue-400 fill-white dark:fill-gray-900 flex-shrink-0" />
                                            )}
                        </span>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400 col-span-full py-12 sm:py-20 text-base sm:text-xl font-light">
                            {t.noBooksFound.replace('{type}', bookType === 'ebook' ? t.bookType.ebook : t.bookType.physical)}
                        </p>
                    )}
                </div>
                {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-4 pt-8 pb-4">
                        <Button
                            onClick={goToPreviousPage}
                            disabled={currentPage === 1}
                            variant="outline"
                            className={`flex items-center text-${accentColor}-600 dark:text-${accentColor}-400 disabled:opacity-50 text-sm sm:text-base px-3 sm:px-4 h-10 sm:h-11`}
                        >
                            <ChevronLeft className="w-4 sm:w-5 h-4 sm:h-5 mr-1" />
                            {t.previous}
                        </Button>
                        <span className="text-sm sm:text-md font-semibold text-gray-700 dark:text-gray-300">
              {t.pageOf.replace('{current}', String(currentPage)).replace('{total}', String(totalPages))}
            </span>
                        <Button
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages}
                            variant="outline"
                            className={`flex items-center text-${accentColor}-600 dark:text-${accentColor}-400 disabled:opacity-50 text-sm sm:text-base px-3 sm:px-4 h-10 sm:h-11`}
                        >
                            {t.next}
                            <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5 ml-1" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
