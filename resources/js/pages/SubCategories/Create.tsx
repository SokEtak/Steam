"use client";

import { useState, useEffect } from "react";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head, useForm, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { CheckCircle2Icon, X, ChevronDown } from "lucide-react";

interface Category {
    id: number;
    name: string;
}

interface SubcategoriesCreateProps {
    categories: Category[];
    lang?: "kh" | "en";
}

const translations = {
    kh: {
        title: "បង្កើតប្រភេទរង",
        subcategoryName: "ឈ្មោះប្រភេទរង",
        subcategoryNameTooltip: "បញ្ចូលឈ្មោះប្រភេទរងថ្មី",
        subcategoryNamePlaceholder: "បញ្ចូលឈ្មោះប្រភេទរង",
        category: "ប្រភេទ",
        categoryTooltip: "ស្វែងរក និងជ្រើសរើសប្រភេទមេសម្រាប់ប្រភេទរងនេះ",
        categoryPlaceholder: "ជ្រើសរើសប្រភេទ",
        categoryNone: "គ្មាន",
        categoryEmpty: "រកមិនឃើញប្រភេទទេ",
        create: "បង្កើត",
        creating: "កំពុងបង្កើត...",
        createTooltip: "រក្សាទុកប្រភេទរងថ្មី",
        cancel: "បោះបង់",
        cancelTooltip: "ត្រឡប់ទៅបញ្ជីប្រភេទរង",
        error: "កំហុស",
    },
    en: {
        title: "Create Subcategory",
        subcategoryName: "Subcategory Name",
        subcategoryNameTooltip: "Enter the name of the new subcategory",
        subcategoryNamePlaceholder: "Enter subcategory name",
        category: "Category",
        categoryTooltip: "Search and select the parent category for this subcategory",
        categoryPlaceholder: "Select a category",
        categoryNone: "None",
        categoryEmpty: "No categories found",
        create: "Create",
        creating: "Creating...",
        createTooltip: "Save the new subcategory",
        cancel: "Cancel",
        cancelTooltip: "Return to the subcategories list",
        error: "Error",
    },
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "ប្រភេទរង",
        href: route("subcategories.index"),
    },
    {
        title: "បង្កើត",
        href: "",
    },
];

export default function SubcategoriesCreate({ categories, lang = "kh" }: SubcategoriesCreateProps) {
    const t = translations[lang];
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        category_id: "none",
    });
    const [showErrorAlert, setShowErrorAlert] = useState(!!Object.keys(errors).length);
    const [openCategory, setOpenCategory] = useState(false);

    useEffect(() => {
        setShowErrorAlert(!!Object.keys(errors).length);
    }, [errors]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("subcategories.store"), {
            data,
            onSuccess: () => {
                setData({ name: "", category_id: "none" });
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
            <Head title={t.title} />
            <div className="min-h-screen p-6 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <div className="max-w-1xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
                    <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-8">
                        {t.title}
                    </h1>
                    {showErrorAlert && Object.keys(errors).length > 0 && (
                        <Alert className="mb-6 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-700 rounded-lg">
                            <div className="flex items-start justify-between">
                                <div className="flex gap-3">
                                    <CheckCircle2Icon className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                                    <div>
                                        <AlertTitle className="text-red-600 dark:text-red-400 font-semibold">
                                            {t.error}
                                        </AlertTitle>
                                        <AlertDescription className="text-red-600 dark:text-red-400">
                                            {Object.values(errors).join(", ")}
                                        </AlertDescription>
                                    </div>
                                </div>
                                <Button
                                    onClick={handleCloseAlert}
                                    className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 bg-transparent hover:bg-red-100 dark:hover:bg-red-800/50 p-1 rounded-full"
                                    disabled={processing}
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                        </Alert>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label
                                htmlFor="name"
                                className="text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                {t.subcategoryName}
                            </label>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Input
                                            id="name"
                                            maxLength={100}
                                            value={data.name}
                                            onChange={(e) => setData("name", e.target.value)}
                                            placeholder={t.subcategoryNamePlaceholder}
                                            className={`w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border ${
                                                errors.name
                                                    ? "border-red-500 dark:border-red-400"
                                                    : "border-gray-300 dark:border-gray-600"
                                            } focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all duration-300 ease-in-out`}
                                            disabled={processing}
                                            aria-invalid={!!errors.name}
                                            aria-describedby={errors.name ? "name-error" : undefined}
                                        />
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-indigo-600 text-white rounded-lg p-2">
                                        {t.subcategoryNameTooltip}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            {errors.name && (
                                <p id="name-error" className="text-red-500 dark:text-red-400 text-sm mt-1">
                                    {errors.name}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label
                                htmlFor="category_id"
                                className="text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                {t.category}
                            </label>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Popover open={openCategory} onOpenChange={setOpenCategory}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={openCategory}
                                                    className={`w-full justify-between px-4 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border ${
                                                        errors.category_id
                                                            ? "border-red-500 dark:border-red-400"
                                                            : "border-gray-300 dark:border-gray-600"
                                                    } focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all duration-300 ease-in-out`}
                                                    disabled={processing}
                                                >
                                                    {data.category_id !== "none"
                                                        ? categories.find((category) => category.id.toString() === data.category_id)?.name
                                                        : t.categoryPlaceholder}
                                                    <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-full p-0 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
                                                <Command>
                                                    <CommandInput placeholder={t.categoryPlaceholder} className="h-10" />
                                                    <CommandList>
                                                        <CommandEmpty>{t.categoryEmpty}</CommandEmpty>
                                                        <CommandGroup>
                                                            <CommandItem
                                                                value="none"
                                                                onSelect={() => {
                                                                    setData("category_id", "none");
                                                                    setOpenCategory(false);
                                                                }}
                                                            >
                                                                {t.categoryNone}
                                                            </CommandItem>
                                                            {categories.map((category) => (
                                                                <CommandItem
                                                                    key={category.id}
                                                                    value={category.name}
                                                                    onSelect={() => {
                                                                        setData("category_id", category.id.toString());
                                                                        setOpenCategory(false);
                                                                    }}
                                                                >
                                                                    {category.name}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-indigo-600 text-white rounded-lg p-2">
                                        {t.categoryTooltip}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            {errors.category_id && (
                                <p id="category-error" className="text-red-500 dark:text-red-400 text-sm mt-1">
                                    {errors.category_id}
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
                                            className="bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 px-6 py-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                                        >
                                            {processing ? t.creating : t.create}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-indigo-600 text-white rounded-lg p-2">
                                        {t.createTooltip}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link href={route("subcategories.index")}>
                                            <Button
                                                variant="outline"
                                                className="bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 border-gray-300 dark:border-gray-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 px-6 py-2 rounded-lg transition-all duration-300 ease-in-out"
                                                disabled={processing}
                                            >
                                                {t.cancel}
                                            </Button>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-indigo-600 text-white rounded-lg p-2">
                                        {t.cancelTooltip}
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
