/**
 * Get wether or not the user has activated darkmode
 * @return {boolean} returns true when darkmode is enabled
 */
export function isDarkMode(): boolean {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
}

export function getQueryParam(key: string): string | null {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get(key)
}
