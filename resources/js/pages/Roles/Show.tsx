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
import { Pencil } from "lucide-react";
import { translations } from "@/utils/translations/role/role";

interface Permission {
    id: number;
    name: string;
}

interface Role {
    id: number;
    name: string;
    permissions: Permission[];
}

interface RolesShowProps {
    role: Role;
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
    input: "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg focus:ring-indigo-500 focus:border-indigo-500",
    error: "text-red-500 dark:text-red-400 text-sm mt-1",
};

export default function RolesShow({
                                      role,
                                      isSuperLibrarian = false,
                                      lang = "kh",
                                  }: RolesShowProps) {
    const t = translations[lang] || translations.en;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t.indexTitle || "Roles", href: route("roles.index") },
        { title: t.showBreadcrumb || "View Role", href: "" },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t.showTitle || "View Role"} />
            <div className={`p-6 lg:p-4 ${commonStyles.gradientBg} min-h-screen`}>
                <div className="max-w-1xl mx-auto">
                    <div className={`${commonStyles.card} p-6 lg:p-8`}>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 tracking-tight mb-8">
                            {t.showTitle || "View Role"}
                        </h1>
                        <Card className="mb-6 bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800">
                            <CardContent className="p-6">
                                <h2 className="text-xl font-medium text-gray-900 dark:text-gray-50 mb-4">
                                    {t.showName || "Role Name"}: {role.name}
                                </h2>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-50 mb-2">
                                    {t.showPermissions || "Permissions"} ({role.permissions.length})
                                </h3>
                                {role.permissions && role.permissions.length > 0 ? (
                                    <ul className="list-disc list-inside space-y-2 text-base text-gray-700 dark:text-gray-200">
                                        {role.permissions.map((permission) => (
                                            <li key={permission.id} className="whitespace-nowrap">
                                                {permission.name}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-base text-gray-600 dark:text-gray-300">
                                        {t.indexNoPermissions || "No Permissions"}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                        <div className="flex justify-end space-x-4 mt-8">
                            {isSuperLibrarian && (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link href={route("roles.edit", role.id)}>
                                                <Button className={`${commonStyles.button} ${commonStyles.indigoButton} px-6 py-2.5`}>
                                                    <Pencil className="h-5 w-5 mr-2" />
                                                    {t.showEditButton || "Edit"}
                                                </Button>
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-indigo-600 text-white rounded-lg p-2">
                                            {t.showEditTooltip || "Edit this pms"}
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link href={route("roles.index")}>
                                            <Button
                                                variant="outline"
                                                className={`${commonStyles.button} ${commonStyles.outlineButton} px-6 py-2.5`}
                                            >
                                                {t.showBack || "Back"}
                                            </Button>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-indigo-600 text-white rounded-lg p-2">
                                        {t.showBackTooltip || "Return to roles list"}
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
