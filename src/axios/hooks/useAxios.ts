import { CONSTANTS } from "@/constants/Constants.ts";
import { isTauri } from "@tauri-apps/api/core";
import axios, { AxiosError, type AxiosResponse } from "axios";
import { useAuth } from "react-oidc-context";
import { AxiosConfig } from "../config/axiosConfig";

export const useAxios = () => {
    const axiosInstance = axios.create(AxiosConfig);
    const auth = !isTauri() ? useAuth() : null;

    axiosInstance.interceptors.response.use(
        async (response: AxiosResponse) => {
            const requestTime = response.config.headers["request-startTime"];
            if (requestTime) {
                const elapsed = Date.now() - parseInt(requestTime as string);
                const remainingDelay = CONSTANTS.API_MIN_DELAY_MS - elapsed;
                if (remainingDelay > 0) {
                    await new Promise((res) => setTimeout(res, remainingDelay));
                }
            }
            return response;
        },
        async (error: AxiosError) => {
            const requestTime = error.config?.headers?.["request-startTime"];
            if (requestTime) {
                const elapsed = Date.now() - parseInt(requestTime as string);
                const remainingDelay = CONSTANTS.API_MIN_DELAY_MS - elapsed;
                if (remainingDelay > 0) {
                    await new Promise((res) => setTimeout(res, remainingDelay));
                }
            }

            return Promise.reject(error);
        }
    );

    axiosInstance.interceptors.request.use(async (config) => {
        if (config.headers) {
            config.headers.set("request-startTime", `${Date.now()}`);
        }

        if (isTauri()) {
            return config;
        } else {
            if (!auth?.user) return config;

            const now = Date.now() / 1000; // seconds
            if (auth.user.expires_at && auth.user.expires_at < now) {
                console.log("Token expired, trying to refresh...");
                try {
                    const refreshedUser = await auth.signinSilent();
                    if (refreshedUser) {
                        config.headers.Authorization = `Bearer ${refreshedUser.access_token}`;
                    }
                } catch (err) {
                    console.error("Refresh failed, redirecting to login", err);
                    await auth.signoutRedirect();
                }
            } else {
                config.headers.Authorization = `Bearer ${auth.user.access_token}`;
            }

            return config;
        }
    });

    return { axiosInstance };
};