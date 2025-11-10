"use client";

import AppLayout from "@/layouts/app-layout";
import { Head, Link } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit } from "lucide-react";
import { translations } from "@/utils/translations/supplier/supplier";

interface Supplier {
    id: number;
    name: string;
    contact_person: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
    created_at: string;
    updated_at: string;
}

interface SuppliersShowProps {
    supplier: Supplier;
    lang?: "kh" | "en";
}

export default function SuppliersShow({ supplier, lang = "en" }: SuppliersShowProps) {
    const t = translations[lang] || translations.en;

    return (
        <AppLayout breadcrumbs={[
            { title: t.indexTitle, href: route("suppliers.index") },
            { title: t.showTitle, href: "" },
        ]}>
            <Head title={t.showTitle} />
            <div className="p-6">
                <div className="max-w-1xl mx-auto">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle>{supplier.name}</CardTitle>
                                    <CardDescription>{t.showTitle}</CardDescription>
                                </div>
                                <div className="space-x-2">
                                    <Button asChild>
                                        <Link href={route("suppliers.edit", supplier.id)}>
                                            <Edit className="h-4 w-4 mr-2" />
                                            {t.editBreadcrumb}
                                        </Link>
                                    </Button>
                                    <Button variant="outline" asChild>
                                        <Link href={route("suppliers.index")}>
                                            <ArrowLeft className="h-4 w-4 mr-2" />
                                            {t.showBack}
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-gray-500">{t.contact_person}</p>
                                <p className="mt-1">{supplier.contact_person || "—"}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">{t.phone}</p>
                                <p className="mt-1">{supplier.phone || "—"}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">{t.email}</p>
                                <p className="mt-1">{supplier.email || "—"}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">{t.address}</p>
                                <p className="mt-1 whitespace-pre-wrap">{supplier.address || "—"}</p>
                            </div>
                            <div className="pt-4 border-t text-sm text-gray-500">
                                <p>Created: {new Date(supplier.created_at).toLocaleString()}</p>
                                <p>Updated: {new Date(supplier.updated_at).toLocaleString()}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
