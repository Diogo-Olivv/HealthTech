export function formatDate(iso?: string): string {
    if (!iso) return "-";
    const date = new Date(iso);
    return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}
