import type { AxiosInstance } from "axios";
import type { BusinessPartner } from "@/types/businessPartner.types";
import type {
  OutstandingSummary,
  CreditOverview,
  AgeingBucketResponse,
} from "@/types/businessPartner.types";

export const getBusinessPartners = async (
  axiosInstance: AxiosInstance
): Promise<BusinessPartner> => {
  const response = await axiosInstance.get<BusinessPartner>(
    "/business-partners"
  );

  return response.data;
};

export const getOutstandingSummary = async (
  axiosInstance: AxiosInstance
): Promise<OutstandingSummary> => {
  const response = await axiosInstance.get<OutstandingSummary>(
    "/business-partners/outstanding-summary"
  );

  return response.data;
};

export const getCreditOverview = async (
  axiosInstance: AxiosInstance
): Promise<CreditOverview> => {
  const response = await axiosInstance.get<CreditOverview>(
    "/business-partners/credit-overview"
  );

  return response.data;
};


export const getAgeingDistribution = async (
  axiosInstance: AxiosInstance
): Promise<AgeingBucketResponse[]> => {
  const response = await axiosInstance.get<AgeingBucketResponse[]>(
    "/business-partners/ageing-distribution"
  );

  return response.data;
};