import type { AxiosInstance } from "axios"

export interface Vertical {
  code: string
  displayName: string
}

export const getVerticals = async (
  axiosInstance: AxiosInstance,
  lookupTypeCode: string
): Promise<Vertical[]> => {
  const response = await axiosInstance.get<Vertical[]>("/lookups", {
    params: { lookupTypeCode },
  })
  return response.data
}