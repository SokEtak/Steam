"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import {
    CheckCircle2Icon,
    EyeIcon,
    PencilIcon,
    TrashIcon,
    Plus,
    ArrowUpDown,
    ChevronDown,
    MoreHorizontal,
    ArrowLeft,
    ArrowRight,
    Filter as FilterIcon,
    ArrowUp,
    ArrowDown,
    FileText,
} from "lucide-react";
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    VisibilityState,
    PaginationState,
    SortingState,
} from "@tanstack/react-table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

interface User {
    id: number;
    name: string;
}

interface Category {
    id: number;
    name: string;
}

interface Subcategory {
    id: number;
    name: string;
}

interface Grade {
    id: number;
    name: string;
}

interface Subject {
    id: number;
    name: string;
}

interface Bookcase {
    id: number;
    code: string;
}

interface Shelves {
    id: number;
    code: string;
}

interface Book {
    id: number;
    title: string;
    pdf_url: string | null;
    flip_link: string;
    cover: string;
    code: string;
    isbn: string;
    view: string;
    is_available: boolean;
    user_id: number | null;
    category_id: number | null;
    subcategory_id: number | null;
    bookcase_id: number | null;
    shelf_id: number | null;
    grade_id: number | null;
    subject_id: number | null;
    is_deleted: boolean;
    user: User | null;
    category: Category | null;
    subcategory: Subcategory | null;
    bookcase: Bookcase | null;
    shelf: Shelves | null;
    grade: Grade | null;
    subject: Subject | null;
}

interface PageProps {
    books: Book[];
    flash: {
        message?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: "Books", href: "/books" },
];

