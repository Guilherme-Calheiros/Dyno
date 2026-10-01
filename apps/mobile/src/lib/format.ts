export function formatTime(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays === 0) return "Hoje";
    if (diffDays === 1) return "Ontem";
    if (diffDays < 7) return `Há ${diffDays} dias`;

    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

export function parseDecimal(value: string | null | undefined): number {
    const trimmed = value?.trim() ?? "";

    if (!trimmed) return 0;

    const normalized = trimmed.includes(",")
        ? trimmed.replace(/\./g, "").replace(",", ".")
        : trimmed;

    const num = Number(normalized);

    return Number.isFinite(num) ? num : 0;
}

export function formatInputNumber(value: string | number | null | undefined): string {
    const normalized = typeof value === "string" ? value.trim().replace(",", ".") : value;

    if (normalized === null || normalized === undefined || normalized === "") return "";

    const num = Number(normalized);

    if (!Number.isFinite(num)) return "";

    return String(num).replace(".", ",");
}

export function formatBRL(value: number | string | null | undefined): string {
    const num =
        typeof value === "string"
            ? parseFloat(value || "0")
            : value ?? 0;

    if (!Number.isFinite(num)) {
        return "R$ 0,00";
    }

    return num.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

export function formatarTempo(segundos: number){
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segundosRestantes = segundos % 60;

    return [horas, minutos, segundosRestantes]
        .map((valor) => String(valor).padStart(2, "0"))
        .join(":")
}