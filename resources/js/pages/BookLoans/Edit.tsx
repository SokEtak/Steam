"use client";

import { useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head, useForm, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCircle2Icon, X } from "lucide-react";

interface User {
    id: number;
    name: string;
}

interface Book {
    id: number;
    title: string;
}

interface BookLoan {
    id: number;
    return_date: string;
    book_id: number;
    user_id: number;
    book: Book | null;
    user: User | null;
}

interface BookLoansEditProps {
    loan: BookLoan;
    books: Book[];
    users: User[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Book Loans",
        href: route("bookloans.index"),
    },
    {
        title: "Edit",
        href: "",
    },
];

export default function BookLoansEdit({ loan, books, users }: BookLoansEditProps) {
    const { data, setData, put, processing, errors } = useForm({
        return_date: loan.return_date || "",
        book_id: loan.book_id.toString(),
        user_id: loan.user_id.toString(),
    });
    const [showErrorAlert, setShowErrorAlert] = useState(!!Object.keys(errors).length);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("bookloans.update", loan.id), {
            data,
            onSuccess: () => {
                setShowErrorAlert(false);
            },
            onError: () => {
                setShowErrorAlert(true);
            },
        });
    };

    const handleCloseAlert = () => setShowErrorAlert(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Book Loan" />
            <div className="p-4 sm:p-6 lg:p-5 xl:p-2">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-indigo-900 rounded-2xl shadow-2xl border border-indigo-200 dark:border-indigo-700 p-6">
                    <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-300 mb-6">
                        Edit Book Loan
                    </h1>
                    {showErrorAlert && Object.keys(errors).length > 0 && (
                        <Alert className="mb-4 flex items-start justify-between bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900 dark:to-red-800 text-gray-800 dark:text-gray-100 border border-red-200 dark:border-red-700 rounded-xl">
                            <div className="flex gap-2">
                                <CheckCircle2Icon className="h-4 w-4 text-red-600 dark:text-red-300" />
                                <div>
                                    <AlertTitle className="text-red-600 dark:text-red-300">Error</AlertTitle>
                                    <AlertDescription className="text-gray-600 dark:text-gray-300">
                                        {Object.values(errors).join(", ")}
                                    </AlertDescription>
                                </div>
                            </div>
                            <Button
                                onClick={handleCloseAlert}
                                className="text-sm font-medium cursor-pointer text-red-600 dark:text-red-300 hover:text-red-800 dark:hover:text-red-100"
                                disabled={processing}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </Alert>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label
                                htmlFor="return_date"
                                className="text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Return Date
                            </label>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Input
                                            id="return_date"
                                            type="date"
                                            value={data.return_date}
                                            onChange={(e) => setData("return_date", e.target.value)}
                                            className={`w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border ${errors.return_date ? "border-red-500 dark:border-red-400" : "border-indigo-200 dark:border-indigo-600"} focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all duration-200`}
                                            disabled={processing}
                                            aria-invalid={!!errors.return_date}
                                            aria-describedby={errors.return_date ? "return-date-error" : undefined}
                                        />
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-gradient-to-br from-blue-900 to-indigo-600 text-white rounded-xl">
                                        Select the return date for the book loan
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            {errors.return_date && (
                                <p id="return-date-error" className="text-red-500 dark:text-red-400 text-sm mt-1">
                                    {errors.return_date}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label
                                htmlFor="book_id"
                                className="text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Book
                            </label>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Select
                                            value={data.book_id}
                                            onValueChange={(value) => setData("book_id", value)}
                                        >
                                            <SelectTrigger
                                                id="book_id"
                                                className={`w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border ${errors.book_id ? "border-red-500 dark:border-red-400" : "border-indigo-200 dark:border-indigo-600"} focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all duration-200`}
                                                aria-invalid={!!errors.book_id}
                                                aria-describedby={errors.book_id ? "book-error" : undefined}
                                            >
                                                <SelectValue placeholder="Select a book" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white dark:bg-gray-700 border border-indigo-200 dark:border-indigo-600">
                                                {books.map((book) => (
                                                    <SelectItem key={book.id} value={book.id.toString()}>
                                                        {book.title}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-gradient-to-br from-blue-900 to-indigo-600 text-white rounded-xl">
                                        Select the book for this loan
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            {errors.book_id && (
                                <p id="book-error" className="text-red-500 dark:text-red-400 text-sm mt-1">
                                    {errors.book_id}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label
                                htmlFor="user_id"
                                className="text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Loaner
                            </label>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Select
                                            value={data.user_id}
                                            onValueChange={(value) => setData("user_id", value)}
                                        >
                                            <SelectTrigger
                                                id="user_id"
                                                className={`w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border ${errors.user_id ? "border-red-500 dark:border-red-400" : "border-indigo-200 dark:border-indigo-600"} focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all duration-200`}
                                                aria-invalid={!!errors.user_id}
                                                aria-describedby={errors.user_id ? "user-error" : undefined}
                                            >
                                                <SelectValue placeholder="Select a user" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white dark:bg-gray-700 border border-indigo-200 dark:border-indigo-600">
                                                {users.map((user) => (
                                                    <SelectItem key={user.id} value={user.id.toString()}>
                                                        {user.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-gradient-to-br from-blue-900 to-indigo-600 text-white rounded-xl">
                                        Select the user for this loan
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            {errors.user_id && (
                                <p id="user-error" className="text-red-500 dark:text-red-400 text-sm mt-1">
                                    {errors.user_id}
                                </p>
                            )}
                        </div>
                        <div className="flex gap-4">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="bg-indigo-500 text-white hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors duration-200"
                                        >
                                            {processing ? "Updating..." : "Update"}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-gradient-to-br from-blue-900 to-indigo-600 text-white rounded-xl">
                                        Save changes to the book loan
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link href={route("bookloans.index")}>
                                            <Button
                                                variant="outline"
                                                className="bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 border-indigo-200 dark:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-800 px-4 py-2 rounded-lg transition-colors duration-200"
                                                disabled={processing}
                                            >
                                                Cancel
                                            </Button>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-gradient-to-br from-blue-900 to-indigo-600 text-white rounded-xl">
                                        Return to the book loans list
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
