import * as React from "react";
import { ChevronRight, type LucideIcon } from "lucide-react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useEffect } from "react";

interface SubNavItem {
    title: string;
    url?: string;
    icon?: LucideIcon;
    iconColor?: string;
    onClick?: () => void;
}

interface NavItem {
    title: string;
    url?: string;
    icon: LucideIcon;
    iconColor?: string;
    items?: SubNavItem[];
}

interface NavMainProps {
    items: NavItem[];
    label?: string;
    collapseAll?: boolean;
}

export const NavMain = React.memo(
    ({ items, label = "Platform", collapseAll }: NavMainProps) => {
        const [activeUrl, setActiveUrl] = React.useState(
            () => localStorage.getItem("sidebarActiveUrl") || "/"
        );

        const [openState, setOpenState] = React.useState<Record<string, boolean>>(
            () => JSON.parse(localStorage.getItem("sidebarOpenState") || "{}")
        );

        // persist active url
        useEffect(() => {
            localStorage.setItem("sidebarActiveUrl", activeUrl);
        }, [activeUrl]);

        // persist open state
        useEffect(() => {
            localStorage.setItem("sidebarOpenState", JSON.stringify(openState));
        }, [openState]);

        // Apply collapse/expand-all
        useEffect(() => {
            if (collapseAll === undefined) return;

            const updated: Record<string, boolean> = {};
            items.forEach((item) => (updated[item.title] = !collapseAll));

            setOpenState((prev) => ({ ...prev, ...updated }));
        }, [collapseAll, items]);

        const handleClick = React.useCallback((url?: string, parent?: string) => {
            if (url) setActiveUrl(url);
            if (parent) setOpenState((prev) => ({ ...prev, [parent]: true }));
        }, []);

        const toggleOpen = React.useCallback((key: string) => {
            setOpenState((prev) => ({ ...prev, [key]: !prev[key] }));
        }, []);

        const parentMap = React.useMemo(() => {
            const map = new Map<string, string>();
            items.forEach((item) =>
                item.items?.forEach((sub) => sub.url && map.set(sub.url, item.title))
            );
            return map;
        }, [items]);

        const activeParent = parentMap.get(activeUrl);

        return (
            <SidebarGroup>
                <SidebarGroupLabel className="text-gray-600 dark:text-gray-300 text-sm">
                    {label}
                </SidebarGroupLabel>

                <SidebarMenu>
                    {items.map((item) => {
                        const hasSub = !!item.items?.length;
                        const isActive =
                            item.url === activeUrl || item.title === activeParent;

                        const isOpen = openState[item.title] ?? isActive;
                        const Icon = item.icon;

                        return (
                            <Collapsible key={item.title} asChild open={isOpen}>
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        asChild
                                        tooltip={item.title}
                                        onClick={() => hasSub && toggleOpen(item.title)}
                                    >
                                        {item.url ? (
                                            <a
                                                href={item.url}
                                                onClick={() => handleClick(item.url)}
                                                className={`flex items-center gap-2 px-3 py-2 rounded-md transition ${
                                                    isActive
                                                        ? "bg-sky-500 text-white"
                                                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100"
                                                }`}
                                            >
                                                <Icon
                                                    className={`${item.iconColor} ${
                                                        isActive ? "text-white" : ""
                                                    }`}
                                                />
                                                <span>{item.title}</span>
                                            </a>
                                        ) : (
                                            <button
                                                className={`flex items-center gap-2 w-full px-3 py-2 rounded-md transition ${
                                                    isActive
                                                        ? "bg-sky-500 text-white"
                                                        : "text-gray-600 hover:bg-gray-100"
                                                }`}
                                            >
                                                <Icon
                                                    className={`${item.iconColor} ${
                                                        isActive ? "text-white" : ""
                                                    }`}
                                                />
                                                <span>{item.title}</span>
                                            </button>
                                        )}
                                    </SidebarMenuButton>

                                    {hasSub && (
                                        <>
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuAction
                                                    className="data-[state=open]:rotate-90"
                                                    onClick={() => toggleOpen(item.title)}
                                                >
                                                    <ChevronRight />
                                                </SidebarMenuAction>
                                            </CollapsibleTrigger>

                                            <CollapsibleContent>
                                                <SidebarMenuSub>
                                                    {item.items!.map((sub) => {
                                                        const SubIcon = sub.icon;
                                                        const isSub = sub.url === activeUrl;

                                                        return (
                                                            <SidebarMenuSubItem key={sub.title}>
                                                                <SidebarMenuSubButton asChild>
                                                                    {sub.url ? (
                                                                        <a
                                                                            href={sub.url}
                                                                            onClick={() =>
                                                                                handleClick(
                                                                                    sub.url,
                                                                                    item.title
                                                                                )
                                                                            }
                                                                            className={`flex items-center gap-2 px-2 py-1 rounded transition ${
                                                                                isSub
                                                                                    ? "bg-sky-500 text-white"
                                                                                    : "hover:bg-gray-100"
                                                                            }`}
                                                                        >
                                                                            {SubIcon && (
                                                                                <SubIcon
                                                                                    className={`size-4 ${
                                                                                        isSub
                                                                                            ? "text-white"
                                                                                            : sub.iconColor
                                                                                    }`}
                                                                                />
                                                                            )}
                                                                            <span>{sub.title}</span>
                                                                        </a>
                                                                    ) : (
                                                                        <button
                                                                            onClick={() =>
                                                                                handleClick(
                                                                                    undefined,
                                                                                    item.title
                                                                                )
                                                                            }
                                                                            className={`flex items-center gap-2 w-full px-2 py-1 rounded transition ${
                                                                                isSub
                                                                                    ? "bg-sky-500 text-white"
                                                                                    : "hover:bg-gray-100"
                                                                            }`}
                                                                        >
                                                                            {SubIcon && (
                                                                                <SubIcon
                                                                                    className={`size-4 ${
                                                                                        isSub
                                                                                            ? "text-white"
                                                                                            : sub.iconColor
                                                                                    }`}
                                                                                />
                                                                            )}
                                                                            <span>{sub.title}</span>
                                                                        </button>
                                                                    )}
                                                                </SidebarMenuSubButton>
                                                            </SidebarMenuSubItem>
                                                        );
                                                    })}
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        </>
                                    )}
                                </SidebarMenuItem>
                            </Collapsible>
                        );
                    })}
                </SidebarMenu>
            </SidebarGroup>
        );
    }
);

NavMain.displayName = "NavMain";
