import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";

export const useDocumentStore = create((set) => ({
  documents: [],
  document: null,
  isLoading: false,

  getDocuments: async (id) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(id ? `/documents?folder=${id}` : `/documents`);
      set({ documents: res.data });
    } catch (error) {
      console.error(error?.response?.data?.message);
    } finally {
      set({ isLoading: false });
    }
  },

}));