import { useAxios } from "@/axios/hooks/useAxios";
import {
  getBusinessPartners,
  getOutstandingSummary,
  getCreditOverview,
  getAgeingDistribution,
} from "./businessPartnerApi";

export const useBusinessPartnerApi = () => {
  const { axiosInstance } = useAxios();

  return {
    getBusinessPartners: () => getBusinessPartners(axiosInstance),
    getOutstandingSummary: () => getOutstandingSummary(axiosInstance),
    getCreditOverview: () => getCreditOverview(axiosInstance),
    getAgeingDistribution: () => getAgeingDistribution(axiosInstance),
  };
};