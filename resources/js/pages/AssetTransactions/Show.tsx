// resources/js/Pages/AssetTransactions/Show.tsx
"use client";

import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Package, User, Building2, DoorOpen, CalendarDays, Clock, StickyNote, ArrowRightCircle } from "lucide-react";
import { Link } from "@inertiajs/react";

interface AssetTransaction {
    id: number;
    asset: { id: number; name: string };
    type: string;
    from_department?: { id: number; name: string } | null;
    to_department?: { id: number; name: string } | null;
    from_room?: { id: number; name: string } | null;
    to_room?: { id: number; name: string } | null;
    performer: { id: number; name: string };
    performed_at: string;
    note?: string | null;
    created_at: string;
}

interface Props {
    assetTransaction: AssetTransaction;
}

const TypeBadge = ({ type }: { type: string }) => {
    const labels: Record<string, string> = {
        received: "ទទួល",
        allocated: "ចែកចាយ",
        returned: "ប្រគល់វិញ",
        transfer: "ផ្ទេរ",
        maintenance_start: "ចាប់ផ្ដើមជួសជុល",
        maintenance_end: "បញ្ចប់ជួសជុល",
        disposed: "បោះចោល",
    };

    const colors: Record<string, string> = {
        received: "bg-sky-500 text-white",
        allocated: "bg-emerald-500 text-white",
        returned: "bg-violet-500 text-white",
        transfer: "bg-amber-500 text-white",
        maintenance_start: "bg-orange-500 text-white",
        maintenance_end: "bg-zinc-600 text-white",
        disposed: "bg-rose-600 text-white",
    };

    return (
        <Badge className={`${colors[type] || "bg-gray-600"} font-bold px-5 py-2 text-base rounded-full shadow-lg`}>
            {labels[type] || type.replace(/_/g, " ")}
        </Badge>
    );
};

