
import { useUserApi } from "@/api/user/useUserApi";
import { CONSTANTS } from "@/constants/Constants";
import type { LoggedInUser } from "@/types/user.types";
import { useQuery } from "@tanstack/react-query";


export const useSingleUser = () => {
    const { getMyDetails } = useUserApi();
    const {
        data: user = null,
        isPending,
        isError
    } = useQuery<LoggedInUser>({
        queryKey: [CONSTANTS.ME_QUERY_KEY],
        queryFn: () => getMyDetails(),
        staleTime: Infinity,
        retry: 1
    })

    return {
        user,
        isPending,
        isError
    }
}