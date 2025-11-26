"use client";

import { Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Pencil, ArrowLeft, Building2, User } from "lucide-react";
import { translations } from "@/utils/translations/department/department";

interface Department {
    id: number;
    campus: { id: number; name: string };
    building: { id: number; name: string } | null;
    name: string;
    code: string;
    head: { id: number; name: string } | null;
    created_at: string;
    updated_at: string;
}

interface DepartmentsShowProps {
    department: Department;
    isSuperLibrarian?: boolean;
    lang?: "kh" | "en";
}

const commonStyles = {
    gradientBg: "bg-gradient-to-br from-blue-50/50 to-indigo-100/50 dark:from-gray-900/50 dark:to-indigo-950/50",
    card: "bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-800",
    button: "rounded-lg text-sm font-medium transition-all duration-300 ease-in-out hover:scale-105",
    indigoButton: "bg-indigo-500 text-white hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 shadow-lg hover:shadow-xl",
    outlineButton: "bg-transparent text-indigo-500 dark:text-indigo-400 border-2 border-indigo-400 dark:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30",
};

export default function DepartmentsShow({
                                            department,
                                            isSuperLibrarian = false,
                                            lang = "kh",
                                        }: DepartmentsShowProps) {
    const t = translations["kh"];

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t.indexTitle ?? "Departments", href: route("departments.index") },
        { title: t.showTitle ?? "View Department", href: "" },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t.showTitle ?? "View Department"} />

            <div className={`min-h-screen p-6 lg:p-8 ${commonStyles.gradientBg}`}>
                <div className="max-w-1xl mx-auto">
                    <div className={`${commonStyles.card} p-6 lg:p-8`}>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 tracking-tight mb-8 flex items-center gap-3">
                            <Building2 className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                            {t.showTitle ?? "View Department"}
                        </h1>

                        <Card className="mb-6 bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800">
                            <CardContent className="p-6 space-y-5">
                                <div>
                                    <strong className="text-indigo-600 dark:text-indigo-300">{t.showCampus ?? "Campus"}:</strong>{" "}
                                    <Link href={route("campuses.show", department.campus.id)} className="text-indigo-600 hover:underline">
                                        {department.campus.name}
                                    </Link>
                                </div>

                                <div>
                                    <strong className="text-indigo-600 dark:text-indigo-300">{t.showBuilding ?? "Building"}:</strong>{" "}
                                    {department.building ? (
                                        <Link href={route("buildings.show", department.building.id)} className="text-indigo-600 hover:underline">
                                            {department.building.name}
                                        </Link>
                                    ) : (
                                        "—"
                                    )}
                                </div>

                                <div>
                                    <strong className="text-indigo-600 dark:text-indigo-300">{t.showName ?? "Name"}:</strong>{" "}
                                    {department.name}
                                </div>

                                <div>
                                    <strong className="text-indigo-600 dark:text-indigo-300">{t.showCode ?? "Code"}:</strong>{" "}
                                    <span className="font-mono">{department.code}</span>
                                </div>

                                <div>
                                    <strong className="text-indigo-600 dark:text-indigo-300">{t.showHead ?? "Head"}:</strong>{" "}
                                    {department.head ? (
                                        <Link
                                            href={route("users.show", department.head.id)}
                                            className="text-indigo-600 hover:underline font-medium"
                                        >
                                            {department.head.name}
                                        </Link>
                                    ) : (
                                        "—"
                                    )}
                                </div>

                                <div>
                                    <strong className="text-indigo-600 dark:text-indigo-300">{t.showCreatedAt ?? "Created"}:</strong>{" "}
                                    {new Date(department.created_at).toLocaleDateString(
                                        lang === "kh" ? "km-KH" : "en-US",
                                        { year: "numeric", month: "long", day: "numeric" }
                                    )}
                                </div>

                                <div>
                                    <strong className="text-indigo-600 dark:text-indigo-300">{t.showUpdatedAt ?? "Updated"}:</strong>{" "}
                                    {new Date(department.updated_at).toLocaleDateString(
                                        lang === "kh" ? "km-KH" : "en-US",
                                        { year: "numeric", month: "long", day: "numeric" }
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex justify-end gap-4 mt-8">
                            {isSuperLibrarian && (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link href={route("departments.edit", department.id)}>
                                                <Button className={`${commonStyles.button} ${commonStyles.indigoButton} px-6 py-2.5 flex items-center`}>
                                                    <Pencil className="h-5 w-5 mr-2" />
                                                    {t.showEditButton ?? "Edit"}
                                                </Button>
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-indigo-600 text-white rounded-lg p-2">
                                            {t.showEditTooltip ?? "Edit this department"}
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link href={route("departments.index")}>
                                            <Button
                                                variant="outline"
                                                className={`${commonStyles.button} ${commonStyles.outlineButton} px-6 py-2.5 flex items-center`}
                                            >
                                                <ArrowLeft className="h-5 w-5 mr-2" />
                                                {t.showBack ?? "Back"}
                                            </Button>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-indigo-600 text-white rounded-lg p-2">
                                        {t.showBackTooltip ?? "Return to list"}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
