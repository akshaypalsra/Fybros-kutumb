import axios from "axios";
import { AxiosConfig } from "./config/axiosConfig";

export const axiosInstance = axios.create(AxiosConfig);