export default function AssetTransactionsShow({ assetTransaction }: Props) {
    const performedAt = new Date(assetTransaction.performed_at);
    const createdAt = new Date(assetTransaction.created_at);

    const formatDate = (d: Date) => d.toLocaleDateString("km-KH", {
        timeZone: "Asia/Phnom_Penh",
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    const formatTime = (d: Date) => d.toLocaleTimeString("km-KH", {
        timeZone: "Asia/Phnom_Penh",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    });

    return (
        <AppLayout breadcrumbs={[
            { title: "ការផ្លាស់ប្តូរទ្រព្យសកម្ម", href: route("asset-transactions.index") },
            { title: `ការផ្លាស់ប្តូរ #${assetTransaction.id}`, href: "" },
        ]}>
            <Head title={`ការផ្លាស់ប្តូរ #${assetTransaction.id}`} />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-12 px-4">
                <div className="max-w-1xl mx-auto">
                    {/* កាតធំសំខាន់ */}
                    <Card className="overflow-hidden border-0 shadow-2xl bg-white dark:bg-gray-900">
                        {/* Header ដ៏ស្រស់ស្អាត */}
                        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-10 py-14 text-white">
                            <div className="flex items-center justify-between flex-wrap gap-6">
                                <div className="flex items-center gap-8">
                                    <div className="p-5 bg-white/25 backdrop-blur-md rounded-3xl shadow-2xl">
                                        <Package className="h-16 w-16" />
                                    </div>
                                    <div>
                                        <h1 className="text-5xl font-extrabold tracking-tight leading-tight">
                                            {assetTransaction.asset.name}
                                        </h1>
                                        <p className="text-2xl opacity-90 mt-2">ការផ្លាស់ប្តូរ #{assetTransaction.id}</p>
                                    </div>
                                </div>
                                <TypeBadge type={assetTransaction.type} />
                            </div>
                        </div>

                        <CardContent className="p-10 space-y-16">

                            {/* ចលនា: ពី → ទៅ */}
                            <div className="relative">
                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full p-6 shadow-2xl animate-pulse">
                                        <ArrowRightCircle className="h-16 w-16" />
                                    </div>
                                </div>

                                <div className="grid lg:grid-cols-2 gap-12">
                                    {/* ពី (FROM) */}
                                    <Card className="border-3 border-red-300 dark:border-red-800 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/40 dark:to-pink-950/40 shadow-xl">
                                        <CardHeader className="text-center pb-6">
                                            <h3 className="text-3xl font-bold text-red-700 dark:text-red-400">ពី</h3>
                                        </CardHeader>
                                        <CardContent className="space-y-8 text-center">
                                            {assetTransaction.from_department ? (
                                                <div className="flex items-center justify-center gap-5">
                                                    <Building2 className="h-14 w-14 text-red-600" />
                                                    <div>
                                                        <p className="text-lg text-muted-foreground font-medium">នាយកដ្ឋាន</p>
                                                        <p className="text-2xl font-bold text-red-800 dark:text-red-300">
                                                            {assetTransaction.from_department.name}
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : <p className="text-xl text-muted-foreground italic">—</p>}

                                            {assetTransaction.from_room ? (
                                                <div className="flex items-center justify-center gap-5">
                                                    <DoorOpen className="h-14 w-14 text-red-500" />
                                                    <div>
                                                        <p className="text-lg text-muted-foreground font-medium">បន្ទប់</p>
                                                        <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                                                            {assetTransaction.from_room.name}
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : <p className="text-lg text-muted-foreground italic">មិនបានបញ្ជាក់បន្ទប់</p>}
                                        </CardContent>
                                    </Card>

                                    {/* ទៅ (TO) */}
                                    <Card className="border-3 border-emerald-300 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 shadow-xl">
                                        <CardHeader className="text-center pb-6">
                                            <h3 className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">ទៅ</h3>
                                        </CardHeader>
                                        <CardContent className="space-y-8 text-center">
                                            {assetTransaction.to_department ? (
                                                <div className="flex items-center justify-center gap-5">
                                                    <Building2 className="h-14 w-14 text-emerald-600" />
                                                    <div>
                                                        <p className="text-lg text-muted-foreground font-medium">នាយកដ្ឋាន</p>
                                                        <p className="text-2xl font-bold text-emerald-800 dark:text-emerald-300">
                                                            {assetTransaction.to_department.name}
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : <p className="text-xl text-muted-foreground italic">—</p>}

                                            {assetTransaction.to_room ? (
                                                <div className="flex items-center justify-center gap-5">
                                                    <DoorOpen className="h-14 w-14 text-emerald-500" />
                                                    <div>
                                                        <p className="text-lg text-muted-foreground font-medium">បន្ទប់</p>
                                                        <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                                                            {assetTransaction.to_room.name}
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : <p className="text-lg text-muted-foreground italic">មិនបានបញ្ជាក់បន្ទប់</p>}
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>

                            <Separator className="my-16 border-dashed" />

                            {/* អ្នកធ្វើការ និង ពេលវេលា */}
                            <div className="grid lg:grid-cols-2 gap-16 items-center">
                                {/* អ្នកធ្វើការ */}
                                <div className="flex items-center gap-10">
                                    <Avatar className="h-32 w-32 ring-8 ring-indigo-100 dark:ring-indigo-900/60 shadow-2xl">
                                        <AvatarFallback className="text-4xl font-extrabold bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                                            {assetTransaction.performer.name.split(" ").map(n => n[0]?.toUpperCase()).join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-xl text-muted-foreground font-semibold mb-2">អ្នកធ្វើការ</p>
                                        <p className="text-4xl font-bold text-foreground leading-tight">
                                            {assetTransaction.performer.name}
                                        </p>
                                    </div>
                                </div>

                                {/* កាលបរិច្ឆេទ និង ម៉ោង */}
                                <div className="space-y-10">
                                    <div className="flex items-center gap-8">
                                        <div className="p-5 bg-indigo-100 dark:bg-indigo-900/40 rounded-3xl shadow-xl">
                                            <CalendarDays className="h-14 w-14 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                        <div>
                                            <p className="text-xl text-muted-foreground font-medium">ធ្វើការនៅថ្ងៃ</p>
                                            <p className="text-3xl font-bold text-indigo-700 dark:text-indigo-300">
                                                {formatDate(performedAt)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-8">
                                        <div className="p-5 bg-purple-100 dark:bg-purple-900/40 rounded-3xl shadow-xl">
                                            <Clock className="h-14 w-14 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <div>
                                            <p className="text-xl text-muted-foreground font-medium">ម៉ោង</p>
                                            <p className="text-5xl font-mono font-extrabold text-purple-700 dark:text-purple-300">
                                                {formatTime(performedAt)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* កំណត់ចំណាំ */}
                            {assetTransaction.note && (
                                <>
                                    <Separator className="my-16 border-dashed" />
                                    <Card className="border-3 border-amber-300 dark:border-amber-800 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 shadow-2xl">
                                        <CardHeader>
                                            <div className="flex items-center gap-5">
                                                <StickyNote className="h-12 w-12 text-amber-600" />
                                                <h3 className="text-3xl font-bold text-amber-900 dark:text-amber-200">កំណត់ចំណាំ</h3>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-xl leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-medium">
                                                {assetTransaction.note}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </>
                            )}

                            {/* ព័ត៌មានបន្ថែម */}
                            <div className="text-center pt-16">
                                <p className="text-lg text-muted-foreground">
                                    ការផ្លាស់ប្តូរនេះត្រូវបានកត់ត្រានៅថ្ងៃទី{" "}
                                    <span className="font-bold text-foreground">
                                        {createdAt.toLocaleString("km-KH", {
                                            timeZone: "Asia/Phnom_Penh",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        })}
                                    </span>
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
