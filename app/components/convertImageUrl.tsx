// utils/urlHelpers.ts
export const convertImageUrl = (
    url: string | null,
    baseUrl: string
): string => {
    if (!url) return 'https://via.placeholder.com/150'; // Fallback image

    // If URL is already complete (contains http), check for localhost
    if (url.startsWith('http://localhost')) {
        return url.replace('http://localhost', baseUrl);
    }

    // If URL starts with /storage (relative path)
    if (url.startsWith('/storage')) {
        return `${baseUrl}${url}`;
    }

    // If URL is already correct or external
    return url;
};
