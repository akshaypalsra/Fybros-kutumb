import type { CreateAxiosDefaults } from "axios";
import { CONSTANTS } from "@/constants/Constants.ts";

export const AxiosConfig: CreateAxiosDefaults = {
    baseURL: CONSTANTS.API_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
}