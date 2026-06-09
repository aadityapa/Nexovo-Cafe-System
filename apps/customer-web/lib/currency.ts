/** Indian Rupee formatting for Nexovo Cafe System */
export function formatINR(amount: number, decimals = 0): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(amount);
}

export const CURRENCY_SYMBOL = "₹";
