"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Head, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";

interface Book {
    id: number;
    title: string;
    author: string;
    description: string;
    cover?: string | null;
    type: string;
    flip_link?: string | null;
    category: { id: number; name: string };
    is_available: boolean;
}

interface AuthUser {
    name: string;
    email: string;
}

interface PageProps {
    flash: { message?: string };
    books: Book[];
    auth: { user: AuthUser };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: "Books Library", href: "/books" },
];

export default function BookIndex() {
    const { books, flash, auth } = usePage<PageProps>().props;

    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("All");
    const [filterCategory, setFilterCategory] = useState("All");

    // Unique categories
    const categories = useMemo(() => Array.from(new Set(books.map((b) => b.category.name))), [books]);

    // Filtered books
    const filteredBooks = useMemo(() => {
        return books.filter((book) => {
            const matchesSearch =
                book.title.toLowerCase().includes(search.toLowerCase()) ||
                book.author.toLowerCase().includes(search.toLowerCase());
            const matchesType = filterType === "All" || book.type === filterType;
            const matchesCategory = filterCategory === "All" || book.category.name === filterCategory;
            return matchesSearch && matchesType && matchesCategory;
        });
    }, [books, search, filterType, filterCategory]);

    return (
        <AppLayout breadcrumbs={breadcrumbs} user={auth.user}>
            <Head title="Books Library" />

            <div className="p-6 space-y-6 bg-background text-foreground min-h-screen transition-colors duration-300">
                {/* Flash message */}
                {flash.message && (
                    <div className="p-4 bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100 rounded-md shadow">
                        {flash.message}
                    </div>
                )}

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-4">
                    <Input
                        placeholder="Search by title or author"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-grow max-w-md border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
                    />

                    <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Types</SelectItem>
                            <SelectItem value="physical">Physical</SelectItem>
                            <SelectItem value="ebook">E-Book</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Categories</SelectItem>
                            {categories.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                    {cat}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Book Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredBooks.length > 0 ? (
                        filteredBooks.map((book) => (
                            <div
                                key={book.id}
                                className="flex flex-col bg-card-background rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden"
                            >
                                <div className="h-52 w-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                                    <img
                                        src={book.cover || "/default-cover.png"}
                                        alt={book.title}
                                        className="w-full h-full object-cover object-center"
                                    />
                                </div>
                                <div className="p-4 flex flex-col flex-grow">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">{book.title}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{book.author}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{book.category.name}</p>
                                    <p className={`mt-2 text-xs font-medium ${book.is_available ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                                        {book.is_available ? "Available" : "Unavailable"}
                                    </p>
                                    {book.flip_link && (
                                        <a
                                            href={book.flip_link}
                                            target="_blank"
                                            className="mt-auto text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
                                        >
                                            Open Link
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400 col-span-full">
                            No books found.
                        </p>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
