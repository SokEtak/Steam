import { Head, Link, router } from '@inertiajs/react';
import {
    BookOpen,
    Eye,
    Share2,
    LogOut,
    Globe,
    Facebook,
    Twitter,
    MessageCircle,
    Share,
    Download,
    ChevronLeft,
    ChevronRight,
    Verified
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Set up worker for react-pdf with a hardcoded stable version
pdfjs.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js';

// Define TypeScript interface for props
interface Book {
    id?: number;
    title: string;
    description: string;
    page_count?: number;
    publisher: string;
    language: string;
    published_at: string;
    cover: string;
    pdf_url?: string;
    flip_link?: string;
    view: number;
    is_available: boolean;
    author: string;
    code?: string;
    isbn?: string;
    type?: string;
    downloadable?: boolean;
    user_id?: number;
    category_id?: number;
    subcategory_id?: number;
    shelf_id?: number;
    subject_id?: number;
    grade_id?: number;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
    bookcase_id?: number;
    campus_id?: number;
    program?: string;
    user?: {
        name: string;
        avatar?: string;
        follower: number;
        verified: boolean;
        isVerified?: boolean;
    };
    category?: { name: string };
    subcategory?: { name: string };
    shelf?: { code: string };
    subject?: { name: string };
    grade?: { name: string };
    bookcase?: { code: string };
    campus?: { name: string };
}

interface AuthUser {
    name: string;
    email: string;
    avatar?: string;
    isVerified?: boolean;
}

interface ShowProps {
    book: Book | null;
    lang?: 'en' | 'kh';
    authUser?: AuthUser | null;
    relatedBooks?: Book[];
}

// Utility function to format number (followers or views)
const formatNumber = (number: number): string => {
    if (number >= 1000) {
        return `${(number / 1000).toFixed(1)}k`;
    }
    return number.toString();
};

export default function Show({ book, lang = 'en', authUser, relatedBooks = [] }: ShowProps) {
    // Translations object based on lang prop
    const translations = {
        en: {
            by: 'Author',
            available: 'Available',
            not_available: 'Not Available',
            view_flipbook: 'Read',
            download_pdf: 'Download PDF',
            book_details: 'Book Details',
            publisher: 'Publisher',
            language: 'Language',
            published_year: 'Published Year',
            page_count: 'Page Count',
            isbn: 'ISBN',
            code: 'Code',
            type: 'Type',
            category: 'Category',
            subcategory: 'Subcategory',
            shelf: 'Shelf',
            subject: 'Subject',
            grade: 'Grade',
            bookcase: 'Bookcase',
            campus: 'Campus',
            program: 'Program',
            views: 'Views',
            uploaded_by: 'Uploaded By',
            user: 'User',
            book_not_found: 'Book not found',
            no_pdf_available: 'No PDF available',
            no_flipbook_available: 'No flipbook available',
            logout: 'Logout',
            followers: 'Followers',
            share: 'Share',
            related_books: 'Related Books',
            switch_language: 'Switch to Khmer',
            share_facebook: 'Share on Facebook',
            share_telegram: 'Share on Telegram',
            share_twitter: 'Share on Twitter',
            share_whatsapp: 'Share on WhatsApp',
            previous_page: 'Previous Page',
            next_page: 'Next Page',
            page: 'Page',
            of: 'of',
            unknown: 'Unknown',
            loading_pdf: 'Loading PDF...',
        },
        kh: {
            by: 'អ្នកនិពន្ធ',
            available: 'មាន',
            not_available: 'មិនមាន',
            view_flipbook: 'អាន',
            download_pdf: 'ទាញយក',
            book_details: 'អំពីសៀវភៅ',
            publisher: 'បោះពុម្ពផ្សាយ',
            language: 'ភាសា',
            published_year: 'ឆ្នាំបោះពុម្ព',
            page_count: 'ចំនួនទំព័រ',
            isbn: 'ISBN',
            code: 'កូដ',
            type: 'ប្រភេទសៀវភៅ',
            category: 'ប្រភេទ',
            subcategory: 'ប្រភេទរង',
            shelf: 'ធ្នើរ',
            subject: 'មុខវិជ្ជា',
            grade: 'ថ្នាក់',
            bookcase: 'ទូរសៀវភៅ',
            campus: 'សាខា',
            program: 'កម្មវិធី',
            views: 'ចំនួនមើល',
            uploaded_by: 'បញ្ចូលដោយ',
            user: 'អ្នកប្រើប្រាស់',
            book_not_found: 'រកមិនឃើញសៀវភៅ',
            no_pdf_available: 'គ្មាន PDF ទេ',
            no_flipbook_available: 'គ្មានតំណសម្រាប់សៀវភៅឌីជីថលទេ',
            logout: 'ចេញ',
            followers: 'អ្នកតាមដាន',
            share: 'ចែករំលែក',
            related_books: 'សៀវភៅពាក់ព័ន្ធ',
            switch_language: 'ប្តូរទៅភាសាអង់គ្លេស',
            share_facebook: 'ចែករំលែកលើ Facebook',
            share_telegram: 'ចែករំលែកលើ Telegram',
            share_twitter: 'ចែករំលែកលើ Twitter',
            share_whatsapp: 'ចែករំលែកលើ WhatsApp',
            previous_page: 'ទំព័រមុន',
            next_page: 'ទំព័របន្ទាប់',
            page: 'ទំព័រ',
            of: 'នៃ',
            unknown: 'មិនស្គាល់',
            loading_pdf: 'កំពុងផ្ទុក PDF...',
        },
    };

    // Initialize language state with lang prop and persist in localStorage
    const [language, setLanguage] = useState<'en' | 'kh'>(() => {
        const savedLanguage = typeof window !== 'undefined' ? localStorage.getItem('language') : null;
        return (savedLanguage === 'en' || savedLanguage === 'kh' ? savedLanguage : lang) as 'en' | 'kh';
    });

    // Save language to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);

    // Use translations based on language state
    const t = translations[language] || translations.en; // Fallback to English

    // State for user dropdown, share dropdown, and email tooltip
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [showEmailTooltip, setShowEmailTooltip] = useState(false);

    // PDF viewer states
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [pdfError, setPdfError] = useState<string | null>(null);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        console.log("PDF loaded successfully", numPages);
        setNumPages(numPages);
        setLoading(false);
    };

    const onDocumentLoadError = (error: Error) => {
        console.log("PDF loaded unsuccessfully", error.message);
        setPdfError(t.no_pdf_available);
        setLoading(false);
    };

    const goToPrevPage = () => setPageNumber((prev) => Math.max(prev - 1, 1));
    const goToNextPage = () => setPageNumber((prev) => Math.min(prev + 1, numPages));

    // Language switching handler
    const handleLanguageChange = () => {
        const newLang = language === 'en' ? 'kh' : 'en';
        setLanguage(newLang);
        setShowUserMenu(false);
    };

    // Share handler for social platforms
    const handleShare = (platform: string) => {
        setShowShareMenu(false);
        const shareUrl = encodeURIComponent(window.location.href);
        const shareText = encodeURIComponent(`${book?.title} - ${book?.description}`);
        let url = '';

        switch (platform) {
            case 'facebook':
                url = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
                break;
            case 'telegram':
                url = `https://t.me/share/url?url=${shareUrl}&text=${shareText}`;
                break;
            case 'twitter':
                url = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`;
                break;
            case 'whatsapp':
                url = `https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`;
                break;
            default:
                if (navigator.share) {
                    navigator.share({
                        title: book?.title,
                        text: book?.description,
                        url: window.location.href,
                    });
                    return;
                } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert(t.language === 'en' ? 'URL copied to clipboard!' : 'បានចម្លង URL ទៅកាន់ Clipboard!');
                    return;
                }
        }

        window.open(url, '_blank', 'noopener,noreferrer');
    };

    // Download handler
    const handleDownload = () => {
        if (book?.pdf_url && book.downloadable) {
            window.open(book.pdf_url, '_blank');
        } else {
            alert(t.no_pdf_available);
        }
    };

    // Logout handler
    const handleLogout = () => {
        setShowUserMenu(false);
        router.post('/logout');
    };

    if (!book) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
                <p className="text-red-600 dark:text-red-400 text-xl font-semibold tracking-tight">{t.book_not_found}</p>
            </div>
        );
    }

    // Conditional content based on type (ebook, physical)
    const renderConditionalContent = () => {
        if (!book.type) return null;
        const conditionalFields = (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                {book.type === 'ebook' && (
                    <>
                        {book.page_count && (
                            <p className="text-base text-gray-600 dark:text-gray-400">
                                <strong className="font-semibold">{t.page_count}:</strong> {book.page_count}
                            </p>
                        )}
                        {book.isbn && (
                            <p className="text-base text-gray-600 dark:text-gray-400">
                                <strong className="font-semibold">{t.isbn}:</strong> {book.isbn}
                            </p>
                        )}
                        {book.code && (
                            <p className="text-base text-gray-600 dark:text-gray-400">
                                <strong className="font-semibold">{t.code}:</strong> {book.code}
                            </p>
                        )}
                    </>
                )}
                {book.type === 'physical' && (
                    <>
                        {book.bookcase?.code && (
                            <p className="text-base text-gray-600 dark:text-gray-400">
                                <strong className="font-semibold">{t.bookcase}:</strong> {book.bookcase.code}
                            </p>
                        )}
                        {book.shelf?.code && (
                            <p className="text-base text-gray-600 dark:text-gray-400">
                                <strong className="font-semibold">{t.shelf}:</strong> {book.shelf.code}
                            </p>
                        )}
                        {book.campus?.name && (
                            <p className="text-base text-gray-600 dark:text-gray-400">
                                <strong className="font-semibold">{t.campus}:</strong> {book.campus.name}
                            </p>
                        )}
                        {book.program && (
                            <p className="text-base text-gray-600 dark:text-gray-400">
                                <strong className="font-semibold">{t.program}:</strong> {book.program}
                            </p>
                        )}
                        {book.isbn && (
                            <p className="text-base text-gray-600 dark:text-gray-400">
                                <strong className="font-semibold">{t.isbn}:</strong> {book.isbn}
                            </p>
                        )}
                        {book.code && (
                            <p className="text-base text-gray-600 dark:text-gray-400">
                                <strong className="font-semibold">{t.code}:</strong> {book.code}
                            </p>
                        )}
                    </>
                )}
            </div>
        );
        return conditionalFields;
    };

    return (
        <>
            <Head title={book.title} />

            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800">
                {/* Header */}
                <header className="bg-white dark:bg-gray-800 shadow-lg py-4 px-4 sm:px-6 lg:px-8 sticky top-0 z-50">
                    <div className="max-w-[1440px] mx-auto flex justify-between items-center">
                        {/* Logo */}
                        <div className="flex items-center">
                            <a href="/" className="flex items-center">
                                <img
                                    src="/images/DIS(no%20back).png"
                                    alt="Library Logo"
                                    className="h-14 w-auto transition-transform hover:scale-105"
                                />
                            </a>
                        </div>

                        {/* User Account & Language Switch */}
                        <div className="flex items-center space-x-6">
                            <button
                                onClick={handleLanguageChange}
                                className="flex items-center text-gray-700 dark:text-gray-200 hover:text-amber-600 dark:hover:text-amber-400 transition-colors text-base font-medium"
                                aria-label={t.switch_language}
                            >
                                <Globe className="w-6 h-6 mr-2" />
                                {t.switch_language}
                            </button>
                            {authUser && (
                                <div className="relative">
                                    <button
                                        onClick={() => setShowUserMenu(!showUserMenu)}
                                        onMouseEnter={() => setShowEmailTooltip(true)}
                                        onMouseLeave={() => setShowEmailTooltip(false)}
                                        className="flex items-center"
                                        aria-label={`${authUser.name}'s profile`}
                                    >
                                        <img
                                            src={"https://fls-9fd96a88-703c-423b-a3c6-5b74b203b091.laravel.cloud/"+authUser.avatar || 'https://via.placeholder.com/40'}
                                            alt={authUser.name}
                                            className="h-12 w-12 rounded-full border-2 border-amber-500 hover:scale-105 transition-transform"
                                        />
                                    </button>
                                    {showEmailTooltip && (
                                        <div className="absolute right-0 top-[50px] bg-gray-800 text-white text-sm px-3 py-1 rounded-lg shadow-lg z-20">
                                            {authUser.email}
                                        </div>
                                    )}
                                    {showUserMenu && (
                                        <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl py-2 z-20 border border-gray-200 dark:border-gray-700">
                                            <button
                                                onClick={handleLogout}
                                                className="block px-5 py-3 text-base text-gray-700 dark:text-gray-200 hover:bg-amber-100 dark:hover:bg-amber-900/30 w-full text-left flex items-center transition-colors font-medium"
                                                aria-label={t.logout}
                                            >
                                                <LogOut className="w-5 h-5 mr-3" />
                                                {t.logout}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="py-10 px-4 sm:px-6 lg:px-8 flex justify-center">
                    <div className="max-w-[960px] w-full">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left Column: Contributor, About Book, Views/Share, Related Books */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* Contributor Card */}
                                {book.user && (
                                    <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 transform transition-all hover:shadow-3xl">
                                        <div className="flex items-center space-x-5">
                                            <img
                                                src={"https://fls-9fd96a88-703c-423b-a3c6-5b74b203b091.laravel.cloud/"+ book.user.avatar || 'https://via.placeholder.com/40'}
                                                alt={book.user.name}
                                                className="h-14 w-14 rounded-full border-2 border-amber-500 hover:scale-105 transition-transform"
                                            />
                                            <div>
                                                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                                                    {book.user.name}
                                                    {(book.user.isVerified) && (
                                                        <Verified className="ml-2 my-1 text-blue-600 dark:text-blue-400" />
                                                    )}
                                                </p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {formatNumber(book.user.follower || 0)} {t.followers}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* About Book Card */}
                                <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 transform transition-all hover:shadow-3xl">
                                    <div>
                                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4 tracking-tight">
                                            {t.book_details}
                                        </h2>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <p className="text-base text-gray-600 dark:text-gray-400">
                                                    <strong className="font-semibold">{t.publisher}:</strong> {book.publisher || t.unknown}
                                                </p>
                                                <p className="text-base text-gray-600 dark:text-gray-400">
                                                    <strong className="font-semibold">{t.published_year}:</strong> {book.published_at || t.unknown}
                                                </p>
                                                <p className="text-base text-gray-600 dark:text-gray-400">
                                                    <strong className="font-semibold">{t.language}:</strong> {book.language || t.unknown}
                                                </p>
                                                {book.category?.name && (
                                                    <p className="text-base text-gray-600 dark:text-gray-400">
                                                        <strong className="font-semibold">{t.category}:</strong> {book.category.name}
                                                    </p>
                                                )}
                                                {book.subcategory?.name && (
                                                    <p className="text-base text-gray-600 dark:text-gray-400">
                                                        <strong className="font-semibold">{t.subcategory}:</strong> {book.subcategory.name}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="space-y-3">
                                                <p className="text-base text-gray-600 dark:text-gray-400">
                                                    <strong className="font-semibold">{t.by}:</strong> {book.author || t.unknown}
                                                </p>
                                                <p className="text-base text-gray-600 dark:text-gray-400">
                                                    <strong className="font-semibold">{t.type}:</strong> {book.type === "ebook" ? t.language === 'kh' ? "សៀវភៅអេឡិចត្រូនិច" : "eBook" : t.language === 'kh' ? "សៀវភៅ" : "Physical Book"}
                                                </p>
                                                {book.subject?.name && (
                                                    <p className="text-base text-gray-600 dark:text-gray-400">
                                                        <strong className="font-semibold">{t.subject}:</strong> {book.subject.name}
                                                    </p>
                                                )}
                                                {book.grade?.name && (
                                                    <p className="text-base text-gray-600 dark:text-gray-400">
                                                        <strong className="font-semibold">{t.grade}:</strong> {book.grade.name}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        {/* Conditional content based on type */}
                                        {renderConditionalContent()}

                                        <div className="flex flex-wrap gap-4 mt-3">
                                            {book.flip_link && (
                                                <a
                                                    href={book.flip_link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center px-5 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 dark:hover:bg-amber-500 transition-colors text-base font-semibold"
                                                    aria-label={t.view_flipbook}
                                                >
                                                    <BookOpen className="w-6 h-6 mr-2" />
                                                    {t.view_flipbook}
                                                </a>
                                            )}
                                            {book.pdf_url && book.downloadable && (
                                                <button
                                                    onClick={handleDownload}
                                                    className="flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors text-base font-semibold"
                                                    aria-label={t.download_pdf}
                                                >
                                                    <Download className="w-6 h-6 mr-2" />
                                                    {t.download_pdf}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Views and Share Card */}
                                <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 transform transition-all hover:shadow-3xl">
                                    <div className="space-y-6">
                                        <div className="flex items-center space-x-4">
                                            <Eye className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                                            <p className="text-lg text-gray-900 dark:text-gray-100 font-medium">
                                                {formatNumber(book.view)} {t.views}
                                            </p>
                                        </div>
                                        <div className="relative">
                                            <button
                                                onClick={() => setShowShareMenu(!showShareMenu)}
                                                className="flex items-center px-5 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 dark:hover:bg-amber-500 transition-colors w-full justify-center text-base font-semibold"
                                                aria-label={t.share}
                                            >
                                                <Share2 className="w-6 h-6 mr-2" />
                                                {t.share}
                                            </button>
                                            {showShareMenu && (
                                                <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl py-2 z-20 border border-gray-200 dark:border-gray-700">
                                                    <button
                                                        onClick={() => handleShare('facebook')}
                                                        className="block px-5 py-3 text-base text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900/30 w-full text-left transition-colors font-medium"
                                                        aria-label={t.share_facebook}
                                                    >
                                                        <Facebook className="w-5 h-5 mr-3 inline" />
                                                        {t.share_facebook}
                                                    </button>
                                                    <button
                                                        onClick={() => handleShare('telegram')}
                                                        className="block px-5 py-3 text-base text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900/30 w-full text-left transition-colors font-medium"
                                                        aria-label={t.share_telegram}
                                                    >
                                                        <MessageCircle className="w-5 h-5 mr-3 inline" />
                                                        {t.share_telegram}
                                                    </button>
                                                    <button
                                                        onClick={() => handleShare('twitter')}
                                                        className="block px-5 py-3 text-base text-gray-700 dark:text-gray-200 hover:bg-black/10 dark:hover:bg-gray-700/30 w-full text-left transition-colors font-medium"
                                                        aria-label={t.share_twitter}
                                                    >
                                                        <Twitter className="w-5 h-5 mr-3 inline" />
                                                        {t.share_twitter}
                                                    </button>
                                                    <button
                                                        onClick={() => handleShare('whatsapp')}
                                                        className="block px-5 py-3 text-base text-gray-700 dark:text-gray-200 hover:bg-green-100 dark:hover:bg-green-900/30 w-full text-left transition-colors font-medium"
                                                        aria-label={t.share_whatsapp}
                                                    >
                                                        <MessageCircle className="w-5 h-5 mr-3 inline" />
                                                        {t.share_whatsapp}
                                                    </button>
                                                    <button
                                                        onClick={() => handleShare('default')}
                                                        className="block px-5 py-3 text-base text-gray-700 dark:text-gray-200 hover:bg-amber-100 dark:hover:bg-amber-900/30 w-full text-left transition-colors font-medium"
                                                        aria-label={t.share}
                                                    >
                                                        <Share className="w-5 h-5 mr-3 inline" />
                                                        {t.share}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Related Books Card */}
                                {relatedBooks.length > 0 && (
                                    <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 transform transition-all hover:shadow-3xl min-h-[600px]">
                                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6 tracking-tight">
                                            {t.related_books}
                                        </h2>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                                            {relatedBooks.map((relatedBook) => (
                                                <Link
                                                    key={relatedBook.id}
                                                    href={`/library/${relatedBook.id}`}
                                                    className="flex flex-col items-center hover:shadow-xl transition-all transform hover:-translate-y-1 bg-gray-50 dark:bg-gray-700 rounded-xl p-4"
                                                    aria-label={`View ${relatedBook.title}`}
                                                >
                                                    <img
                                                        src={relatedBook.cover}
                                                        alt={relatedBook.title}
                                                        className="w-32 h-[179.2px] object-cover rounded-lg shadow-md"
                                                    />
                                                    <div className="mt-2 text-center">
                                                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 leading-tight">
                                                            {relatedBook.title}
                                                        </p>
                                                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1 mt-1">
                                                            {relatedBook.user?.name || t.unknown}
                                                        </p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
