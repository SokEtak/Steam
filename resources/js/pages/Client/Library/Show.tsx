import { Head, Link, router } from '@inertiajs/react';
import { BookOpen, Download, Eye, Share2, LogOut, Globe } from 'lucide-react';
import { useState } from 'react';

export default function Show({ book, lang = 'en', authUser, relatedBooks = [] }) {
    // Translations object based on lang prop
    const translations = {
        en: {
            by: 'By',
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
            bookcase: 'Bookcase',
            campus: 'Campus',
            program: 'Program',
            views: 'Views',
            uploaded_by: 'Uploaded By',
            user: 'User',
            book_not_found: 'Book not found',
            logout: 'Logout',
            followers: 'Followers',
            share: 'Share',
            related_books: 'Related Books',
        },
        km: {
            by: 'ដោយ',
            available: 'មាន',
            not_available: 'មិនមាន',
            view_flipbook: 'មើលសៀវភៅត្រឡប់',
            download_pdf: 'ទាញយក PDF',
            book_details: 'ព័ត៌មានសៀវភៅ',
            publisher: 'អ្នកបោះពុម្ព',
            language: 'ភាសា',
            published_year: 'ឆ្នាំបោះពុម្ព',
            page_count: 'ចំនួនទំព័រ',
            isbn: 'ISBN',
            code: 'កូដ',
            type: 'ប្រភេទ',
            category: 'ប្រភេទ',
            bookcase: 'កន្លែងដាក់សៀវភៅ',
            campus: 'សាខា',
            program: 'កម្មវិធី',
            views: 'ចំនួនមើល',
            uploaded_by: 'បញ្ចូលដោយ',
            user: 'អ្នកប្រើប្រាស់',
            book_not_found: 'រកមិនឃើញសៀវភៅ',
            logout: 'ចេញ',
            followers: 'អ្នកតាមដាន',
            share: 'ចែករំលែក',
            related_books: 'សៀវភៅពាក់ព័ន្ធ',
        },
    };

    const t = translations[lang] || translations.en; // Fallback to English

    // State for user dropdown
    const [showUserMenu, setShowUserMenu] = useState(false);

    // Language switching handler
    const handleLanguageChange = (newLang) => {
        router.post('/change-language', { lang: newLang }, { preserveState: true });
    };

    // Share handler
    const handleShare = () => {
        const shareUrl = window.location.href;
        if (navigator.share) {
            navigator.share({
                title: book.title,
                text: book.description,
                url: shareUrl,
            });
        } else {
            navigator.clipboard.writeText(shareUrl);
            alert('URL copied to clipboard!');
        }
    };

    // Logout handler
    const handleLogout = () => {
        router.post('/logout');
    };

    if (!book) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                <p className="text-red-600 dark:text-red-400">{t.book_not_found}</p>
            </div>
        );
    }

    return (
        <>
            <Head title={book.title} />

            <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
                {/* Header */}
                <header className="bg-white dark:bg-gray-800 shadow-md py-4 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                        {/* Logo */}
                        <div className="flex items-center">
                            <img
                                src="/logo.png" // Replace with actual logo URL
                                alt="Library Logo"
                                className="h-10 w-auto"
                            />
                        </div>

                        {/* User Account & Language Dropdown */}
                        <div className="flex items-center space-x-4">
                            {/* Language Dropdown */}
                            <div className="relative">
                                <button
                                    className="flex items-center text-gray-700 dark:text-gray-300 hover:text-amber-700 dark:hover:text-amber-400"
                                    onClick={() => setShowUserMenu(false)}
                                >
                                    <Globe className="w-5 h-5 mr-2" />
                                    {lang.toUpperCase()}
                                </button>
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10">
                                    <button
                                        onClick={() => handleLanguageChange('en')}
                                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-amber-800/50 w-full text-left"
                                    >
                                        English
                                    </button>
                                    <button
                                        onClick={() => handleLanguageChange('km')}
                                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-amber-800/50 w-full text-left"
                                    >
                                        ខ្មែរ (Khmer)
                                    </button>
                                </div>
                            </div>

                            {/* User Avatar */}
                            {authUser && (
                                <div className="relative">
                                    <button
                                        onClick={() => setShowUserMenu(!showUserMenu)}
                                        className="flex items-center"
                                    >
                                        <img
                                            src={authUser.avatar || 'https://via.placeholder.com/40'}
                                            alt={authUser.name}
                                            className="h-10 w-10 rounded-full"
                                        />
                                    </button>
                                    {showUserMenu && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10">
                                            <button
                                                onClick={handleLogout}
                                                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-amber-800/50 w-full text-left flex items-center"
                                            >
                                                <LogOut className="w-4 h-4 mr-2" />
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
                <div className="py-8 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto space-y-6">
                        {/* Hero Section */}
                        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
                            <div className="flex flex-col md:flex-row">
                                <div className="md:w-1/3 p-6">
                                    <img
                                        src={book.cover}
                                        alt={book.title}
                                        className="w-full h-64 object-cover rounded-md shadow-md"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="md:w-2/3 p-6">
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                                        {book.title}
                                    </h1>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                        {t.by} {book.author}
                                    </p>
                                    <p className="text-base text-gray-700 dark:text-gray-300 mb-4">
                                        {book.description}
                                    </p>
                                    <span
                                        className={`inline-block px-3 py-1 text-sm font-semibold rounded-full mb-4 ${
    book.is_available
        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
        : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
}`}
                                    >
                                        {book.is_available ? t.available : t.not_available}
                                    </span>
                                    <div className="flex space-x-4">
                                        {book.flip_link && (
                                            <a
                                                href={book.flip_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 dark:hover:bg-amber-500 transition-colors"
                                                aria-label={t.view_flipbook}
                                            >
                                                <BookOpen className="w-5 h-5 mr-2" />
                                                {t.view_flipbook}
                                            </a>
                                        )}
                                        {/*{book.downloadable && book.pdf_url && (*/}
                                        {/*    <a*/}
                                        {/*        href={book.pdf_url}*/}
                                        {/*        target="_blank"*/}
                                        {/*        rel="noopener noreferrer"*/}
                                        {/*        className="flex items-center px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 dark:hover:bg-amber-500 transition-colors"*/}
                                        {/*        aria-label={t.download_pdf}*/}
                                        {/*    >*/}
                                        {/*        <Download className="w-5 h-5 mr-2" />*/}
                                        {/*        {t.download_pdf}*/}
                                        {/*    </a>*/}
                                        {/*)}*/}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contributor Card */}
                        {book.user && (
                            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
                                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                    {t.uploaded_by}
                                </h2>
                                <div className="flex items-center space-x-4">
                                    <img
                                        src={book.user.avatar || 'https://via.placeholder.com/40'}
                                        alt={book.user.name}
                                        className="h-12 w-12 rounded-full"
                                    />
                                    <div>
                                        <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                                            {book.user.name}
                                            {book.user.verified && (
                                                <span className="ml-2 inline-block px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 dark:text-blue-100 dark:bg-blue-800 rounded-full">
                                                    Verified
                                                </span>
                                            )}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {book.user.followers_count || 0} {t.followers}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Book Details Card */}
                        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                {t.book_details}
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        <strong>{t.publisher}:</strong> {book.publisher}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        <strong>{t.language}:</strong> {book.language.toUpperCase()}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        <strong>{t.published_year}:</strong> {book.published_at}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        <strong>{t.by}:</strong> {book.author}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* View Card */}
                        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 flex items-center space-x-4">
                            <Eye className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                            <p className="text-base text-gray-900 dark:text-gray-100">
                                {book.view} {t.views}
                            </p>
                        </div>

                        {/* Share Button Card */}
                        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
                            <button
                                onClick={handleShare}
                                className="flex items-center px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 dark:hover:bg-amber-500 transition-colors w-full justify-center"
                            >
                                <Share2 className="w-5 h-5 mr-2" />
                                {t.share}
                            </button>
                        </div>

                        {/* Related Books Section */}
                        {relatedBooks.length > 0 && (
                            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
                                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                    {t.related_books}
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {relatedBooks.map((relatedBook) => (
                                        <Link
                                            key={relatedBook.id}
                                            href={`/library/${relatedBook.id}`}
                                            className="block bg-gray-50 dark:bg-gray-700 rounded-md p-4 hover:shadow-md transition-shadow"
                                        >
                                            <img
                                                src={relatedBook.cover}
                                                alt={relatedBook.title}
                                                className="w-full h-32 object-cover rounded-md mb-2"
                                            />
                                            <p className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                                {relatedBook.title}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {relatedBook.user?.name || 'Unknown Contributor'}
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
