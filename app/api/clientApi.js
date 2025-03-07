"use client";
import axiosInstance from "./axiosInstance";

export const postApi = async (api, data, header = {}) => {
  try {
    const response = await axiosInstance.post(api, data, { ...header });
    return {
      error: false,
      data: response.data,
    };
  } catch (error) {
    return {
      error: true,
      message: error?.response?.data?.message || "Something went wrong.",
    };
  }
};

export const getApi = async (api) => {
  try {
    const response = await axiosInstance.get(api);
    return {
      error: false,
      data: response.data,
    };
  } catch (error) {
    return {
      error: true,
      message: error?.response?.data?.message || "Something went wrong.",
    };
  }
};

export const deleteApi = async (api) => {
  try {
    const response = await axiosInstance.delete(api);
    return {
      error: false,
      data: response.data,
    };
  } catch (error) {
    return {
      error: true,
      message: error?.response?.data?.message || "Something went wrong.",
    };
  }
};
