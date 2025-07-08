// useStore.ts
import { create } from "zustand";
import type { User } from "../types";
import { persist } from "zustand/middleware";

type Store = {
  user: User;
  setUser: (u: User) => void;
  removeUser: () => void;
};
  
const useStore = create<Store>()(
  persist(
    (set) => ({
      user: {
        email: "",
        data: null,
        name: "",
        notes: [],
      },
      setUser: (u) => set(() => ({ user: u })),
      removeUser: () => {
        // Reset the user state to initial values
        set(() => ({
          user: {
            email: "",
            data: null,
            name: "",
            notes: [],
          },
        }));
        // Remove from localStorage (this will be handled automatically by persist middleware)
        localStorage.removeItem("user");
      },
    }),
    {
      name: "user", // This is the key used in localStorage
    }
  )
);

export default useStore;
