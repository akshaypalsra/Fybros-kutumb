
import { useAxios } from "@/axios/hooks/useAxios";
import { getMyDetails, getUserById } from "./userApi"

export const useUserApi = () => {

    const { axiosInstance } = useAxios();

    return {
        getMyDetails: async () => getMyDetails(axiosInstance),
        getUserById: async (userId: number) => await getUserById(axiosInstance, userId),
    }
}