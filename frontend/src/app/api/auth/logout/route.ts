import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE } from "@/lib/api-config";

export async function POST() {
    const jar = await cookies();
    jar.delete(AUTH_COOKIE);
    return NextResponse.json({ ok: true });
}
