"use client";

import { Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Pencil } from "lucide-react";
import { translations } from "@/utils/translations/school/school";

interface School {
    id: number;
    name: string;
    code: string;
    address: string;
    contact: string;
    email: string;
    website: string | null;
    created_at: string;
    updated_at: string;
}

interface SchoolsShowProps {
    school: School;
    isSuperLibrarian?: boolean;
    lang?: "kh" | "en";
}

const commonStyles = {
    button: "rounded-lg text-sm font-medium transition-all duration-300 ease-in-out hover:scale-105 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
    text: "text-gray-800 dark:text-gray-100 text-sm",
    indigoButton: "bg-indigo-500 text-white hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 shadow-lg hover:shadow-xl",
    outlineButton: "bg-transparent dark:bg-transparent text-indigo-500 dark:text-indigo-400 border-2 border-indigo-400 dark:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 shadow-sm",
    gradientBg: "bg-gradient-to-br from-blue-50/50 to-indigo-100/50 dark:from-gray-900/50 dark:to-indigo-950/50",
    card: "bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-800",
};

export default function SchoolsShow({
                                        school,
                                        isSuperLibrarian = false,
                                        lang = "kh",
                                    }: SchoolsShowProps) {
    const t = translations["kh"];

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t.indexTitle || "Schools", href: route("schools.index") },
        { title: t.showTitle || "View School", href: "" },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t.showTitle || "View School"} />
            <div className={`p-6 lg:p-4 ${commonStyles.gradientBg} min-h-screen`}>
                <div className="max-w-1xl mx-auto">
                    <div className={`${commonStyles.card} p-6 lg:p-8`}>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 tracking-tight mb-8">
                            {t.showTitle || "View School"}
                        </h1>

                        <Card className="mb-6 bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800">
                            <CardContent className="p-6 space-y-4">
                                <div>
                                    <strong className="text-indigo-600 dark:text-indigo-300">{t.showName || "Name"}:</strong> {school.name}
                                </div>
                                <div>
                                    <strong className="text-indigo-600 dark:text-indigo-300">{t.indexCode || "Code"}:</strong> {school.code}
                                </div>
                                <div>
                                    <strong className="text-indigo-600 dark:text-indigo-300">{t.indexEmail || "Email"}:</strong> {school.email}
                                </div>
                                <div>
                                    <strong className="text-indigo-600 dark:text-indigo-300">{t.createContact || "Contact"}:</strong> {school.contact}
                                </div>
                                <div>
                                    <strong className="text-indigo-600 dark:text-indigo-300">{t.createWebsite || "Website"}:</strong>{" "}
                                    {school.website ? (
                                        <a href={school.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline">
                                            {school.website}
                                        </a>
                                    ) : (
                                        "-"
                                    )}
                                </div>
                                <div>
                                    <strong className="text-indigo-600 dark:text-indigo-300">{t.createAddress || "Address"}:</strong>
                                    <p className="mt-1 whitespace-pre-wrap">{school.address}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex justify-end space-x-4 mt-8">
                            {/*{isSuperLibrarian && (*/}
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link href={route("schools.edit", school.id)}>
                                                <Button className={`${commonStyles.button} ${commonStyles.indigoButton} px-6 py-2.5`}>
                                                    <Pencil className="h-5 w-5" />
                                                    {t.showEditButton || "Edit"}
                                                </Button>
                                            </Link>
                                        </TooltipTrigger>
                                    </Tooltip>
                                </TooltipProvider>
                            {/*)}*/}

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link href={route("schools.index")}>
                                            <Button
                                                variant="outline"
                                                className={`${commonStyles.button} ${commonStyles.outlineButton} px-6 py-2.5`}
                                            >
                                                {t.showBack || "Back"}
                                            </Button>
                                        </Link>
                                    </TooltipTrigger>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
