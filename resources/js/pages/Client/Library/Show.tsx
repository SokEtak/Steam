import { Head, Link, router } from '@inertiajs/react';
import {
    BookOpen,
    Eye,
    Share2,
    Facebook,
    Download,
    Verified,
    Clipboard,
    Info,
    User,
    List,
} from 'lucide-react';
import { useState } from 'react';
import { pdfjs } from 'react-pdf';
import TopBar from '@/components/TopBar';
import { translations } from '@/utils/translations';

// Set up worker for react-pdf with a hardcoded stable version
pdfjs.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js';

// --- Interface Definitions ---
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

// --- Utility Functions ---
const formatNumber = (number: number): string => {
    if (number >= 1000) {
        return `${(number / 1000).toFixed(1)}k`;
    }
    return number.toString();
};

const DetailItem = ({ label, value, index }: { label: string; value: string | number | undefined | null; index: number }) => {
    if (!value || value === 0) return null;

    const bgColor = index % 2 === 0
        ? 'bg-gray-50 dark:bg-gray-800'
        : 'bg-white dark:bg-gray-900/50';

    return (
        <div className={`flex justify-between items-center px-4 py-3 rounded-lg transition-colors ${bgColor}`}>
            <strong className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {label}
            </strong>
            <span className="text-base font-semibold text-gray-800 dark:text-gray-200">
                {value}
            </span>
        </div>
    );
};

