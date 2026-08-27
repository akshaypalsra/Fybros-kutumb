import { CONSTANTS } from "@/constants/Constants.ts";
import { isTauri } from "@tauri-apps/api/core";
import { AxiosError, type AxiosResponse } from "axios";
import { useAuth } from "react-oidc-context";

import { useEffect } from "react";
import { axiosInstance } from "../AxiosInstance";

export const useAxios = () => {
    const auth = !isTauri() ? useAuth() : null;

    useEffect(() => {
        const timingResponseId = axiosInstance.interceptors.response.use(
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

        const timingRequestId = axiosInstance.interceptors.request.use(async (config) => {
            if (config.headers) {
                config.headers.set("request-startTime", `${Date.now()}`);
            }

            if (isTauri()) {
                return config;
            } else {
                if (!auth?.user) return config;

                const now = Date.now() / 1000;
                if (auth.user.expires_at && auth.user.expires_at < now) {
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

        return () => {
            axiosInstance.interceptors.response.eject(timingResponseId);
            axiosInstance.interceptors.request.eject(timingRequestId);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth?.user]);

    return { axiosInstance };
};