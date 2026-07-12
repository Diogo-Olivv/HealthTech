import { NextResponse } from "next/server";
import { API_INTERNAL_URL } from "@/lib/api-config";

export async function POST(request: Request) {
    const body = await request.text();
    try {
        const res = await fetch(`${API_INTERNAL_URL}/users/medicos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body,
        });
        const data = await res.json().catch(() => ({}));
        return NextResponse.json(data, { status: res.status });
    } catch (err) {
        console.error("[/api/auth/register/medico] proxy failed", err);
        return NextResponse.json(
            { message: "Serviço indisponível. Tente novamente em instantes." },
            { status: 502 },
        );
    }
}
