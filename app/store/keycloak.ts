import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface KeycloakStore {
  authenticated: false;
  token: string;
  user: any;
  profile: any;
}

export const useKeyCloakStore = create<KeycloakStore>()(
  persist(
    (set, get) => ({
      authenticated: false,
      token: "",
      user: {},
      profile: {},
    }),
    {
      name: "keycloak-store",
      version: 1,
      // storage: createJSONStorage(() => kvStorage),
    },
  ),
);
