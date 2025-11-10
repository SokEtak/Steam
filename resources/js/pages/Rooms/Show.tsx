"use client";

import { Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { translations } from "@/utils/translations/room/room";

interface Room {
    id: number;
    name: string;
    room_number: string;
    floor: number;
    building: { id: number; name: string; campus: { name: string } };
    department?: { id: number; name: string } | null;
    created_at: string;
    updated_at: string;
}

interface RoomsShowProps {
    room: Room;
    isSuperLibrarian?: boolean;
    lang?: "kh" | "en";
}

export default function RoomsShow({ room, isSuperLibrarian = false, lang = "en" }: RoomsShowProps) {
    const t = translations[lang] || translations.en;

    return (
        <AppLayout breadcrumbs={[
            { title: t.indexTitle, href: route("rooms.index") },
            { title: t.showTitle, href: "" },
        ]}>
            <Head title={t.showTitle} />
            <div className="min-h-screen p-6 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <div className="max-w-1xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                    <h1 className="text-3xl font-bold mb-8">{t.showTitle}</h1>

                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <div><strong>{t.showBuilding}:</strong> <Link href={route('buildings.show', room.building.id)} className="text-indigo-600 hover:underline">{room.building.name} ({room.building.campus.name})</Link></div>
                            <div><strong>{t.showDepartment}:</strong> {room.department ? <Link href={route('departments.show', room.department.id)} className="text-indigo-600 hover:underline">{room.department.name}</Link> : "—"}</div>
                            <div><strong>{t.showName}:</strong> {room.name}</div>
                            <div><strong>{t.showRoomNumber}:</strong> <code>{room.room_number}</code></div>
                            <div><strong>{t.showFloor}:</strong> {room.floor}</div>
                            <div><strong>{t.showCreatedAt}:</strong> {new Date(room.created_at).toLocaleDateString()}</div>
                            <div><strong>{t.showUpdatedAt}:</strong> {new Date(room.updated_at).toLocaleDateString()}</div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4 mt-8">
                        {isSuperLibrarian && (
                            <Link href={route("rooms.edit", room.id)}>
                                <Button>{t.showEditButton}</Button>
                            </Link>
                        )}
                        <Link href={route("rooms.index")}>
                            <Button variant="outline">{t.showBack}</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
