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
import { Pencil, ArrowLeft, Building2 } from "lucide-react";
import { translations } from "@/utils/translations/building/building";

interface Campus {
    id: number;
    name: string;
}

interface Building {
    id: number;
    campus_id: number;
    name: string;
    code: string;
    floors: number;
    campus: Campus;
    created_at: string;
    updated_at: string;
}

interface BuildingsShowProps {
    building: Building;
    isSuperLibrarian?: boolean;
    lang?: "kh" | "en";
}

/* -------------------------------------------------------------
   Common UI tokens – identical to Schools/Show
   ------------------------------------------------------------- */
const commonStyles = {
    button:
        "rounded-lg text-sm font-medium transition-all duration-300 ease-in-out hover:scale-105 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
    indigoButton:
        "bg-indigo-500 text-white hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 shadow-lg hover:shadow-xl",
    outlineButton:
        "bg-transparent dark:bg-transparent text-indigo-500 dark:text-indigo-400 border-2 border-indigo-400 dark:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 shadow-sm",
    gradientBg:
        "bg-gradient-to-br from-blue-50/50 to-indigo-100/50 dark:from-gray-900/50 dark:to-indigo-950/50",
    card:
        "bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-800",
};

export default function BuildingsShow({
                                          building,
                                          isSuperLibrarian = false,
                                          lang = "kh",
                                      }: BuildingsShowProps) {
    const t = translations["kh"];

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t.indexTitle ?? "Buildings", href: route("buildings.index") },
        { title: t.showTitle ?? "View Building", href: "" },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t.showTitle ?? "View Building"} />

            {/* Page container – same gradient as Create/Edit */}
            <div className={`min-h-screen p-6 lg:p-8 ${commonStyles.gradientBg}`}>
                <div className="max-w-1xl mx-auto">
                    <div className={`${commonStyles.card} p-6 lg:p-8`}>
                        {/* Header */}
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 tracking-tight mb-8 flex items-center gap-3">
                            <Building2 className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                            {t.showTitle ?? "View Building"}
                        </h1>

                        {/* Details Card */}
                        <Card className="mb-6 bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800">
                            <CardContent className="p-6 space-y-5">
                                {/* Campus */}
                                <div>
                                    <strong className="text-indigo-600 dark:text-indigo-300">
                                        {t.showCampus ?? "Campus"}:
                                    </strong>{" "}
                                    {building.campus.name}
                                </div>

                                {/* Name */}
                                <div>
                                    <strong className="text-indigo-600 dark:text-indigo-300">
                                        {t.showName ?? "Building Name"}:
                                    </strong>{" "}
                                    {building.name}
                                </div>

                                {/* Code */}
                                <div>
                                    <strong className="text-indigo-600 dark:text-indigo-300">
                                        {t.showCode ?? "Code"}:
                                    </strong>{" "}
                                    {building.code}
                                </div>

                                {/* Floors */}
                                <div>
                                    <strong className="text-indigo-600 dark:text-indigo-300">
                                        {t.showFloors ?? "Floors"}:
                                    </strong>{" "}
                                    {building.floors}
                                </div>

                                {/* Created At */}
                                <div>
                                    <strong className="text-indigo-600 dark:text-indigo-300">
                                        {t.showCreatedAt ?? "Created"}:
                                    </strong>{" "}
                                    {new Date(building.created_at).toLocaleDateString(
                                        lang === "kh" ? "km-KH" : "en-US",
                                        { year: "numeric", month: "long", day: "numeric",hour:"numeric",minute:"numeric",second:"numeric", hour12: false }
                                    )}
                                </div>

                                {/* Updated At */}
                                <div>
                                    <strong className="text-indigo-600 dark:text-indigo-300">
                                        {t.showUpdatedAt ?? "Updated"}:
                                    </strong>{" "}
                                    {new Date(building.updated_at).toLocaleDateString(
                                        lang === "kh" ? "km-KH" : "en-US",
                                        { year: "numeric", month: "long", day: "numeric",hour:"numeric",minute:"numeric",second:"numeric", hour12: false }
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-4 mt-8">
                            {/* Edit – only for super‑librarian */}
                            {isSuperLibrarian && (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link href={route("buildings.edit", building.id)}>
                                                <Button
                                                    className={`${commonStyles.button} ${commonStyles.indigoButton} px-6 py-2.5 flex items-center`}
                                                >
                                                    <Pencil className="h-5 w-5 mr-2" />
                                                    {t.showEditButton ?? "Edit"}
                                                </Button>
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-indigo-600 text-white rounded-lg p-2">
                                            {t.showEditTooltip ?? "Edit this building"}
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}

                            {/* Back to list */}
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link href={route("buildings.index")}>
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
