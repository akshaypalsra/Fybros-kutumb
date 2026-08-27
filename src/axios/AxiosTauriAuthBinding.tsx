import { useEffect, useRef } from "react";
import { AxiosError, type AxiosResponse } from "axios";
import { load } from "@tauri-apps/plugin-store";
import { CONSTANTS } from "@/constants/Constants";
import { useAxios } from "./hooks/useAxios";

let storePromise: ReturnType<typeof load> | null = null;
const getStore = () => {
    if (!storePromise) storePromise = load("auth.json");
    return storePromise;
};

export async function getAccessToken(): Promise<string | null> {
    const store = await getStore();
    return (await store.get<string>("access_token")) ?? null;
}

export async function getRefreshToken(): Promise<string | null> {
    const store = await getStore();
    return (await store.get<string>("refresh_token")) ?? null;
}

export async function saveTokens(accessToken: string, refreshToken: string) {
    const store = await getStore();
    await store.set("access_token", accessToken);
    await store.set("refresh_token", refreshToken);
    await store.save();
}

export async function clearTokens() {
    const store = await getStore();
    await store.delete("access_token");
    await store.delete("refresh_token");
    await store.save();
}

async function refreshAccessToken(): Promise<string> {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) throw new Error("No refresh token available");

    const res = await fetch(CONSTANTS.TAURI_SSO_TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            grant_type: "refresh_token",
            client_id: CONSTANTS.SSO_DESKTOP_CLIENT_ID,
            refresh_token: refreshToken,
        }),
    });

    if (!res.ok) throw new Error(`Refresh failed: ${res.status}`);

    const data = await res.json();
    await saveTokens(data.access_token, data.refresh_token);
    return data.access_token;
}

export const AxiosTauriAuthBinding = () => {
    // useAxios returns { axiosInstance } — destructure it, don't assign the whole object
    const { axiosInstance } = useAxios();
    const refreshPromiseRef = useRef<Promise<string> | null>(null);

    const doRefresh = () => {
        if (!refreshPromiseRef.current) {
            refreshPromiseRef.current = refreshAccessToken().finally(() => {
                refreshPromiseRef.current = null;
            });
        }
        return refreshPromiseRef.current;
    };

    useEffect(() => {
        const requestId = axiosInstance.interceptors.request.use(async (config) => {
            const token = await getAccessToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

        const responseId = axiosInstance.interceptors.response.use(
            (response: AxiosResponse) => response,
            async (error: AxiosError) => {
                const originalRequest = error.config as (typeof error.config & { _retry?: boolean });

                if (error.response?.status !== 401 || !originalRequest || originalRequest._retry) {
                    return Promise.reject(error);
                }
                originalRequest._retry = true;

                try {
                    const newAccessToken = await doRefresh();
                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    }
                    return axiosInstance.request(originalRequest);
                } catch (refreshErr) {
                    console.error("[AxiosTauriAuthBinding] Token refresh failed:", refreshErr);
                    await clearTokens();
                    // TODO: redirect to login / show "session expired"
                    return Promise.reject(refreshErr);
                }
            }
        );

        return () => {
            axiosInstance.interceptors.request.eject(requestId);
            axiosInstance.interceptors.response.eject(responseId);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [axiosInstance]);

    return null;
};