"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getProfile, clearToken } from "@/services/users.service";
import type { PublicUser } from "@/dto/public-user";
import { useRouter } from "next/navigation";

interface AuthContextType {
    user: PublicUser | null;
    loading: boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<PublicUser | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function fetchUser() {
            try {
                const profile = await getProfile();
                setUser(profile);
            } catch (error) {
                clearToken();
                router.push("/"); 
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const logout = () => {
        clearToken();
        setUser(null);
        router.push("/");
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
