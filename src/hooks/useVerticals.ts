import { useQuery } from "@tanstack/react-query"
import { useVerticalApi } from "@/api/vertical/useVerticalApi"

export const useVerticals = () => {
  const { getVerticals } = useVerticalApi()

  const { data: verticals, isLoading } = useQuery({
    queryKey: ["verticals"],
    queryFn: () => getVerticals(),
  })

  return {
    verticals: verticals ?? [],
    isLoading,
  }
}