// --- Main Component ---
export default function Show({ book, lang = 'en', authUser, relatedBooks = [] }: ShowProps) {
    // --- State ---
    const [language, setLanguage] = useState<'en' | 'kh'>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('language');
            if (saved === 'en' || saved === 'kh') {
                return saved as 'en' | 'kh';
            }
        }
        return lang as 'en' | 'kh';
    });

    const [activeTab, setActiveTab] = useState<'description' | 'details'>('details');
    const [showShareMenu, setShowShareMenu] = useState(false);

    // --- Handlers ---
    const handleLanguageChange = () => {
        setLanguage(language === 'en' ? 'kh' : 'en');
    };

    const handleShare = (platform: string) => {
        setShowShareMenu(false);
        const shareUrl = encodeURIComponent(window.location.href);
        const shareText = encodeURIComponent(`${book?.title} - ${translations[language].read}/${translations[language].views}.`);
        let url = '';

        switch (platform) {
            case 'facebook':
                url = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
                break;
            case 'telegram':
                url = `https://telegram.me/share/url?url=${shareUrl}&text=${shareText}`;
                break;
            case 'twitter':
                url = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`;
                break;
            case 'whatsapp':
                url = `https://wa.me/?text=${shareText}%20${shareUrl}`;
                break;
            case 'copy_link':
            default:
                navigator.clipboard.writeText(window.location.href);
                alert(translations[language].language === 'en' ? 'URL copied to clipboard!' : 'បានចម្លង URL ទៅកាន់ Clipboard!');
                return;
        }
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const handleDownload = () => { // Removed 'async' as fetch is no longer needed
        if (book?.pdf_url && book.downloadable) {
            try {
                // New logic: Use a temporary anchor tag for direct download
                const a = document.createElement('a');
                a.href = book.pdf_url;
                a.download = `${book.title}.pdf`; // Suggests a filename to the browser
                a.target = '_blank'; // Optional: Opens link in a new tab if 'download' fails

                // Append and click the anchor tag to trigger the download
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);

            } catch (error) {
                // This catch block is unlikely to be reached with this method,
                // but keep it for general safety.
                alert(translations[language].language === 'en' ? 'Failed to initiate download.' : 'មិនអាចចាប់ផ្ដើមការទាញយកបានទេ។');
                console.error(error);
            }
        } else {
            alert(translations[language].no_pdf_available);
        }
    };

    const BASE_URL = 'https://fls-9fd96a88-703c-423b-a3c6-5b74b203b091.laravel.cloud';

    if (!book) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                <p className="text-red-600 dark:text-red-400 text-xl font-semibold tracking-tight">
                    {translations[language].book_not_found}
                </p>
            </div>
        );
    }

    // --- Render Functions ---
    const renderContributorSection = () => {
        if (!book.user) return null;
        const contributorUrl = book.user_id ? `/users/${book.user_id}` : '#';

        return (
            <Link
                href={contributorUrl}
                className="flex items-center space-x-3 p-3 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors group"
            >
                <img
                    src={book.user.avatar ? book.user.avatar : 'https://via.placeholder.com/40'}
                    alt={book.user.name}
                    className="h-10 w-10 rounded-full object-cover border-2 border-amber-500 shadow-sm"
                />
                <div className='flex-1 min-w-0'>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center truncate">
                        {book.user.name}
                        {(book.user.isVerified || book.user.verified) && (
                            <Verified className="ml-1 w-3 h-3 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                        )}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {translations[language].contributor}
                    </p>
                </div>
            </Link>
        );
    };

    const renderDetailsContent = () => {
        let index = 0;

        const standardDetails = (
            <>
                <DetailItem label={translations[language].publisher} value={book.publisher || translations[language].unknown} index={index++} />
                <DetailItem label={translations[language].published_year} value={book.published_at || translations[language].unknown} index={index++} />
                <DetailItem label={translations[language].language} value={book.language || translations[language].unknown} index={index++} />
                <DetailItem label={translations[language].by} value={book.author || translations[language].unknown} index={index++} />
                <DetailItem
                    label={translations[language].type}
                    value={book.type === 'ebook' ? translations[language].bookType.ebook : translations[language].bookType.physical}
                    index={index++}
                />
            </>
        );

        const categoryDetails = (
            <>
                <DetailItem label={translations[language].category} value={book.category?.name} index={index++} />
                <DetailItem label={translations[language].subcategory} value={book.subcategory?.name} index={index++} />
                <DetailItem label={translations[language].subject} value={book.subject?.name} index={index++} />
                <DetailItem label={translations[language].grade} value={book.grade?.name} index={index++} />
            </>
        );

        let conditionalDetails = null;
        if (book.type === 'ebook') {
            conditionalDetails = (
                <>
                    <DetailItem label={translations[language].page_count} value={book.page_count} index={index++} />
                    <DetailItem label={translations[language].isbn} value={book.isbn} index={index++} />
                    <DetailItem label={translations[language].code} value={book.code} index={index++} />
                </>
            );
        } else if (book.type === 'physical') {
            conditionalDetails = (
                <>
                    <DetailItem label={translations[language].campus} value={book.campus?.name} index={index++} />
                    <DetailItem label={translations[language].program} value={book.program} index={index++} />
                    <DetailItem label={translations[language].bookcase} value={book.bookcase?.code} index={index++} />
                    <DetailItem label={translations[language].shelf} value={book.shelf?.code} index={index++} />
                    <DetailItem label={translations[language].isbn} value={book.isbn} index={index++} />
                    <DetailItem label={translations[language].code} value={book.code} index={index++} />
                </>
            );
        }

        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">{standardDetails}</div>
                    <div className="space-y-2">{categoryDetails}</div>
                </div>
                {conditionalDetails && (
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                        <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
                            {book.type === 'ebook' ? translations[language].ebook_details : translations[language].physical_details}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2 col-span-2 sm:col-span-1">{conditionalDetails}</div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // --- Component Structure ---
    return (
        <>
            <Head title={book.title} />
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
                <TopBar
                    authUser={authUser}
                    language={language}
                    onLanguageChange={handleLanguageChange}
                />

                <main className="py-10 px-4 sm:px-6 lg:px-8 flex justify-center">
                    <div className="max-w-7xl w-full space-y-10">

                        {/* Title and Utility Header Section */}
                        <header className="space-y-4">
                            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-gray-100 leading-tight">
                                {book.title}
                            </h1>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white dark:bg-gray-800 shadow-lg rounded-xl p-3 border border-gray-200 dark:border-gray-700">
                                {renderContributorSection()}

                                {/* Views and Share Row */}
                                <div className="flex items-center space-x-6 pr-3 pt-3 sm:pt-0">
                                    {/* Views Count */}
                                    <div className="flex items-center space-x-1.5">
                                        <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        <p className="text-base text-gray-900 dark:text-gray-100 font-bold">
                                            {formatNumber(book.view)}
                                        </p>
                                        <span className="text-sm text-gray-500 dark:text-gray-400 hidden lg:inline">{translations[language].views}</span>
                                    </div>

                                    {/* Share Menu */}
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowShareMenu(!showShareMenu)}
                                            className="flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 dark:hover:bg-amber-400 transition-colors shadow-md text-sm font-semibold"
                                            aria-label={translations[language].share}
                                        >
                                            <Share2 className="w-4 h-4 mr-2" />
                                            {translations[language].share}
                                        </button>
                                        {showShareMenu && (
                                            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-xl shadow-2xl py-2 z-20 border border-gray-200 dark:border-gray-700">
                                                {[
                                                    { platform: 'facebook', icon: Facebook, label: translations[language].share_facebook, color: 'text-blue-600' },
                                                    { platform: 'telegram', icon: Clipboard, label: translations[language].share_telegram, color: 'text-blue-400' },
                                                    { platform: 'twitter', icon: Clipboard, label: translations[language].share_twitter, color: 'text-sky-500' },
                                                    { platform: 'whatsapp', icon: Clipboard, label: translations[language].share_whatsapp, color: 'text-green-500' },
                                                    { platform: 'copy_link', icon: Clipboard, label: translations[language].copy_link || 'Copy Link', color: 'text-gray-500' }
                                                ].map(({ platform, icon: Icon, label, color }) => (
                                                    <button
                                                        key={platform}
                                                        onClick={() => handleShare(platform)}
                                                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left transition-colors font-medium"
                                                        aria-label={label}
                                                    >
                                                        <Icon className={`w-5 h-5 mr-3 inline ${color}`} />
                                                        {label}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </header>

                        {/* Main Content: Layout Swap Applied */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                            {/* Column 1 (LEFT, Fluid Width): Tabbed Details */}
                            <div className="lg:col-span-2 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700 order-last lg:order-first">
                                {/* Tab Navigation */}
                                <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
                                    <button
                                        onClick={() => setActiveTab('details')}
                                        className={`flex items-center px-4 py-2 text-lg font-semibold transition-colors ${
                                            activeTab === 'details'
                                                ? 'text-amber-600 dark:text-amber-400 border-b-2 border-amber-600 dark:border-amber-400'
                                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                        }`}
                                    >
                                        <List className="w-5 h-5 mr-2" />
                                        {translations[language].book_details}
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('description')}
                                        className={`flex items-center px-4 py-2 text-lg font-semibold transition-colors ${
                                            activeTab === 'description'
                                                ? 'text-amber-600 dark:text-amber-400 border-b-2 border-amber-600 dark:border-amber-400'
                                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                        }`}
                                    >
                                        <Info className="w-5 h-5 mr-2" />
                                        {translations[language].description}
                                    </button>
                                </div>

                                {/* Tab Content */}
                                <div className="min-h-[300px]">
                                    {activeTab === 'description' && (
                                        <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                                            {book.description}
                                        </p>
                                    )}

                                    {activeTab === 'details' && (
                                        renderDetailsContent()
                                    )}
                                </div>
                            </div>

                            {/* Column 2 (RIGHT, Fixed Width): Cover and Actions */}
                            <div className="lg:col-span-1 space-y-6 order-first lg:order-last lg:sticky lg:top-10 self-start">
                                {/* Book Cover */}
                                <div className="p-0 flex flex-col items-center">
                                    <img
                                        src={book.cover}
                                        alt={book.title}
                                        className="w-full max-w-xs h-auto object-fill rounded-xl shadow-xl transition-all duration-300 hover:scale-[1.02] "
                                        style={{ aspectRatio: '3/4' }}
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col gap-4 w-full max-w-xs mx-auto lg:max-w-none">
                                    {book.flip_link && (
                                        <a
                                            href={book.flip_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-lg font-bold shadow-lg shadow-amber-600/40 transform hover:scale-[1.01]"
                                            aria-label={translations[language].view_flipbook}
                                        >
                                            <BookOpen className="w-5 h-5 mr-3" />
                                            {translations[language].view_flipbook}
                                        </a>
                                    )}
                                    {book.pdf_url && book.downloadable && (
                                        <button
                                            onClick={handleDownload}
                                            className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-bold shadow-lg shadow-blue-600/40 transform hover:scale-[1.01]"
                                            aria-label={translations[language].download_pdf}
                                        >
                                            <Download className="w-5 h-5 mr-3" />
                                            {translations[language].download_pdf}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Related Books Section */}
                        {relatedBooks.length > 0 && (
                            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 border-b pb-3 border-gray-200 dark:border-gray-700">
                                    {translations[language].related_books}
                                </h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-6">
                                    {relatedBooks.slice(0, 10).map((relatedBook) => (
                                        <Link
                                            key={relatedBook.id}
                                            href={`/library/${relatedBook.id}`}
                                            className="flex flex-col items-center p-3 rounded-lg transition-all transform hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 group"
                                            aria-label={`View ${relatedBook.title}`}
                                        >
                                            <img
                                                src={relatedBook.cover}
                                                alt={relatedBook.title}
                                                className="w-full h-auto object-cover rounded-md shadow-md transition duration-400 ease-in-out transform group-hover:scale-[1.03]"
                                                style={{ aspectRatio: '3/4', maxWidth: '140px' }}
                                            />
                                            <div className="mt-3 text-center w-full">
                                                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 leading-tight">
                                                    {relatedBook.title}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-1 font-medium">
                                                    {relatedBook.user?.name || relatedBook.author || translations[language].unknown}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}
