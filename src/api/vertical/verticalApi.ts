import type { AxiosInstance } from "axios"

export interface Vertical {
  code: string
  displayName: string
}

export const getVerticals = async (axiosInstance: AxiosInstance): Promise<Vertical[]> => {
  const response = await axiosInstance.get<Vertical[]>("/verticals")
  return response.data
}