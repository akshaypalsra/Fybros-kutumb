import { useAxios } from "@/axios/hooks/useAxios";
import { getBusinessPartners } from "./businessPartnerApi";

export const useBusinessPartnerApi = () => {
  const { axiosInstance } = useAxios();

  return {
    getBusinessPartners: () => getBusinessPartners(axiosInstance),
  };
};