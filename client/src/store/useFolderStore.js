import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";

export const useFolderStore = create((set) => ({
  folders: [],
  isLoading: false,

  setFolders: (folders) => set({ folders }),

  getFolders: async (id) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(id ? `/folders?parent=${id}` : `/folders`);
      console.log("folders", res.data);
      set({ folders: res.data });
    } catch (error) {
      console.error(error?.response?.data?.message);
    } finally {
      set({ isLoading: false });
    }
  },
}));