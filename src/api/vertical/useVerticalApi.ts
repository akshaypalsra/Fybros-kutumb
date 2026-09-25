import { useAxios } from "@/axios/hooks/useAxios"
import { getVerticals } from "./verticalApi"

export const useVerticalApi = () => {
    const { axiosInstance } = useAxios()

    return {
        getVerticals: (lookupTypeCode: string) => getVerticals(axiosInstance, lookupTypeCode),
    }
}