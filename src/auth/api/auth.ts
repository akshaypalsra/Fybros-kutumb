import axios from "axios";
import type { AuthConfig } from "../types/auth.types";
import { CONSTANTS } from "@/constants/Constants";

export const getAuthConfigByOrigin = async (
): Promise<AuthConfig> => {
    const response = await axios.get<AuthConfig>(`${CONSTANTS.API_BASE_URL}/public/auth-config`)
    return response.data;
}
