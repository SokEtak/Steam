"use client";

import { useState, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";
import {
    CheckCircle2Icon,
    Pencil,
    ArrowLeft,
    X,
} from "lucide-react";

interface Book {
    id: number;
    title: string;
    code: string;
    is_available: boolean;
}

interface Bookcase {
    id: number;
    code: string;
    total_books_count: number;
    active_books_count: number;
    books: Book[];
}

interface BookcasesShowProps {
    bookcase: Bookcase;
    flash: {
        message: string | null;
    };
}

const commonStyles = {
    button: "rounded-lg text-sm transition-colors",
    text: "text-gray-800 dark:text-gray-100 text-sm",
    indigoButton:
        "bg-indigo-500 text-white hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700",
    outlineButton:
        "bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 border-indigo-200 dark:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-800",
    gradientBg: "bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-indigo-900",
    tooltipBg: "bg-gradient-to-br from-blue-900 to-indigo-600 text-white rounded-xl",
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Bookcases",
        href: route("bookcases.index"),
    },
    {
        title: "Show",
        href: "",
    },
];

export default function BookcasesShow({ bookcase, flash }: BookcasesShowProps) {
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
            <Head title={`Bookcase: ${bookcase.code || "Details"}`} />
            <TooltipProvider>
                <div className="p-4 sm:p-6 lg:p-5 xl:p-2">
                    {showAlert && flash.message && (
                        <Alert
                            className={`mb-4 flex items-start justify-between ${commonStyles.gradientBg} border-indigo-200 dark:border-indigo-700 rounded-xl`}
                        >
                            <div className="flex gap-2">
                                <CheckCircle2Icon className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
                                <div>
                                    <AlertTitle className="text-indigo-600 dark:text-indigo-300 text-sm">
                                        Notification
                                    </AlertTitle>
                                    <AlertDescription className="text-gray-600 dark:text-gray-300 text-sm">
                                        {flash.message}
                                    </AlertDescription>
                                </div>
                            </div>
                            <Button
                                onClick={handleCloseAlert}
                                className={`${commonStyles.button} text-indigo-600 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-indigo-100`}
                                disabled={processing}
                                aria-label="Close notification"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </Alert>
                    )}
                    <div className={`${commonStyles.gradientBg} rounded-2xl shadow-2xl border border-indigo-200 dark:border-indigo-700 p-6`}>
                        <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-300 mb-6">
                            Bookcase Details
                        </h1>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    ID
                                </label>
                                <p
                                    className={`${commonStyles.text} px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-indigo-200 dark:border-indigo-600`}
                                    aria-label={`Bookcase ID: ${bookcase.id}`}
                                >
                                    {bookcase.id}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Code
                                </label>
                                <p
                                    className={`${commonStyles.text} px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-indigo-200 dark:border-indigo-600`}
                                    aria-label={`Code: ${bookcase.code || "N/A"}`}
                                >
                                    {bookcase.code || "N/A"}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Books in This Bookcase
                                </label>
                                <Card className="border-indigo-200 dark:border-indigo-600 bg-white dark:bg-gray-800">
                                    <CardContent className="max-h-64 overflow-y-auto px-2">
                                        <h3 className="text-sm font-semibold text-indigo-600 dark:text-indigo-300">
                                            {bookcase.books?.length || 0} Book{bookcase.books?.length === 1 ? "" : "s"}
                                        </h3>
                                        {bookcase.books && bookcase.books.length > 0 ? (
                                            <ol className="list-decimal list-inside text-base text-gray-700 dark:text-gray-200">
                                                {bookcase.books.map((book) => (
                                                    <li key={book.id} className="whitespace-nowrap">
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Link
                                                                    href={route("books.show", { book: book.id })}
                                                                    className="text-indigo-600 dark:text-indigo-300 hover:underline"
                                                                    aria-label={`View book ${book.title}`}
                                                                >
                                                                    {book.title}
                                                                </Link>
                                                            </TooltipTrigger>
                                                            <TooltipContent className={commonStyles.tooltipBg}>
                                                                View this book information
                                                            </TooltipContent>
                                                        </Tooltip>
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
                                            <p className="text-sm text-gray-600 dark:text-gray-300 p-4">
                                                No books in this bookcase.
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                        <div className="flex gap-4 mt-6">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link href={route("bookcases.edit", bookcase.id)}>
                                        <Button
                                            className={`${commonStyles.button} ${commonStyles.indigoButton} px-4 py-2`}
                                            disabled={processing}
                                            aria-label="Edit bookcase"
                                        >
                                            <Pencil className="h-4 w-4 mr-2" />
                                            Edit
                                        </Button>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent className={commonStyles.tooltipBg}>
                                    Edit this bookcase
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link href={route("bookcases.index")}>
                                        <Button
                                            variant="outline"
                                            className={`${commonStyles.button} ${commonStyles.outlineButton} px-4 py-2`}
                                            disabled={processing}
                                            aria-label="Return to bookcases list"
                                        >
                                            <ArrowLeft className="h-4 w-4 mr-2" />
                                            Back
                                        </Button>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent className={commonStyles.tooltipBg}>
                                    Return to the bookcases list
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </div>
                </div>
            </TooltipProvider>
        </AppLayout>
    );
}
