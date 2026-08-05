
import type { LoggedInUser, User } from "@/types/user.types"
import type { AxiosInstance } from "axios"

export const getMyDetails = async (
  axiosInstance: AxiosInstance
): Promise<LoggedInUser> => {
  const response = await axiosInstance.get<LoggedInUser>(`/me`)
  return response.data
}

export const getUserById = async (
  axiosInstance: AxiosInstance,
  userId: number
): Promise<User> => {
  const response = await axiosInstance.get(`/users/${userId}`)
  return response.data
}
