import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_INTERNAL_URL, AUTH_COOKIE } from "@/lib/api-config";
import type { LoginResponse } from "@/dto/login-response";
import type { PublicUser } from "@/dto/public-user";

const SESSION_TTL_SECONDS = 60 * 60 * 24;

export async function POST(request: Request) {
    const body = await request.text();

    try {
        const loginRes = await fetch(`${API_INTERNAL_URL}/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body,
        });

        if (!loginRes.ok) {
            const errData = await loginRes.json().catch(() => ({}));
            return NextResponse.json(
                { message: errData?.message ?? "Falha na autenticação." },
                { status: loginRes.status },
            );
        }

        const { accessToken } = (await loginRes.json()) as LoginResponse;

        const profileRes = await fetch(`${API_INTERNAL_URL}/users/me`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!profileRes.ok) {
            return NextResponse.json(
                { message: "Sessão inválida ao carregar perfil." },
                { status: 502 },
            );
        }
        const profile = (await profileRes.json()) as PublicUser;

        const jar = await cookies();
        jar.set(AUTH_COOKIE, accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: SESSION_TTL_SECONDS,
        });

        return NextResponse.json(profile);
    } catch (err) {
        console.error("[/api/auth/login] proxy failed", {
            target: `${API_INTERNAL_URL}/users/login`,
            error: err instanceof Error ? err.message : String(err),
            cause: err instanceof Error ? (err as { cause?: unknown }).cause : undefined,
        });
        return NextResponse.json(
            { message: "Serviço indisponível. Tente novamente em instantes." },
            { status: 502 },
        );
    }
}
