import { useQuery } from "@tanstack/react-query"
import { useVerticalApi } from "@/api/vertical/useVerticalApi"

export const useVerticals = (lookupTypeCode: string = "VERTICAL") => {
  const { getVerticals } = useVerticalApi()

  const { data: verticals, isLoading } = useQuery({
    queryKey: ["verticals", lookupTypeCode],
    queryFn: () => getVerticals(lookupTypeCode),
    enabled: !!lookupTypeCode,
  })

  return {
    verticals: verticals ?? [],
    isLoading,
  }
}