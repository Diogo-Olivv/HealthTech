export function isImagem(tipo: string): boolean {
    return tipo.startsWith("image/");
}

export function isPdf(tipo: string): boolean {
    return tipo === "application/pdf";
}