const getColumns = (
    setBookToDelete: React.Dispatch<React.SetStateAction<Book | null>>,
    processing: boolean,
    setSelectedBook: React.Dispatch<React.SetStateAction<Book | null>>,
    setImageModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
    setImageUrl: React.Dispatch<React.SetStateAction<string | null>>,
    setRowModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
    setSelectedRow: React.Dispatch<React.SetStateAction<Book | null>>,
    setPdfModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
    setPdfUrl: React.Dispatch<React.SetStateAction<string | null>>,
    isAvailableDropdownOpen: boolean,
    setIsAvailableDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>,
    isUserDropdownOpen: boolean,
    setIsUserDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>,
    isCategoryDropdownOpen: boolean,
    setIsCategoryDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>,
    isSubcategoryDropdownOpen: boolean,
    setIsSubcategoryDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>,
    isGradeDropdownOpen: boolean,
    setIsGradeDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>,
    isSubjectDropdownOpen: boolean,
    setIsSubjectDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>,
    isBookcaseDropdownOpen: boolean,
    setIsBookcaseDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>,
    isShelfDropdownOpen: boolean,
    setIsShelfDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>,
    updateAvailability: (id: number, isAvailable: boolean) => void
): ColumnDef<Book>[] => {
    return [
        {
            id: "actions",
            enableHiding: false,
            enableGlobalFilter: false,
            enableSorting: false,
            cell: ({ row }) => {
                const book = row.original;
                return (
                    <TooltipProvider>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="center" className="w-auto min-w-0">
                                <div className="flex flex-col items-center gap-1 px-1 py-1">
                                    {/* View Cover */}
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="h-4 w-4 p-0"
                                                onClick={() => {
                                                    setImageUrl(book.cover || null);
                                                    setImageModalOpen(true);
                                                }}
                                            >
                                                <EyeIcon className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="right" align="center">
                                            View Cover
                                        </TooltipContent>
                                    </Tooltip>
                                    {/* View PDF */}
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="h-4 w-4 p-0"
                                                onClick={() => {
                                                    setPdfUrl(book.pdf_url || null);
                                                    setPdfModalOpen(true);
                                                }}
                                                disabled={!book.pdf_url}
                                            >
                                                <FileText className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="right" align="center">
                                            View PDF
                                        </TooltipContent>
                                    </Tooltip>
                                    {/* Edit */}
                                    <Link href={route("books.edit", book.id)}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" className="h-4 w-4 p-0">
                                                    <PencilIcon className="h-4 w-4" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent side="right" align="center">
                                                Edit
                                            </TooltipContent>
                                        </Tooltip>
                                    </Link>
                                    {/* Delete */}
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="h-4 w-4 p-0 text-red-600"
                                                onClick={() => setBookToDelete(book)}
                                                disabled={processing}
                                            >
                                                <TrashIcon className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="right" align="center">
                                            Delete
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TooltipProvider>
                );
            },
        },
        {
            accessorKey: "id",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    ID
                    {{
                        asc: <ArrowUp className="ml-2 h-4 w-4" />,
                        desc: <ArrowDown className="ml-2 h-4 w-4" />,
                    }[column.getIsSorted() as string] ?? <ArrowUpDown className="ml-2 h-4 w-4" />}
                </Button>
            ),
            cell: ({ row }) => (
                <button className="px-3 cursor-pointer" onClick={() => { setRowModalOpen(true); setSelectedRow(row.original); }} role="button">
                    {row.getValue("id")}
                </button>
            ),
            filterFn: (row, id, value) => String(row.getValue(id)).includes(String(value)),
        },
        {
            accessorKey: "title",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Title
                    {{
                        asc: <ArrowUp className="ml-2 h-4 w-4" />,
                        desc: <ArrowDown className="ml-2 h-4 w-4" />,
                    }[column.getIsSorted() as string] ?? <ArrowUpDown className="ml-2 h-4 w-4" />}
                </Button>
            ),
            cell: ({ row }) => (
                <button className="px-3 cursor-pointer" onClick={() => { setRowModalOpen(true); setSelectedRow(row.original); }} role="button">
                    {row.getValue("title")}
                </button>
            ),
            filterFn: (row, id, value) => String(row.getValue(id)).toLowerCase().includes(String(value).toLowerCase()),
        },
        {
            accessorKey: "pdf_url",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    PDF URL
                    {{
                        asc: <ArrowUp className="ml-2 h-4 w-4" />,
                        desc: <ArrowDown className="ml-2 h-4 w-4" />,
                    }[column.getIsSorted() as string] ?? <ArrowUpDown className="ml-2 h-4 w-4" />}
                </Button>
            ),
            cell: ({ row }) => (
                <button className="px-3 cursor-pointer" onClick={() => { setRowModalOpen(true); setSelectedRow(row.original); }} role="button">
                    <a
                        href={row.getValue("pdf_url") || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={row.getValue("pdf_url") ? "text-blue-500 underline" : "text-red-500 dark:text-red-400"}
                    >
                        {row.getValue("pdf_url") || "N/A"}
                    </a>
                </button>
            ),
            filterFn: (row, id, value) => String(row.getValue(id) || "").toLowerCase().includes(String(value).toLowerCase()),
        },
        {
            accessorKey: "flip_link",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Flip Link
                    {{
                        asc: <ArrowUp className="ml-2 h-4 w-4" />,
                        desc: <ArrowDown className="ml-2 h-4 w-4" />,
                    }[column.getIsSorted() as string] ?? <ArrowUpDown className="ml-2 h-4 w-4" />}
                </Button>
            ),
            cell: ({ row }) => (
                <button className="px-3 cursor-pointer" onClick={() => { setRowModalOpen(true); setSelectedRow(row.original); }} role="button">
                    <a
                        href={row.getValue("flip_link") || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={row.getValue("flip_link") ? "text-blue-500 underline" : "text-red-500 dark:text-red-400"}
                    >
                        {row.getValue("flip_link") || "N/A"}
                    </a>
                </button>
            ),
            filterFn: (row, id, value) => String(row.getValue(id) || "").toLowerCase().includes(String(value).toLowerCase()),
        },
        {
            accessorKey: "code",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Code
                    {{
                        asc: <ArrowUp className="ml-2 h-4 w-4" />,
                        desc: <ArrowDown className="ml-2 h-4 w-4" />,
                    }[column.getIsSorted() as string] ?? <ArrowUpDown className="ml-2 h-4 w-4" />}
                </Button>
            ),
            cell: ({ row }) => (
                <button className="px-3 cursor-pointer" onClick={() => { setRowModalOpen(true); setSelectedRow(row.original); }} role="button">
                    {row.getValue("code")}
                </button>
            ),
            filterFn: (row, id, value) => String(row.getValue(id)).toLowerCase().includes(String(value).toLowerCase()),
        },
        {
            accessorKey: "isbn",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    ISBN
                    {{
                        asc: <ArrowUp className="ml-2 h-4 w-4" />,
                        desc: <ArrowDown className="ml-2 h-4 w-4" />,
                    }[column.getIsSorted() as string] ?? <ArrowUpDown className="ml-2 h-4 w-4" />}
                </Button>
            ),
            cell: ({ row }) => (
                <button className="px-3 cursor-pointer" onClick={() => { setRowModalOpen(true); setSelectedRow(row.original); }} role="button">
                    {row.getValue("isbn")}
                </button>
            ),
            filterFn: (row, id, value) => String(row.getValue(id)).toLowerCase().includes(String(value).toLowerCase()),
        },
        {
            accessorKey: "view",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Views
                    {{
                        asc: <ArrowUp className="ml-2 h-4 w-4" />,
                        desc: <ArrowDown className="ml-2 h-4 w-4" />,
                    }[column.getIsSorted() as string] ?? <ArrowUpDown className="ml-2 h-4 w-4" />}
                </Button>
            ),
            cell: ({ row }) => (
                <button className="px-3 cursor-pointer" onClick={() => { setRowModalOpen(true); setSelectedRow(row.original); }} role="button">
                    {row.getValue("view")}
                </button>
            ),
            filterFn: (row, id, value) => String(row.getValue(id)).includes(String(value)),
        },
        {
            accessorKey: "is_available",
            header: ({ column }) => {
                const filterValue = column.getFilterValue() as string;
                return (
                    <div className="flex items-center space-x-2">
                        <span>Available</span>
                        <DropdownMenu open={isAvailableDropdownOpen} onOpenChange={setIsAvailableDropdownOpen}>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 data-[state=open]:bg-accent">
                                                <FilterIcon className={`h-4 w-4 ${filterValue ? "text-blue-500" : "text-gray-400"}`} />
                                                <span className="sr-only">Open filter menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Filter by Availability
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <DropdownMenuContent align="start" className="p-2 w-[180px]">
                                <Select
                                    value={filterValue || "All"}
                                    onValueChange={(value) => {
                                        column.setFilterValue(value === "All" ? undefined : value === "true");
                                        setIsAvailableDropdownOpen(false);
                                    }}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Availability" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">All</SelectItem>
                                        <SelectItem value="true">Yes</SelectItem>
                                        <SelectItem value="false">No</SelectItem>
                                    </SelectContent>
                                </Select>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
            cell: ({ row }) => {
                const book = row.original;
                const { processing, patch } = useForm();
                const handleToggleAvailability = () => {
                    updateAvailability(book.id, !book.is_available);
                    patch(route("books.updateAvailability", { id: book.id, is_available: !book.is_available }), {
                        preserveScroll: true,
                        onSuccess: () => {
                            // Optionally update local state if needed
                        },
                        onError: () => {
                            // Handle error if needed
                        },
                    });
                };
                return (
                    <button className="px-3 cursor-pointer" onClick={() => { setRowModalOpen(true); setSelectedRow(row.original); }} role="button">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent row modal from opening
                                handleToggleAvailability();
                            }}
                            disabled={processing}
                        >
                            {book.is_available ? "Yes" : "No"}
                        </Button>
                    </button>
                );
            },
            filterFn: (row, id, value) => value === undefined || row.getValue(id) === value,
            enableSorting: false,
        },
        {
            accessorKey: "user",
            header: ({ column }) => {
                const filterValue = column.getFilterValue() as string;
                const uniqueUsers = Array.from(new Set(column.getFacetedRowModel().rows.map(row => row.original.user_id)))
                    .map(id => column.getFacetedRowModel().rows.find(row => row.original.user_id === id)?.original.user)
                    .filter((user): user is User => !!user)
                    .sort((a, b) => a.name.localeCompare(b.name));
                return (
                    <div className="flex items-center space-x-2">
                        <span>User</span>
                        <DropdownMenu open={isUserDropdownOpen} onOpenChange={setIsUserDropdownOpen}>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 data-[state=open]:bg-accent">
                                                <FilterIcon className={`h-4 w-4 ${filterValue ? "text-blue-500" : "text-gray-400"}`} />
                                                <span className="sr-only">Open filter menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Filter by User
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <DropdownMenuContent align="start" className="p-2 w-[180px]">
                                <Select
                                    value={filterValue || "All"}
                                    onValueChange={(value) => {
                                        column.setFilterValue(value === "All" ? undefined : Number(value));
                                        setIsUserDropdownOpen(false);
                                    }}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select User" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">All Users</SelectItem>
                                        {uniqueUsers.map((user) => (
                                            <SelectItem key={user.id} value={String(user.id)}>
                                                {user.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
            cell: ({ row }) => (
                <button className="px-3 cursor-pointer" onClick={() => { setRowModalOpen(true); setSelectedRow(row.original); }} role="button">
                    {row.original.user_id ? (
                        <Link
                            href={route("users.show", row.original.user_id)}
                            className="text-blue-500 underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                            {row.original.user?.name || "N/A"}
                        </Link>
                    ) : (
                        <span className="text-red-500 dark:text-red-400">N/A</span>
                    )}
                </button>
            ),
            filterFn: (row, id, value) => value === undefined || row.original.user_id === value,
            enableSorting: false,
            enableHiding: true,
        },
        {
            accessorKey: "category",
            header: ({ column }) => {
                const filterValue = column.getFilterValue() as string;
                const uniqueCategories = Array.from(new Set(column.getFacetedRowModel().rows.map(row => row.original.category_id)))
                    .map(id => column.getFacetedRowModel().rows.find(row => row.original.category_id === id)?.original.category)
                    .filter((category): category is Category => !!category)
                    .sort((a, b) => a.name.localeCompare(b.name));
                return (
                    <div className="flex items-center space-x-2">
                        <span>Category</span>
                        <DropdownMenu open={isCategoryDropdownOpen} onOpenChange={setIsCategoryDropdownOpen}>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 data-[state=open]:bg-accent">
                                                <FilterIcon className={`h-4 w-4 ${filterValue ? "text-blue-500" : "text-gray-400"}`} />
                                                <span className="sr-only">Open filter menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Filter by Category
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <DropdownMenuContent align="start" className="p-2 w-[180px]">
                                <Select
                                    value={filterValue || "All"}
                                    onValueChange={(value) => {
                                        column.setFilterValue(value === "All" ? undefined : Number(value));
                                        setIsCategoryDropdownOpen(false);
                                    }}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">All Categories</SelectItem>
                                        {uniqueCategories.map((category) => (
                                            <SelectItem key={category.id} value={String(category.id)}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
            cell: ({ row }) => (
                <button className="px-3 cursor-pointer" onClick={() => { setRowModalOpen(true); setSelectedRow(row.original); }} role="button">
                    {row.original.category_id ? (
                        <Link
                            href={route("categories.show", row.original.category_id)}
                            className="text-blue-500 underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                            {row.original.category?.name || "N/A"}
                        </Link>
                    ) : (
                        <span className="text-red-500 dark:text-red-400">N/A</span>
                    )}
                </button>
            ),
            filterFn: (row, id, value) => value === undefined || row.original.category_id === value,
            enableSorting: false,
            enableHiding: true,
        },
        {
            accessorKey: "subcategory",
            header: ({ column }) => {
                const filterValue = column.getFilterValue() as string;
                const uniqueSubcategories = Array.from(new Set(column.getFacetedRowModel().rows.map(row => row.original.subcategory_id)))
                    .map(id => column.getFacetedRowModel().rows.find(row => row.original.subcategory_id === id)?.original.subcategory)
                    .filter((subcategory): subcategory is Subcategory => !!subcategory)
                    .sort((a, b) => a.name.localeCompare(b.name));
                return (
                    <div className="flex items-center space-x-2">
                        <span>Subcategory</span>
                        <DropdownMenu open={isSubcategoryDropdownOpen} onOpenChange={setIsSubcategoryDropdownOpen}>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 data-[state=open]:bg-accent">
                                                <FilterIcon className={`h-4 w-4 ${filterValue ? "text-blue-500" : "text-gray-400"}`} />
                                                <span className="sr-only">Open filter menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Filter by Subcategory
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <DropdownMenuContent align="start" className="p-2 w-[180px]">
                                <Select
                                    value={filterValue || "All"}
                                    onValueChange={(value) => {
                                        column.setFilterValue(value === "All" ? undefined : Number(value));
                                        setIsSubcategoryDropdownOpen(false);
                                    }}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Subcategory" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">All Subcategories</SelectItem>
                                        {uniqueSubcategories.map((subcategory) => (
                                            <SelectItem key={subcategory.id} value={String(subcategory.id)}>
                                                {subcategory.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
            cell: ({ row }) => (
                <button className="px-3 cursor-pointer" onClick={() => { setRowModalOpen(true); setSelectedRow(row.original); }} role="button">
                    {row.original.subcategory_id ? (
                        <Link
                            href={route("subcategories.show", row.original.subcategory_id)}
                            className="text-blue-500 underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                            {row.original.subcategory?.name || "N/A"}
                        </Link>
                    ) : (
                        <span className="text-red-500 dark:text-red-400">N/A</span>
                    )}
                </button>
            ),
            filterFn: (row, id, value) => value === undefined || row.original.subcategory_id === value,
            enableSorting: false,
            enableHiding: true,
        },
        {
            accessorKey: "grade",
            header: ({ column }) => {
                const filterValue = column.getFilterValue() as string;
                const uniqueGrades = Array.from(new Set(column.getFacetedRowModel().rows.map(row => row.original.grade_id)))
                    .map(id => column.getFacetedRowModel().rows.find(row => row.original.grade_id === id)?.original.grade)
                    .filter((grade): grade is Grade => !!grade)
                    .sort((a, b) => a.name.localeCompare(b.name));
                return (
                    <div className="flex items-center space-x-2">
                        <span>Grade</span>
                        <DropdownMenu open={isGradeDropdownOpen} onOpenChange={setIsGradeDropdownOpen}>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 data-[state=open]:bg-accent">
                                                <FilterIcon className={`h-4 w-4 ${filterValue ? "text-blue-500" : "text-gray-400"}`} />
                                                <span className="sr-only">Open filter menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Filter by Grade
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <DropdownMenuContent align="start" className="p-2 w-[180px]">
                                <Select
                                    value={filterValue || "All"}
                                    onValueChange={(value) => {
                                        column.setFilterValue(value === "All" ? undefined : Number(value));
                                        setIsGradeDropdownOpen(false);
                                    }}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Grade" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">All Grades</SelectItem>
                                        {uniqueGrades.map((grade) => (
                                            <SelectItem key={grade.id} value={String(grade.id)}>
                                                {grade.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
            cell: ({ row }) => (
                <button className="px-3 cursor-pointer" onClick={() => { setRowModalOpen(true); setSelectedRow(row.original); }} role="button">
                    {row.original.grade?.name || "N/A"}
                </button>
            ),
            filterFn: (row, id, value) => value === undefined || row.original.grade_id === value,
            enableSorting: false,
            enableHiding: true,
        },
        {
            accessorKey: "subject",
            header: ({ column }) => {
                const filterValue = column.getFilterValue() as string;
                const uniqueSubjects = Array.from(new Set(column.getFacetedRowModel().rows.map(row => row.original.subject_id)))
                    .map(id => column.getFacetedRowModel().rows.find(row => row.original.subject_id === id)?.original.subject)
                    .filter((subject): subject is Subject => !!subject)
                    .sort((a, b) => a.name.localeCompare(b.name));
                return (
                    <div className="flex items-center space-x-2">
                        <span>Subject</span>
                        <DropdownMenu open={isSubjectDropdownOpen} onOpenChange={setIsSubjectDropdownOpen}>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 data-[state=open]:bg-accent">
                                                <FilterIcon className={`h-4 w-4 ${filterValue ? "text-blue-500" : "text-gray-400"}`} />
                                                <span className="sr-only">Open filter menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Filter by Subject
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <DropdownMenuContent align="start" className="p-2 w-[180px]">
                                <Select
                                    value={filterValue || "All"}
                                    onValueChange={(value) => {
                                        column.setFilterValue(value === "All" ? undefined : Number(value));
                                        setIsSubjectDropdownOpen(false);
                                    }}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Subject" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">All Subjects</SelectItem>
                                        {uniqueSubjects.map((subject) => (
                                            <SelectItem key={subject.id} value={String(subject.id)}>
                                                {subject.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
            cell: ({ row }) => (
                <button className="px-3 cursor-pointer" onClick={() => { setRowModalOpen(true); setSelectedRow(row.original); }} role="button">
                    {row.original.subject?.name || "N/A"}
                </button>
            ),
            filterFn: (row, id, value) => value === undefined || row.original.subject_id === value,
            enableSorting: false,
            enableHiding: true,
        },
        {
            accessorKey: "bookcase",
            header: ({ column }) => {
                const filterValue = column.getFilterValue() as string;
                const uniqueBookcases = Array.from(new Set(column.getFacetedRowModel().rows.map(row => row.original.bookcase_id)))
                    .map(id => column.getFacetedRowModel().rows.find(row => row.original.bookcase_id === id)?.original.bookcase)
                    .filter((bookcase): bookcase is Bookcase => !!bookcase)
                    .sort((a, b) => a.code.localeCompare(b.code));
                return (
                    <div className="flex items-center space-x-2">
                        <span>Bookcase</span>
                        <DropdownMenu open={isBookcaseDropdownOpen} onOpenChange={setIsBookcaseDropdownOpen}>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 data-[state=open]:bg-accent">
                                                <FilterIcon className={`h-4 w-4 ${filterValue ? "text-blue-500" : "text-gray-400"}`} />
                                                <span className="sr-only">Open filter menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Filter by Bookcase
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <DropdownMenuContent align="start" className="p-2 w-[180px]">
                                <Select
                                    value={filterValue || "All"}
                                    onValueChange={(value) => {
                                        column.setFilterValue(value === "All" ? undefined : Number(value));
                                        setIsBookcaseDropdownOpen(false);
                                    }}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Bookcase" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">All Bookcases</SelectItem>
                                        {uniqueBookcases.map((bookcase) => (
                                            <SelectItem key={bookcase.id} value={String(bookcase.id)}>
                                                {bookcase.code}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
            cell: ({ row }) => (
                <button className="px-3 cursor-pointer" onClick={() => { setRowModalOpen(true); setSelectedRow(row.original); }} role="button">
                    {row.original.bookcase_id ? (
                        <Link
                            href={route("bookcases.show", row.original.bookcase_id)}
                            className="text-blue-500 underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                            {row.original.bookcase?.code || "N/A"}
                        </Link>
                    ) : (
                        <span className="text-red-500 dark:text-red-400">N/A</span>
                    )}
                </button>
            ),
            filterFn: (row, id, value) => value === undefined || row.original.bookcase_id === value,
            enableSorting: false,
            enableHiding: true,
        },
        {
            accessorKey: "shelf",
            header: ({ column }) => {
                const filterValue = column.getFilterValue() as string;
                const uniqueShelves = Array.from(new Set(column.getFacetedRowModel().rows.map(row => row.original.shelf_id)))
                    .map(id => column.getFacetedRowModel().rows.find(row => row.original.shelf_id === id)?.original.shelf)
                    .filter((shelf): shelf is Shelves => !!shelf)
                    .sort((a, b) => a.code.localeCompare(b.code));
                return (
                    <div className="flex items-center space-x-2">
                        <span>Shelf</span>
                        <DropdownMenu open={isShelfDropdownOpen} onOpenChange={setIsShelfDropdownOpen}>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 data-[state=open]:bg-accent">
                                                <FilterIcon className={`h-4 w-4 ${filterValue ? "text-blue-500" : "text-gray-400"}`} />
                                                <span className="sr-only">Open filter menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Filter by Shelf
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <DropdownMenuContent align="start" className="p-2 w-[180px]">
                                <Select
                                    value={filterValue || "All"}
                                    onValueChange={(value) => {
                                        column.setFilterValue(value === "All" ? undefined : Number(value));
                                        setIsShelfDropdownOpen(false);
                                    }}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Shelf" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">All Shelves</SelectItem>
                                        {uniqueShelves.map((shelf) => (
                                            <SelectItem key={shelf.id} value={String(shelf.id)}>
                                                {shelf.code}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
            cell: ({ row }) => (
                <button className="px-3 cursor-pointer" onClick={() => { setRowModalOpen(true); setSelectedRow(row.original); }} role="button">
                    {row.original.shelf_id ? (
                        <Link
                            href={route("shelves.show", row.original.shelf_id)}
                            className="text-blue-500 underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                            {row.original.shelf?.code || "N/A"}
                        </Link>
                    ) : (
                        <span className="text-red-500 dark:text-red-400">N/A</span>
                    )}
                </button>
            ),
            filterFn: (row, id, value) => value === undefined || row.original.shelf_id === value,
            enableSorting: false,
            enableHiding: true,
        },
    ];
};

export default function BooksIndex() {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    const { books, flash } = usePage<PageProps>().props;
    const [showAlert, setShowAlert] = useState(!!flash.message);
    const { processing, delete: destroy, patch } = useForm();
    const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
    const [isTableLoading, setIsTableLoading] = useState(true);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [isAvailableDropdownOpen, setIsAvailableDropdownOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const [isSubcategoryDropdownOpen, setIsSubcategoryDropdownOpen] = useState(false);
    const [isGradeDropdownOpen, setIsGradeDropdownOpen] = useState(false);
    const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
    const [isBookcaseDropdownOpen, setIsBookcaseDropdownOpen] = useState(false);
    const [isShelfDropdownOpen, setIsShelfDropdownOpen] = useState(false);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
        id: true,
        title: true,
        pdf_url: false,
        flip_link: false,
        code: true,
        isbn: true,
        view: false,
        is_available: true,
        user: true,
        category: true,
        subcategory: false,
        grade: false,
        subject: false,
        bookcase: false,
        shelf: false,
    });
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [globalFilter, setGlobalFilter] = useState("");
    const [rowModalOpen, setRowModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<Book | null>(null);
    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [pdfModalOpen, setPdfModalOpen] = useState(false);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);

    const updateAvailability = (id: number, isAvailable: boolean) => {
        const updatedBooks = books.map(book =>
            book.id === id ? { ...book, is_available: isAvailable } : book
        );
    };

    const columns = getColumns(
        setBookToDelete,
        processing,
        setSelectedBook,
        setImageModalOpen,
        setImageUrl,
        setRowModalOpen,
        setSelectedRow,
        setPdfModalOpen,
        setPdfUrl,
        isAvailableDropdownOpen,
        setIsAvailableDropdownOpen,
        isUserDropdownOpen,
        setIsUserDropdownOpen,
        isCategoryDropdownOpen,
        setIsCategoryDropdownOpen,
        isSubcategoryDropdownOpen,
        setIsSubcategoryDropdownOpen,
        isGradeDropdownOpen,
        setIsGradeDropdownOpen,
        isSubjectDropdownOpen,
        setIsSubjectDropdownOpen,
        isBookcaseDropdownOpen,
        setIsBookcaseDropdownOpen,
        isShelfDropdownOpen,
        setIsShelfDropdownOpen,
        updateAvailability
    );

    const table = useReactTable({
        data: books || [],
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: (row, columnId, filterValue) => {
            const search = String(filterValue).toLowerCase();
            const title = String(row.original.title || "").toLowerCase();
            const code = String(row.original.code || "").toLowerCase();
            const isbn = String(row.original.isbn || "").toLowerCase();
            const view = String(row.original.view || "").toLowerCase();
            const pdf_url = String(row.original.pdf_url || "").toLowerCase();
            return title.includes(search) || code.includes(search) || isbn.includes(search) || view.includes(search) || pdf_url.includes(search);
        },
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            pagination,
            globalFilter,
        },
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    });

    useEffect(() => {
        if (flash.message) setShowAlert(true);
        const timer = setTimeout(() => {
            setIsTableLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, [flash.message, books]);

    const handleCloseAlert = () => setShowAlert(false);

    const confirmDelete = () => {
        if (bookToDelete) {
            destroy(route("books.destroy", bookToDelete.id), {
                onSuccess: () => {
                    setBookToDelete(null);
                },
                onError: () => {
                    setBookToDelete(null);
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="List of Books" />
            <div className="p-4 sm:p-6 lg:p-5 xl:p-2">
                <div className="flex flex-wrap items-center justify-between gap-2 py-4">
                    <div className="flex items-center gap-2 flex-wrap">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Input
                                        placeholder="Search by title, code, ISBN, views, or PDF URL..."
                                        value={globalFilter ?? ""}
                                        onChange={(event) => setGlobalFilter(event.target.value)}
                                        className="max-w-sm flex-grow sm:flex-grow-0"
                                        disabled={isTableLoading || processing}
                                    />
                                </TooltipTrigger>
                                <TooltipContent>
                                    Enter keywords to filter books
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                    <div className="flex items-center justify-center">
                        {isTableLoading ? (
                            <Skeleton className="h-4 w-32" />
                        ) : (
                            <span className="text-sm font-medium">
                                {`${table.getFilteredRowModel().rows.length} filtered out of ${books.length} books`}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2 ml-auto flex-wrap">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link href={route("books.create")}>
                                        <Button size="sm" disabled={isTableLoading || processing}>
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Add a new book</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <DropdownMenu>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" disabled={isTableLoading || processing}>
                                                Columns <ChevronDown className="ml-2 h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Click to Show or Hide Specific Columns
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <DropdownMenuContent align="end">
                                {table
                                    .getAllColumns()
                                    .filter((column) => column.getCanHide())
                                    .map((column) => (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                            disabled={isTableLoading || processing}
                                        >
                                            {column.id.replace(/_/g, " ")}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                {showAlert && flash.message && (
                    <Alert className="mb-4 flex items-start justify-between">
                        <div className="flex gap-2">
                            <CheckCircle2Icon className="h-4 w-4" />
                            <div>
                                <AlertTitle>New Notification</AlertTitle>
                                <AlertDescription>{flash.message}</AlertDescription>
                            </div>
                        </div>
                        <Button
                            onClick={handleCloseAlert}
                            className="text-sm font-medium cursor-pointer"
                            disabled={processing}
                        >
                            ×
                        </Button>
                    </Alert>
                )}
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        {isTableLoading ? (
                            <TableBody>
                                {Array.from({ length: table.getState().pagination.pageSize }).map((_, index) => (
                                    <TableRow key={index}>
                                        {columns.map((_, colIndex) => (
                                            <TableCell key={colIndex}>
                                                <Skeleton className="h-4 w-full" />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        ) : (
                            <TableBody>
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TooltipProvider key={row.id}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <TableRow
                                                        key={row.id}
                                                        className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                                                        onClick={() => {
                                                            setRowModalOpen(true);
                                                            setSelectedRow(row.original);
                                                        }}
                                                    >
                                                        {row.getVisibleCells().map((cell) => (
                                                            <TableCell key={cell.id}>
                                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                            </TableCell>
                                                        ))}
                                                    </TableRow>
                                                </TooltipTrigger>
                                                <TooltipContent side="left" className="max-w-md bg-gradient-to-br from-blue-900 to-indigo-600 text-white p-4 rounded-xl shadow-xl dark:from-gray-800 dark:to-gray-600">
                                                    <div>
                                                        <strong>Title:</strong> {row.original.title || "N/A"}<br />
                                                        <strong>ID:</strong> {row.original.id || "N/A"}<br />
                                                        <strong>PDF URL:</strong> {row.original.pdf_url || "N/A"}<br />
                                                        <strong>Flip Link:</strong> {row.original.flip_link || "N/A"}<br />
                                                        <strong>Code:</strong> {row.original.code || "N/A"}<br />
                                                        <strong>ISBN:</strong> {row.original.isbn || "N/A"}<br />
                                                        <strong>Views:</strong> {row.original.view || "N/A"}<br />
                                                        <strong>Available:</strong>{" "}
                                                        <span className={row.original.is_available ? "text-green-400" : "text-red-400"}>
                                                            {row.original.is_available ? "Yes" : "No"}
                                                        </span>
                                                        <br />
                                                        <strong>User:</strong> {row.original.user_id ? (
                                                            <Link href={route("users.show", row.original.user_id)} className="text-blue-300 underline hover:text-blue-100 dark:text-blue-400 dark:hover:text-blue-200">
                                                                {row.original.user?.name || "N/A"}
                                                            </Link>
                                                        ) : "N/A"}<br />
                                                        <strong>Category:</strong> {row.original.category_id ? (
                                                            <Link href={route("categories.show", row.original.category_id)} className="text-blue-300 underline hover:text-blue-100 dark:text-blue-400 dark:hover:text-blue-200">
                                                                {row.original.category?.name || "N/A"}
                                                            </Link>
                                                        ) : "N/A"}<br />
                                                        <strong>Subcategory:</strong> {row.original.subcategory_id ? (
                                                            <Link href={route("subcategories.show", row.original.subcategory_id)} className="text-blue-300 underline hover:text-blue-100 dark:text-blue-400 dark:hover:text-blue-200">
                                                                {row.original.subcategory?.name || "N/A"}
                                                            </Link>
                                                        ) : "N/A"}<br />
                                                        <strong>Grade:</strong> {row.original.grade?.name || "N/A"}<br />
                                                        <strong>Subject:</strong> {row.original.subject?.name || "N/A"}<br />
                                                        <strong>Bookcase:</strong> {row.original.bookcase_id ? (
                                                            <Link href={route("bookcases.show", row.original.bookcase_id)} className="text-blue-300 underline hover:text-blue-100 dark:text-blue-400 dark:hover:text-blue-200">
                                                                {row.original.bookcase?.code || "N/A"}
                                                            </Link>
                                                        ) : "N/A"}<br />
                                                        <strong>Shelf:</strong> {row.original.shelf_id ? (
                                                            <Link href={route("shelves.show", row.original.shelf_id)} className="text-blue-300 underline hover:text-blue-100 dark:text-blue-400 dark:hover:text-blue-200">
                                                                {row.original.shelf?.code || "N/A"}
                                                            </Link>
                                                        ) : "N/A"}<br />
                                                        <strong>Cover:</strong> {row.original.cover ? (
                                                            <img src={row.original.cover} alt="Cover" className="max-w-[100px] h-auto rounded-md" onClick={() => { setImageModalOpen(true); setImageUrl(row.original.cover); }} />
                                                        ) : "N/A"}
                                                    </div>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-24 text-center">
                                            No results.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        )}
                    </Table>
                </div>

                {/* Pagination at the bottom */}
                <div className="flex justify-center gap-2 py-4">
                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium whitespace-nowrap">Rows per page:</span>
                            <Select
                                value={String(table.getState().pagination.pageSize)}
                                onValueChange={(value) => {
                                    if (value === "All") {
                                        table.setPageSize(table.getFilteredRowModel().rows.length);
                                    } else {
                                        table.setPageSize(Number(value));
                                    }
                                }}
                                disabled={isTableLoading || processing}
                            >
                                <SelectTrigger className="h-8 w-[120px]">
                                    <SelectValue placeholder={String(table.getState().pagination.pageSize)} />
                                </SelectTrigger>
                                <SelectContent>
                                    {[10, 20, 50, 100].map((pageSize) => (
                                        <SelectItem key={pageSize} value={`${pageSize}`} className="cursor-pointer">
                                            {pageSize}
                                        </SelectItem>
                                    ))}
                                    {table.getFilteredRowModel().rows.length > 0 && (
                                        <SelectItem key="all" value="All">
                                            All
                                        </SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center space-x-2">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => table.previousPage()}
                                            disabled={!table.getCanPreviousPage() || isTableLoading || processing}
                                        >
                                            <ArrowLeft className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Previous Page
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => table.nextPage()}
                                            disabled={!table.getCanNextPage() || isTableLoading || processing}
                                        >
                                            <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Next Page
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <div className="text-muted-foreground text-sm">
                            {isTableLoading ? (
                                <Skeleton className="h-4 w-24" />
                            ) : (
                                `Page ${table.getState().pagination.pageIndex + 1} of ${table.getPageCount() || 1}`
                            )}
                        </div>
                    </div>
                </div>

                {/* Row Details Modal */}
                <Dialog open={rowModalOpen} onOpenChange={setRowModalOpen}>
                    <DialogContent className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-indigo-900 text-gray-800 dark:text-gray-100 border border-indigo-200 dark:border-indigo-700 rounded-2xl shadow-2xl md:max-w-lg sm:max-w-[90%] max-w-[95%] p-6 transition-all duration-300">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-indigo-600 dark:text-indigo-300">{selectedRow?.title || "Book Details"}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 p-4">
                            <div className="grid grid-cols-1 gap-2">
                                <p><strong className="font-semibold text-indigo-500 dark:text-indigo-300">ID:</strong> {selectedRow?.id || "N/A"}</p>
                                <p><strong className="font-semibold text-indigo-500 dark:text-indigo-300">PDF URL:</strong> {selectedRow?.pdf_url ? (
                                    <a href={selectedRow.pdf_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline">
                                        {selectedRow.pdf_url}
                                    </a>
                                ) : "N/A"}</p>
                                <p><strong className="font-semibold text-indigo-500 dark:text-indigo-300">Flip Link:</strong> {selectedRow?.flip_link ? (
                                    <a href={selectedRow.flip_link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline">
                                        {selectedRow.flip_link}
                                    </a>
                                ) : "N/A"}</p>
                                <p><strong className="font-semibold text-indigo-500 dark:text-indigo-300">Code:</strong> {selectedRow?.code || "N/A"}</p>
                                <p><strong className="font-semibold text-indigo-500 dark:text-indigo-300">ISBN:</strong> {selectedRow?.isbn || "N/A"}</p>
                                <p><strong className="font-semibold text-indigo-500 dark:text-indigo-300">Views:</strong> {selectedRow?.view || "N/A"}</p>
                                <p><strong className="font-semibold text-indigo-500 dark:text-indigo-300">Available:</strong>{" "}
                                    <span className={selectedRow?.is_available ? "text-green-500 dark:text-green-400" : "text-red-500 dark:text-red-400"}>
                                        {selectedRow?.is_available ? "Yes" : "No"}
                                    </span>
                                </p>
                                <p><strong className="font-semibold text-indigo-500 dark:text-indigo-300">User:</strong> {selectedRow?.user_id ? (
                                    <Link href={route("users.show", selectedRow.user_id)} className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline">
                                        {selectedRow.user?.name || "N/A"}
                                    </Link>
                                ) : "N/A"}</p>
                                <p><strong className="font-semibold text-indigo-500 dark:text-indigo-300">Category:</strong> {selectedRow?.category_id ? (
                                    <Link href={route("categories.show", selectedRow.category_id)} className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline">
                                        {selectedRow.category?.name || "N/A"}
                                    </Link>
                                ) : "N/A"}</p>
                                <p><strong className="font-semibold text-indigo-500 dark:text-indigo-300">Subcategory:</strong> {selectedRow?.subcategory_id ? (
                                    <Link href={route("subcategories.show", selectedRow.subcategory_id)} className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline">
                                        {selectedRow.subcategory?.name || "N/A"}
                                    </Link>
                                ) : "N/A"}</p>
                                <p><strong className="font-semibold text-indigo-500 dark:text-indigo-300">Grade:</strong> {selectedRow?.grade?.name || "N/A"}</p>
                                <p><strong className="font-semibold text-indigo-500 dark:text-indigo-300">Subject:</strong> {selectedRow?.subject?.name || "N/A"}</p>
                                <p><strong className="font-semibold text-indigo-500 dark:text-indigo-300">Bookcase:</strong> {selectedRow?.bookcase_id ? (
                                    <Link href={route("bookcases.show", selectedRow.bookcase_id)} className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline">
                                        {selectedRow.bookcase?.code || "N/A"}
                                    </Link>
                                ) : "N/A"}</p>
                                <p><strong className="font-semibold text-indigo-500 dark:text-indigo-300">Shelf:</strong> {selectedRow?.shelf_id ? (
                                    <Link href={route("shelves.show", selectedRow.shelf_id)} className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline">
                                        {selectedRow.shelf?.code || "N/A"}
                                    </Link>
                                ) : "N/A"}</p>
                                <p><strong className="font-semibold text-indigo-500 dark:text-indigo-300">Cover:</strong> {selectedRow?.cover ? (
                                    <img src={selectedRow.cover} alt="Cover" className="max-w-[40%] h-auto rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200" onClick={() => { setImageModalOpen(true); setImageUrl(selectedRow.cover); }} />
                                ) : "N/A"}</p>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Image Modal */}
                <Dialog open={imageModalOpen} onOpenChange={setImageModalOpen}>
                    <DialogContent className="max-w-2xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-indigo-900 text-gray-800 dark:text-gray-100 border border-indigo-200 dark:border-indigo-700 rounded-2xl shadow-2xl p-6 transition-all duration-300">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold text-indigo-600 dark:text-indigo-300">Book Cover</DialogTitle>
                        </DialogHeader>
                        {imageUrl && (
                            <img
                                src={imageUrl}
                                alt="Enlarged Cover"
                                className="w-full h-auto rounded-lg shadow-md"
                            />
                        )}
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setImageModalOpen(false)}
                                className="bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 border-indigo-200 dark:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-800"
                            >
                                Close
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* PDF Preview Modal */}
                <Dialog open={pdfModalOpen} onOpenChange={setPdfModalOpen}>
                    <DialogContent className="max-w-4xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-indigo-900 text-gray-800 dark:text-gray-100 border border-indigo-200 dark:border-indigo-700 rounded-2xl shadow-2xl p-6 transition-all duration-300">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold text-indigo-600 dark:text-indigo-300">PDF Preview</DialogTitle>
                        </DialogHeader>
                        {pdfUrl ? (
                            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                                <Viewer fileUrl={pdfUrl} plugins={[defaultLayoutPluginInstance]} />
                            </Worker>
                        ) : (
                            <p className="text-red-500 dark:text-red-400">No PDF available</p>
                        )}
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setPdfModalOpen(false)}
                                className="bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 border-indigo-200 dark:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-800"
                            >
                                Close
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <AlertDialog open={!!bookToDelete} onOpenChange={(openState) => !openState && setBookToDelete(null)}>
                    <AlertDialogContent className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-indigo-900 text-gray-800 dark:text-gray-100 border border-indigo-200 dark:border-indigo-700 rounded-2xl shadow-2xl">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-indigo-600 dark:text-indigo-300">Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
                                This action cannot be undone. This will permanently delete{" "}
                                <strong>{bookToDelete?.title || "this book"}</strong>.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setBookToDelete(null)} className="bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 border-indigo-200 dark:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-800">
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction onClick={confirmDelete} disabled={processing} className="bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700">
                                Continue
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AppLayout>
    );
}
