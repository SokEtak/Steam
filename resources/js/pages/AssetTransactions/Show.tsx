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
import { translations } from "@/utils/translations/asset-transaction/asset-transaction";

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
    lang?: "kh" | "en";
}

const TypeBadge = ({ type }: { type: string }) => {
    const colors: Record<string, string> = {
        received: "bg-sky-500 text-white",
        allocated: "bg-emerald-500 text-white",
        returned: "bg-violet-500 text-white",
        transfer: "bg-amber-500 text-white",
        maintenance_start: "bg-orange-500 text-white",
        maintenance_end: "bg-zinc-500 text-white",
        disposed: "bg-rose-500 text-white",
    };

    const t = translations.en;
    return (
        <Badge className={`${colors[type] || "bg-gray-500"} font-semibold px-4 py-1.5 text-sm`}>
            {t.types[type] || type.replace(/_/g, " ")}
        </Badge>
    );
};

export default function AssetTransactionsShow({ assetTransaction, lang = "en" }: Props) {
    const t = translations[lang] || translations.en;

    const performedAt = new Date(assetTransaction.performed_at);
    const createdAt = new Date(assetTransaction.created_at);

    const formatDate = (d: Date) => d.toLocaleDateString("en-KH", {
        timeZone: "Asia/Phnom_Penh",
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    const formatTime = (d: Date) => d.toLocaleTimeString("en-KH", {
        timeZone: "Asia/Phnom_Penh",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    });

    return (
        <AppLayout breadcrumbs={[
            { title: t.indexTitle, href: route("asset-transactions.index") },
            { title: `Transaction #${assetTransaction.id}`, href: "" },
        ]}>
            <Head title={`${t.showTitle} #${assetTransaction.id}`} />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-12 px-2">
                <div className="max-w-1xl mx-auto">
                    {/* Hero Header Card */}
                    <Card className="overflow-hidden border-0 shadow-2xl bg-white dark:bg-gray-900">
                        <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 px-10 py-12 text-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                                        <Package className="h-14 w-14" />
                                    </div>
                                    <div>
                                        <h1 className="text-4xl font-bold tracking-tight">
                                            {assetTransaction.asset.name}
                                        </h1>
                                        <p className="text-xl text-white/80 mt-1">Transaction #{assetTransaction.id}</p>
                                    </div>
                                </div>
                                <TypeBadge type={assetTransaction.type} />
                            </div>
                        </div>

                        <CardContent className="p-10 space-y-12">

                            {/* Movement - Full Width Flow */}
                            <div className="relative">
                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                                    <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-full p-5 shadow-2xl">
                                        <ArrowRightCircle className="h-12 w-12" />
                                    </div>
                                </div>

                                <div className="grid lg:grid-cols-2 gap-10">
                                    {/* FROM */}
                                    <Card className="border-2 border-red-200 dark:border-red-900/50 bg-gradient-to-br from-red-50/80 to-pink-50/80 dark:from-red-950/30 dark:to-pink-950/30">
                                        <CardHeader className="text-center pb-4">
                                            <h3 className="text-2xl font-bold text-red-700 dark:text-red-400">From</h3>
                                        </CardHeader>
                                        <CardContent className="space-y-6 text-center">
                                            {assetTransaction.from_department ? (
                                                <div className="flex items-center justify-center gap-4">
                                                    <Building2 className="h-10 w-10 text-red-600" />
                                                    <div>
                                                        <p className="text-sm text-muted-foreground">Department</p>
                                                        <p className="text-xl font-semibold">{assetTransaction.from_department.name}</p>
                                                    </div>
                                                </div>
                                            ) : <p className="text-muted-foreground italic">—</p>}

                                            {assetTransaction.from_room ? (
                                                <div className="flex items-center justify-center gap-4">
                                                    <DoorOpen className="h-10 w-10 text-red-500" />
                                                    <div>
                                                        <p className="text-sm text-muted-foreground">Room</p>
                                                        <p className="text-xl font-semibold">{assetTransaction.from_room.name}</p>
                                                    </div>
                                                </div>
                                            ) : <p className="text-muted-foreground italic text-sm">No room specified</p>}
                                        </CardContent>
                                    </Card>

                                    {/* TO */}
                                    <Card className="border-2 border-emerald-200 dark:border-emerald-900/50 bg-gradient-to-br from-emerald-50/80 to-teal-50/80 dark:from-emerald-950/30 dark:to-teal-950/30">
                                        <CardHeader className="text-center pb-4">
                                            <h3 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">To</h3>
                                        </CardHeader>
                                        <CardContent className="space-y-6 text-center">
                                            {assetTransaction.to_department ? (
                                                <div className="flex items-center justify-center gap-4">
                                                    <Building2 className="h-10 w-10 text-emerald-600" />
                                                    <div>
                                                        <p className="text-sm text-muted-foreground">Department</p>
                                                        <p className="text-xl font-semibold">{assetTransaction.to_department.name}</p>
                                                    </div>
                                                </div>
                                            ) : <p className="text-muted-foreground italic">—</p>}

                                            {assetTransaction.to_room ? (
                                                <div className="flex items-center justify-center gap-4">
                                                    <DoorOpen className="h-10 w-10 text-emerald-500" />
                                                    <div>
                                                        <p className="text-sm text-muted-foreground">Room</p>
                                                        <p className="text-xl font-semibold">{assetTransaction.to_room.name}</p>
                                                    </div>
                                                </div>
                                            ) : <p className="text-muted-foreground italic text-sm">No room specified</p>}
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>

                            <Separator className="my-12" />

                            {/* Performer & Time */}
                            <div className="grid lg:grid-cols-2 gap-12 items-center">
                                <div className="flex items-center gap-8">
                                    <Avatar className="h-24 w-24 ring-4 ring-indigo-100 dark:ring-indigo-900/50">
                                        <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                                            {assetTransaction.performer.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Performed by</p>
                                        <p className="text-3xl font-bold text-foreground">{assetTransaction.performer.name}</p>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="flex items-center gap-6">
                                        <div className="p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl">
                                            <CalendarDays className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Performed on</p>
                                            <p className="text-2xl font-bold">{formatDate(performedAt)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-2xl">
                                            <Clock className="h-12 w-12 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Time</p>
                                            <p className="text-4xl font-mono font-bold text-purple-600 dark:text-purple-400">
                                                {formatTime(performedAt)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Note */}
                            {assetTransaction.note && (
                                <>
                                    <Separator className="my-12" />
                                    <Card className="border-2 border-amber-200 dark:border-amber-900/50 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
                                        <CardHeader>
                                            <div className="flex items-center gap-4">
                                                <StickyNote className="h-10 w-10 text-amber-600" />
                                                <h3 className="text-2xl font-bold text-amber-900 dark:text-amber-100">Note</h3>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-lg leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                                                {assetTransaction.note}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </>
                            )}

                            {/* Footer */}
                            <div className="text-center pt-12 text-sm text-muted-foreground">
                                Transaction recorded on{" "}
                                {createdAt.toLocaleString("en-KH", { timeZone: "Asia/Phnom_Penh" })}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
