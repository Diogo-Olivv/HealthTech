import "server-only";
import { cookies } from "next/headers";
import { API_INTERNAL_URL, AUTH_COOKIE } from "@/lib/api-config";
import { throwFromResponse } from "@/lib/http";

export class UnauthenticatedError extends Error {
    constructor() {
        super("Não autenticado.");
        this.name = "UnauthenticatedError";
    }
}

export async function serverFetch<T>(
    path: string,
    init: RequestInit = {},
    fallbackErrorMsg = "Erro ao carregar dados.",
): Promise<T> {
    const jar = await cookies();
    const token = jar.get(AUTH_COOKIE)?.value;
    if (!token) throw new UnauthenticatedError();

    const res = await fetch(`${API_INTERNAL_URL}${path}`, {
        ...init,
        headers: {
            ...init.headers,
            Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
    });

    if (!res.ok) await throwFromResponse(res, fallbackErrorMsg);
    return res.json() as Promise<T>;
}
