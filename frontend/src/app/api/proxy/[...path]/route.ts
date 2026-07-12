import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_INTERNAL_URL, AUTH_COOKIE } from "@/lib/api-config";

const HOP_BY_HOP = new Set([
    "connection",
    "keep-alive",
    "proxy-authenticate",
    "proxy-authorization",
    "te",
    "trailer",
    "transfer-encoding",
    "upgrade",
    "content-encoding",
    "content-length",
    "host",
]);

async function forward(
    request: Request,
    params: Promise<{ path: string[] }>,
): Promise<Response> {
    const { path } = await params;
    const targetPath = path.map(encodeURIComponent).join("/");
    const url = new URL(request.url);
    const target = `${API_INTERNAL_URL}/${targetPath}${url.search}`;

    const jar = await cookies();
    const token = jar.get(AUTH_COOKIE)?.value;
    if (!token) {
        return NextResponse.json({ message: "Não autenticado." }, { status: 401 });
    }

    const forwardHeaders = new Headers();
    request.headers.forEach((value, key) => {
        if (!HOP_BY_HOP.has(key.toLowerCase()) && key.toLowerCase() !== "cookie") {
            forwardHeaders.set(key, value);
        }
    });
    forwardHeaders.set("Authorization", `Bearer ${token}`);

    const hasBody = !["GET", "HEAD"].includes(request.method);
    let upstream: Response;
    try {
        upstream = await fetch(target, {
            method: request.method,
            headers: forwardHeaders,
            body: hasBody ? await request.arrayBuffer() : undefined,
            redirect: "manual",
        });
    } catch (err) {
        console.error(`[proxy ${request.method} ${targetPath}] fetch failed`, err);
        return NextResponse.json(
            { message: "Serviço indisponível. Tente novamente em instantes." },
            { status: 502 },
        );
    }

    const responseHeaders = new Headers();
    upstream.headers.forEach((value, key) => {
        if (!HOP_BY_HOP.has(key.toLowerCase()) && key.toLowerCase() !== "set-cookie") {
            responseHeaders.set(key, value);
        }
    });

    return new Response(upstream.body, {
        status: upstream.status,
        statusText: upstream.statusText,
        headers: responseHeaders,
    });
}

type Ctx = { params: Promise<{ path: string[] }> };

export const GET = (req: Request, ctx: Ctx) => forward(req, ctx.params);
export const POST = (req: Request, ctx: Ctx) => forward(req, ctx.params);
export const PUT = (req: Request, ctx: Ctx) => forward(req, ctx.params);
export const PATCH = (req: Request, ctx: Ctx) => forward(req, ctx.params);
export const DELETE = (req: Request, ctx: Ctx) => forward(req, ctx.params);
