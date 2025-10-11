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

interface Bookcase {
    id: number;
    code: string;
}

interface ShelvesCreateProps {
    bookcases: Bookcase[];
    flash?: {
        message?: string;
    };
    lang?: "kh" | "en";
}

const translations = {
    kh: {
        title: "បង្កើតធ្នើរសៀវភៅ",
        shelfCode: "លេខកូដធ្នើរសៀវភៅ",
        shelfCodeTooltip: "បញ្ចូលលេខកូដសម្រាប់ធ្នើរសៀវភៅថ្មី",
        shelfCodePlaceholder: "បញ្ចូលលេខកូដធ្នើរសៀវភៅ",
        bookcase: "ទូសៀវភៅ",
        bookcaseTooltip: "ស្វែងរក និងជ្រើសរើសទូសៀវភៅសម្រាប់ធ្នើរនេះ",
        bookcasePlaceholder: "ជ្រើសរើសទូសៀវភៅ",
        bookcaseNone: "គ្មាន",
        bookcaseEmpty: "រកមិនឃើញទូសៀវភៅទេ",
        create: "បង្កើត",
        creating: "កំពុងបង្កើត...",
        createTooltip: "រក្សាទុកធ្នើរសៀវភៅថ្មី",
        cancel: "បោះបង់",
        cancelTooltip: "ត្រឡប់ទៅបញ្ជីធ្នើរសៀវភៅ",
        error: "កំហុស",
        notification: "ការជូនដំណឹង",
    },
    en: {
        title: "Create Shelf",
        shelfCode: "Shelf Code",
        shelfCodeTooltip: "Enter the code for the new shelf",
        shelfCodePlaceholder: "Enter shelf code",
        bookcase: "Bookcase",
        bookcaseTooltip: "Search and select the bookcase for this shelf",
        bookcasePlaceholder: "Select a bookcase",
        bookcaseNone: "None",
        bookcaseEmpty: "No bookcases found",
        create: "Create",
        creating: "Creating...",
        createTooltip: "Save the new shelf",
        cancel: "Cancel",
        cancelTooltip: "Return to the shelves list",
        error: "Error",
        notification: "Notification",
    },
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "ធ្នើរសៀវភៅ",
        href: route("shelves.index"),
    },
    {
        title: "បង្កើត",
        href: "",
    },
];

export default function ShelvesCreate({ bookcases, flash, lang = "kh" }: ShelvesCreateProps) {
    const t = translations[lang];
    const { data, setData, post, processing, errors } = useForm({
        code: "",
        bookcase_id: "none",
    });
    const [showErrorAlert, setShowErrorAlert] = useState(!!Object.keys(errors).length);
    const [showSuccessAlert, setShowSuccessAlert] = useState(!!flash?.message);
    const [openBookcase, setOpenBookcase] = useState(false);

    useEffect(() => {
        setShowErrorAlert(!!Object.keys(errors).length);
        if (flash?.message) setShowSuccessAlert(true);
    }, [errors, flash?.message]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("shelves.store"), {
            data,
            onSuccess: () => {
                setData({ code: "", bookcase_id: "none" });
                setShowErrorAlert(false);
            },
            onError: () => {
                setShowErrorAlert(true);
            },
        });
    };

    const handleCloseErrorAlert = () => setShowErrorAlert(false);
    const handleCloseSuccessAlert = () => setShowSuccessAlert(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t.title} />
            <div className="min-h-screen p-6 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <div className="max-w-1xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
                    <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-8">
                        {t.title}
                    </h1>
                    {showSuccessAlert && flash?.message && (
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
                                    onClick={handleCloseSuccessAlert}
                                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 bg-transparent hover:bg-blue-100 dark:hover:bg-blue-800/50 p-1 rounded-full"
                                    disabled={processing}
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                        </Alert>
                    )}
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
                                    onClick={handleCloseErrorAlert}
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
                                htmlFor="code"
                                className="text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                {t.shelfCode}
                            </label>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Input
                                            id="code"
                                            maxLength={10}
                                            value={data.code}
                                            onChange={(e) => setData("code", e.target.value)}
                                            placeholder={t.shelfCodePlaceholder}
                                            className={`w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border ${
                                                errors.code
                                                    ? "border-red-500 dark:border-red-400"
                                                    : "border-gray-300 dark:border-gray-600"
                                            } focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all duration-300 ease-in-out`}
                                            disabled={processing}
                                            aria-invalid={!!errors.code}
                                            aria-describedby={errors.code ? "code-error" : undefined}
                                        />
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-indigo-600 text-white rounded-lg p-2">
                                        {t.shelfCodeTooltip}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            {errors.code && (
                                <p id="code-error" className="text-red-500 dark:text-red-400 text-sm mt-1">
                                    {errors.code}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label
                                htmlFor="bookcase_id"
                                className="text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                {t.bookcase}
                            </label>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Popover open={openBookcase} onOpenChange={setOpenBookcase}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={openBookcase}
                                                    className={`w-full justify-between px-4 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border ${
                                                        errors.bookcase_id
                                                            ? "border-red-500 dark:border-red-400"
                                                            : "border-gray-300 dark:border-gray-600"
                                                    } focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all duration-300 ease-in-out`}
                                                    disabled={processing}
                                                >
                                                    {data.bookcase_id !== "none"
                                                        ? bookcases.find((bookcase) => bookcase.id.toString() === data.bookcase_id)?.code
                                                        : t.bookcasePlaceholder}
                                                    <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-full p-0 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
                                                <Command>
                                                    <CommandInput placeholder={t.bookcasePlaceholder} className="h-10" />
                                                    <CommandList>
                                                        <CommandEmpty>{t.bookcaseEmpty}</CommandEmpty>
                                                        <CommandGroup>
                                                            <CommandItem
                                                                value="none"
                                                                onSelect={() => {
                                                                    setData("bookcase_id", "none");
                                                                    setOpenBookcase(false);
                                                                }}
                                                            >
                                                                {t.bookcaseNone}
                                                            </CommandItem>
                                                            {bookcases.map((bookcase) => (
                                                                <CommandItem
                                                                    key={bookcase.id}
                                                                    value={bookcase.code}
                                                                    onSelect={() => {
                                                                        setData("bookcase_id", bookcase.id.toString());
                                                                        setOpenBookcase(false);
                                                                    }}
                                                                >
                                                                    {bookcase.code}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-indigo-600 text-white rounded-lg p-2">
                                        {t.bookcaseTooltip}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            {errors.bookcase_id && (
                                <p id="bookcase-error" className="text-red-500 dark:text-red-400 text-sm mt-1">
                                    {errors.bookcase_id}
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
                                        <Link href={route("shelves.index")}>
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
