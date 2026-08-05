import type { AxiosInstance } from "axios";
import type { BusinessPartner } from "@/types/businessPartner.types";

export const getBusinessPartners = async (
  axiosInstance: AxiosInstance
): Promise<BusinessPartner> => {
  const response = await axiosInstance.get<BusinessPartner>(
    "/business-partners"
  );

  return response.data;
};