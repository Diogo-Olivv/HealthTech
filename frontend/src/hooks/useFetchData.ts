"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { mensagemDeErro } from "@/utils/mensagem-de-erro";
import type { UiStatus } from "@/types/ui-status";

export type FetcherFn<T> = (signal: AbortSignal) => Promise<T>;

export interface UseFetchDataOptions<T = unknown> {
    enabled?: boolean;
    requireAuth?: boolean;
    fallbackErrorMsg?: string;
    treatEmptyArrayAsEmpty?: boolean;
    initialData?: T | null;
}

export interface UseFetchDataResult<T> {
    data: T | null;
    status: UiStatus;
    error: string;
    refetch: () => Promise<void>;
    setData: (updater: T | ((current: T | null) => T)) => void;
}

export function useFetchData<T>(
    fetcher: FetcherFn<T>,
    deps: ReadonlyArray<unknown> = [],
    options: UseFetchDataOptions<T> = {},
): UseFetchDataResult<T> {
    const {
        enabled = true,
        requireAuth = true,
        fallbackErrorMsg = "Erro ao carregar dados.",
        treatEmptyArrayAsEmpty = true,
        initialData = null,
    } = options;

    const { user, loading: authLoading } = useAuth();
    const [data, setDataState] = useState<T | null>(initialData);
    const [status, setStatus] = useState<UiStatus>(() => {
        if (initialData === null || initialData === undefined) return "loading";
        const isEmpty =
            treatEmptyArrayAsEmpty &&
            Array.isArray(initialData) &&
            initialData.length === 0;
        return isEmpty ? "empty" : "success";
    });
    const [error, setError] = useState("");

    const fetcherRef = useRef(fetcher);
    useEffect(() => {
        fetcherRef.current = fetcher;
    }, [fetcher]);

    const controllerRef = useRef<AbortController | null>(null);
    const skipInitialFetchRef = useRef(initialData !== null && initialData !== undefined);

    const run = useCallback(async () => {
        controllerRef.current?.abort();
        const controller = new AbortController();
        controllerRef.current = controller;

        setStatus("loading");
        setError("");

        try {
            const result = await fetcherRef.current(controller.signal);
            if (controller.signal.aborted) return;

            setDataState(result);
            const isEmpty =
                treatEmptyArrayAsEmpty &&
                Array.isArray(result) &&
                result.length === 0;
            setStatus(isEmpty ? "empty" : "success");
        } catch (err) {
            if (controller.signal.aborted) return;
            if (err instanceof DOMException && err.name === "AbortError") return;
            setError(mensagemDeErro(err, fallbackErrorMsg));
            setStatus("error");
        }
    }, [fallbackErrorMsg, treatEmptyArrayAsEmpty]);

    useEffect(() => {
        if (!enabled) return;
        if (requireAuth && (authLoading || !user)) return;

        if (skipInitialFetchRef.current) {
            skipInitialFetchRef.current = false;
            return;
        }

        run();
        return () => controllerRef.current?.abort();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled, requireAuth, authLoading, user?.id, run, ...deps]);

    const setData = useCallback<UseFetchDataResult<T>["setData"]>((updater) => {
        setDataState((prev) =>
            typeof updater === "function"
                ? (updater as (current: T | null) => T)(prev)
                : updater,
        );
    }, []);

    return { data, status, error, refetch: run, setData };
}
