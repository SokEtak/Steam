"use client";

import { useState, useEffect } from "react";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CheckCircle2Icon, Pencil, Trash, ArrowLeft, X } from "lucide-react";

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
    created_at: string;
    updated_at: string;
}

interface BookLoanShowProps {
    loan: BookLoan;
    flash: {
        message: string | null;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Book Loans",
        href: route("bookloans.index"),
    },
    {
        title: "Show",
        href: "",
    },
];

export default function BookLoanShow({ loan, flash }: BookLoanShowProps) {
    const { processing } = useForm();
    const [showAlert, setShowAlert] = useState(!!flash.message);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    useEffect(() => {
        if (flash.message) setShowAlert(true);
    }, [flash.message]);

    const handleCloseAlert = () => setShowAlert(false);

    const confirmDelete = () => {
        router.delete(route("bookloans.destroy", loan.id), {
            onSuccess: () => {
                setShowDeleteDialog(false);
                router.visit(route("bookloans.index"));
            },
            onError: () => {
                setShowDeleteDialog(false);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Book Loan: ${loan.book?.title || "Details"}`} />
            <div className="p-4 sm:p-6 lg:p-5 xl:p-2">
                {showAlert && flash.message && (
                    <Alert className="mb-4 flex items-start justify-between bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-indigo-900 text-gray-800 dark:text-gray-100 border border-indigo-200 dark:border-indigo-700 rounded-xl">
                        <div className="flex gap-2">
                            <CheckCircle2Icon className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
                            <div>
                                <AlertTitle className="text-indigo-600 dark:text-indigo-300">Notification</AlertTitle>
                                <AlertDescription className="text-gray-600 dark:text-gray-300">
                                    {flash.message}
                                </AlertDescription>
                            </div>
                        </div>
                        <Button
                            onClick={handleCloseAlert}
                            className="text-sm font-medium cursor-pointer text-indigo-600 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-indigo-100"
                            disabled={processing}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </Alert>
                )}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-indigo-900 rounded-2xl shadow-2xl border border-indigo-200 dark:border-indigo-700 p-6">
                    <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-300 mb-6">
                        Book Loan Details
                    </h1>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">ID</label>
                            <p
                                className="px-4 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-indigo-200 dark:border-indigo-600"
                                aria-label={`Book Loan ID: ${loan.id}`}
                            >
                                {loan.id}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Return Date</label>
                            <p
                                className="px-4 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-indigo-200 dark:border-indigo-600"
                                aria-label={`Return Date: ${loan.return_date || "N/A"}`}
                            >
                                {loan.return_date || "N/A"}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Book</label>
                            <p
                                className="px-4 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-indigo-200 dark:border-indigo-600"
                                aria-label={loan.book ? `Book: ${loan.book.title}` : "Book: N/A"}
                            >
                                {loan.book_id ? (
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Link
                                                    href={route("books.show", loan.book_id)}
                                                    className="text-indigo-600 dark:text-indigo-300 hover:text-indigo-700 dark:hover:text-indigo-400 underline"
                                                >
                                                    {loan.book?.title || "N/A"}
                                                </Link>
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-gradient-to-br from-blue-900 to-indigo-600 text-white rounded-xl">
                                                View book details
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                ) : (
                                    <span className="text-gray-500 dark:text-gray-400">N/A</span>
                                )}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Loaner</label>
                            <p
                                className="px-4 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-indigo-200 dark:border-indigo-600"
                                aria-label={loan.user ? `User: ${loan.user.name}` : "User: N/A"}
                            >
                                {loan.user_id ? (
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Link
                                                    href={route("users.show", loan.user_id)}
                                                    className="text-indigo-600 dark:text-indigo-300 hover:text-indigo-700 dark:hover:text-indigo-400 underline"
                                                >
                                                    {loan.user?.name || "N/A"}
                                                </Link>
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-gradient-to-br from-blue-900 to-indigo-600 text-white rounded-xl">
                                                View user details
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                ) : (
                                    <span className="text-gray-500 dark:text-gray-400">N/A</span>
                                )}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Created At</label>
                            <p
                                className="px-4 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-indigo-200 dark:border-indigo-600"
                                aria-label={`Created At: ${new Date(loan.created_at).toLocaleString()}`}
                            >
                                {new Date(loan.created_at).toLocaleString()}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Modified</label>
                            <p
                                className="px-4 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-indigo-200 dark:border-indigo-600"
                                aria-label={`Last Modified: ${new Date(loan.updated_at).toLocaleString()}`}
                            >
                                {new Date(loan.updated_at).toLocaleString()}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4 mt-6">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link href={route("bookloans.edit", loan.id)}>
                                        <Button
                                            className="bg-indigo-500 text-white hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors duration-200"
                                            disabled={processing}
                                        >
                                            <Pencil className="h-4 w-4 mr-2" />
                                            Edit
                                        </Button>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent className="bg-gradient-to-br from-blue-900 to-indigo-600 text-white rounded-xl">
                                    Edit this book loan
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        className="bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 px-4 py-2 rounded-lg transition-colors duration-200"
                                        onClick={() => setShowDeleteDialog(true)}
                                        disabled={processing}
                                    >
                                        <Trash className="h-4 w-4 mr-2" />
                                        Delete
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent className="bg-gradient-to-br from-blue-900 to-indigo-600 text-white rounded-xl">
                                    Delete this book loan
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
                                            <ArrowLeft className="h-4 w-4 mr-2" />
                                            Back
                                        </Button>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent className="bg-gradient-to-br from-blue-900 to-indigo-600 text-white rounded-xl">
                                    Return to the book loans list
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
                <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <AlertDialogContent className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-indigo-900 text-gray-800 dark:text-gray-100 border border-indigo-200 dark:border-indigo-700 rounded-2xl shadow-2xl">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-indigo-600 dark:text-indigo-300">
                                Are you sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
                                This action cannot be undone. This will permanently delete the book loan for{" "}
                                <strong>{loan.book?.title || "this book"}</strong>.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 border-indigo-200 dark:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-800 rounded-lg">
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={confirmDelete}
                                className="bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 rounded-lg"
                                disabled={processing}
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AppLayout>
    );
}
