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
    onClick?: () => void;
}

interface NavMainProps {
    items: NavItem[];
    label?: string;
}

export const NavMain = React.memo(
    ({ items, label = "Platform" }: NavMainProps) => {
        const [activeUrl, setActiveUrl] = React.useState<string>(() => {
            // Read from localStorage only on initial load
            return localStorage.getItem("sidebarActiveUrl") || "/";
        });

        const [openState, setOpenState] = React.useState<{
            [key: string]: boolean;
        }>(() => {
            // Read and parse from localStorage only on initial load
            const stored = localStorage.getItem("sidebarOpenState");
            return stored ? JSON.parse(stored) : {};
        });

        // Optimization: Defer localStorage writes to useEffect.
        // This makes UI updates feel instantaneous by not blocking the main thread.
        React.useEffect(() => {
            localStorage.setItem("sidebarActiveUrl", activeUrl);
        }, [activeUrl]);

        React.useEffect(() => {
            localStorage.setItem("sidebarOpenState", JSON.stringify(openState));
        }, [openState]);

        // Optimization: Memoize handlers so they have a stable identity.
        const handleClick = React.useCallback(
            (url?: string, parentKey?: string) => {
                if (url) {
                    setActiveUrl(url);
                }
                if (parentKey) {
                    // Ensure parent is open when a child is clicked
                    setOpenState((prev) => ({ ...prev, [parentKey]: true }));
                }
            },
            [], // State setters (setActiveUrl, setOpenState) are stable and don't need to be dependencies
        );

        const toggleOpen = React.useCallback((key: string) => {
            setOpenState((prev) => ({ ...prev, [key]: !prev[key] }));
        }, []);

        // Optimization: Create a lookup map for sub-item URLs.
        // This avoids an expensive O(N*M) .some() check inside the render loop.
        const parentUrlMap = React.useMemo(() => {
            const map = new Map<string, string>();
            items.forEach((item) => {
                if (item.items) {
                    item.items.forEach((sub) => {
                        if (sub.url) {
                            map.set(sub.url, item.title);
                        }
                    });
                }
            });
            return map;
        }, [items]); // Only recalculates when the `items` prop changes

        // Get the active parent title *once* per render, outside the loop.
        const activeParentTitle = parentUrlMap.get(activeUrl);

        return (
            <SidebarGroup>
                <SidebarGroupLabel>{label}</SidebarGroupLabel>
                <SidebarMenu>
                    {items.map((item) => {
                        const hasSub = item.items && item.items.length > 0;

                        // Optimized: This is now an O(1) check instead of O(M).
                        const isItemActive =
                            item.url === activeUrl || item.title === activeParentTitle;

                        const isOpen = openState[item.title] ?? isItemActive;
                        const Icon = item.icon;

                        return (
                            <Collapsible key={item.title} asChild open={isOpen}>
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        asChild
                                        tooltip={item.title}
                                        // Pass the stable, memoized callback
                                        onClick={() => hasSub && toggleOpen(item.title)}
                                    >
                                        {item.url ? (
                                            <a
                                                href={item.url}
                                                // Pass the stable, memoized callback
                                                onClick={() => handleClick(item.url)}
                                                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors duration-150 ${
                                                    isItemActive
                                                        ? "bg-sky-500 text-white"
                                                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                                }`}
                                            >
                                                <Icon
                                                    className={`${item.iconColor} ${
                                                        isItemActive ? "text-white" : ""
                                                    }`}
                                                />
                                                <span>{item.title}</span>
                                            </a>
                                        ) : (
                                            <button
                                                className={`flex items-center gap-2 w-full px-3 py-2 rounded-md transition-colors duration-150 ${
                                                    isItemActive
                                                        ? "bg-sky-500 text-white"
                                                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                                }`}
                                            >
                                                <Icon
                                                    className={`${item.iconColor} ${
                                                        isItemActive ? "text-white" : ""
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
                                                    // Pass the stable, memoized callback
                                                    onClick={() => toggleOpen(item.title)}
                                                >
                                                    <ChevronRight />
                                                    <span className="sr-only">Toggle</span>
                                                </SidebarMenuAction>
                                            </CollapsibleTrigger>

                                            <CollapsibleContent>
                                                <SidebarMenuSub>
                                                    {item.items!.map((sub) => {
                                                        const isSubActive = sub.url === activeUrl;
                                                        const SubIcon = sub.icon;

                                                        return (
                                                            <SidebarMenuSubItem key={sub.title}>
                                                                <SidebarMenuSubButton asChild>
                                                                    {sub.url ? (
                                                                        <a
                                                                            href={sub.url}
                                                                            // Pass the stable, memoized callback
                                                                            onClick={() =>
                                                                                handleClick(
                                                                                    sub.url,
                                                                                    item.title,
                                                                                )
                                                                            }
                                                                            className={`flex items-center gap-2 px-2 py-1 rounded-md transition-colors duration-150 ${
                                                                                isSubActive
                                                                                    ? "bg-sky-500 text-white"
                                                                                    : "hover:bg-gray-100"
                                                                            }`}
                                                                        >
                                                                            {SubIcon && (
                                                                                <SubIcon
                                                                                    className={`${
                                                                                        sub.iconColor
                                                                                    } ${
                                                                                        isSubActive
                                                                                            ? "text-white"
                                                                                            : ""
                                                                                    }`}
                                                                                />
                                                                            )}
                                                                            <span>{sub.title}</span>
                                                                        </a>
                                                                    ) : (
                                                                        <button
                                                                            // Pass the stable, memoized callback
                                                                            onClick={() =>
                                                                                handleClick(
                                                                                    undefined,
                                                                                    item.title,
                                                                                )
                                                                            }
                                                                            className={`flex items-center gap-2 w-full px-2 py-1 rounded-md transition-colors duration-150 ${
                                                                                isSubActive
                                                                                    ? "bg-sky-500 text-white"
                                                                                    : "hover:bg-green-100"
                                                                            }`}
                                                                        >
                                                                            {SubIcon && (
                                                                                <SubIcon
                                                                                    className={`${
                                                                                        sub.iconColor
                                                                                    } ${
                                                                                        isSubActive
                                                                                            ? "text-white"
                                                                                            : ""
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
    },
);

// Add a display name for better debugging
NavMain.displayName = "NavMain";
