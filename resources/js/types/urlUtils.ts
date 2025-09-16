export const PDF_BASE = "https://drive.google.com/drive/folders/";
export const FLIPBOOK_BASE = "https://online.fliphtml5.com/";
export const AI_TOOLS_BASE = "https://www.";
export const VIRTUAL_LAB_BASE = "https://www.";

export const constructFullUrl = (baseUrl: string, resourceId: string | null): string | null => {
    return resourceId && resourceId !== "#" ? `${baseUrl}${resourceId}` : null;
};
