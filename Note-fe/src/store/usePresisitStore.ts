// usePersistStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type PersistStore = {
  token: string | null;
  setToken: (t: string | null) => void;
  removeToken: () => void;
};

const usePersistStore = create<PersistStore>()(
  persist(
    (set) => ({
      token: null,
      setToken: (t) => set({ token: t }),
      removeToken: () => set({ token: null }),
    }),
    {
      name: "token",
    }
  )
);

export default usePersistStore;
