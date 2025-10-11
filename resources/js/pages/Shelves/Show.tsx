"use client";

import { useState, useEffect } from "react";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head, Link, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2Icon, Pencil, ArrowLeft, X } from "lucide-react";

interface Book {
    id: number;
    title: string;
    code: string;
    is_available: boolean;
}

interface Bookcase {
    id: number;
    code: string;
}

interface Shelf {
    id: number;
    code: string;
    bookcase: Bookcase | null;
    books: Book[];
}

interface ShelvesShowProps {
    shelf: Shelf;
    flash: {
        message: string | null;
    };
    lang?: "kh" | "en";
}

const translations = {
    kh: {
        title: "ព័ត៌មានលម្អិតនៃធ្នើរសៀវភៅ",
        notification: "ការជូនដំណឹង",
        id: "លេខសម្គាល់",
        code: "លេខកូដ",
        bookcase: "ទូសៀវភៅ",
        bookcaseTooltip: "មើលព័ត៌មានលម្អិតនៃទូសៀវភៅ",
        none: "គ្មាន",
        booksInShelf: "សៀវភៅនៅក្នុងធ្នើរសៀវភៅ",
        bookCount: (count: number) => `${count} សៀវភៅ${count === 1 ? "" : ""}`,
        noBooks: "គ្មានសៀវភៅនៅក្នុងធ្នើរសៀវភៅនេះទេ។",
        bookTooltip: "មើលព័ត៌មានសៀវភៅនេះ",
        edit: "កែសម្រួល",
        editTooltip: "កែសម្រួលធ្នើរសៀវភៅនេះ",
        back: "ត្រឡប់",
        backTooltip: "ត្រឡប់ទៅបញ្ជីធ្នើរសៀវភៅ",
        na: "គ្មាន",
    },
    en: {
        title: "Shelf Details",
        notification: "Notification",
        id: "ID",
        code: "Code",
        bookcase: "Bookcase",
        bookcaseTooltip: "View bookcase details",
        none: "None",
        booksInShelf: "Books in This Shelf",
        bookCount: (count: number) => `${count} Book${count === 1 ? "" : "s"}`,
        noBooks: "No books in this shelf.",
        bookTooltip: "View this book information",
        edit: "Edit",
        editTooltip: "Edit this shelf",
        back: "Back",
        backTooltip: "Return to the shelves list",
        na: "N/A",
    },
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "ធ្នើរសៀវភៅ",
        href: route("shelves.index"),
    },
    {
        title: "ព័ត៌មានលម្អិត",
        href: "",
    },
];

export default function ShelvesShow({ shelf, flash, lang = "kh" }: ShelvesShowProps) {
    const t = translations[lang];
    const { processing } = useForm();
    const [showAlert, setShowAlert] = useState(!!flash.message);

    useEffect(() => {
        if (flash.message) {
            setShowAlert(true);
            const timer = setTimeout(() => setShowAlert(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash.message]);

    const handleCloseAlert = () => setShowAlert(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t.title}: ${shelf.code || t.na}`} />
            <div className="min-h-screen p-6 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <div className="max-w-1xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
                    <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-8">
                        {t.title}
                    </h1>
                    {showAlert && flash.message && (
                        <Alert className="mb-6 bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-700 rounded-lg">
                            <div className="flex items-start justify-between">
                                <div className="flex gap-3">
                                    <CheckCircle2Icon className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                                    <div>
                                        <AlertTitle className="text-blue-600 dark:text-blue-400 font-semibold">
                                            {t.notification}
                                        </AlertTitle>
                                        <AlertDescription className="text-blue-600 dark:text-blue-400">
                                            {flash.message}
                                        </AlertDescription>
                                    </div>
                                </div>
                                <Button
                                    onClick={handleCloseAlert}
                                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 bg-transparent hover:bg-blue-100 dark:hover:bg-blue-800/50 p-1 rounded-full"
                                    disabled={processing}
                                    aria-label="Close notification"
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                        </Alert>
                    )}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t.id}
                            </label>
                            <p
                                className="px-4 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 transition-all duration-300"
                                aria-label={`${t.id}: ${shelf.id}`}
                            >
                                {shelf.id}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t.code}
                            </label>
                            <p
                                className="px-4 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 transition-all duration-300"
                                aria-label={`${t.code}: ${shelf.code || t.na}`}
                            >
                                {shelf.code || t.na}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t.bookcase}
                            </label>
                            <p
                                className="px-4 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 transition-all duration-300"
                                aria-label={
                                    shelf.bookcase
                                        ? `${t.bookcase}: ${shelf.bookcase.code}`
                                        : `${t.bookcase}: ${t.none}`
                                }
                            >
                                {shelf.bookcase ? (
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Link
                                                    href={route("bookcases.show", { id: shelf.bookcase.id })}
                                                    className="text-indigo-600 dark:text-indigo-300 hover:text-indigo-700 dark:hover:text-indigo-400 underline transition-colors duration-200"
                                                >
                                                    {shelf.bookcase.code}
                                                </Link>
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-indigo-600 text-white rounded-lg p-2">
                                                {t.bookcaseTooltip}
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                ) : (
                                    <span className="text-gray-500 dark:text-gray-400">{t.none}</span>
                                )}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t.booksInShelf}
                            </label>
                            <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                <CardContent className="max-h-64 overflow-y-auto p-4">
                                    <h3 className="text-sm font-semibold text-indigo-600 dark:text-indigo-300 mb-2">
                                        {t.bookCount(shelf.books?.length || 0)}
                                    </h3>
                                    {shelf.books && shelf.books.length > 0 ? (
                                        <ol className="list-decimal list-inside text-sm text-gray-700 dark:text-gray-200 space-y-1">
                                            {shelf.books.map((book) => (
                                                <li key={book.id} className="whitespace-nowrap">
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Link
                                                                    href={route("books.show", { book: book.id })}
                                                                    className="text-indigo-600 dark:text-indigo-300 hover:text-indigo-700 dark:hover:text-indigo-400 underline transition-colors duration-200"
                                                                    aria-label={`View book ${book.title}`}
                                                                >
                                                                    {book.title}
                                                                </Link>
                                                            </TooltipTrigger>
                                                            <TooltipContent className="bg-indigo-600 text-white rounded-lg p-2">
                                                                {t.bookTooltip}
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                    <span
                                                        className={`ml-2 ${
                                                            book.is_available
                                                                ? "text-green-600 dark:text-green-400"
                                                                : "text-red-600 dark:text-red-400"
                                                        }`}
                                                    >
                                                        (Code: {book.code})
                                                    </span>
                                                </li>
                                            ))}
                                        </ol>
                                    ) : (
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                            {t.noBooks}
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                    <div className="flex gap-4 mt-8">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link href={route("shelves.edit", shelf.id)}>
                                        <Button
                                            className="bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 px-6 py-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                                            disabled={processing}
                                            aria-label="Edit shelf"
                                        >
                                            <Pencil className="h-4 w-4 mr-2" />
                                            {t.edit}
                                        </Button>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent className="bg-indigo-600 text-white rounded-lg p-2">
                                    {t.editTooltip}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link href={route("shelves.index")}>
                                        <Button
                                            variant="outline"
                                            className="bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 border-gray-300 dark:border-gray-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 px-6 py-2 rounded-lg transition-all duration-300 ease-in-out"
                                            disabled={processing}
                                            aria-label="Return to shelves list"
                                        >
                                            <ArrowLeft className="h-4 w-4 mr-2" />
                                            {t.back}
                                        </Button>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent className="bg-indigo-600 text-white rounded-lg p-2">
                                    {t.backTooltip}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
