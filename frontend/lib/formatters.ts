/**
 * Formats a numeric value into a clean currency string with the Taka (৳) symbol.
 * Removes decimal places if the number is whole, otherwise shows 2 decimal places.
 * Example: 26050 -> ৳26,050
 * Example: 10.5 -> ৳10.50
 */
export function formatCurrency(amount: number): string {
    const formatted = new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 2,
    }).format(amount);

    return `৳${formatted}`;
}

/**
 * Capitalizes a string for professional display.
 */
export function capitalize(str: string): string {
    if (!str) return '';
    return str.toUpperCase();
}
