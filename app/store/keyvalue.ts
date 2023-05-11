import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";
import { useKeyCloakStore } from "../store/keycloak";

const getHeaders = () => {
  return {
    Accept: "application.json",
    "Content-Type": "application/json",
    Authorization: "Bearer " + useKeyCloakStore.getState().token,
  };
};

const getKV = async (key: string) => {
  if (!useKeyCloakStore.getState().token) return null;

  const res = await fetch(`https://api.steedos.cn/keyvalue/v1/${key}`, {
    method: "GET",
    headers: getHeaders(),
  });

  const data = await res.json();
  if (data && data.value) return JSON.stringify(data.value);
  else return null;
};

const setKV = async (key: string, value: any) => {
  if (!useKeyCloakStore.getState().token) return null;
  await fetch(`https://api.steedos.cn/keyvalue/v1/${key}`, {
    method: "PUT",
    body: value,
    headers: getHeaders(),
  });
};

const delKV = async (key: string) => {
  if (!useKeyCloakStore.getState().token) return null;
  await fetch(`https://api.steedos.cn/keyvalue/v1/${key}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
};

// Custom storage object
export const createKVStorage = (appName: string) => {
  const kvStorage: StateStorage = {
    getItem: async (key: string): Promise<string | null> => {
      console.log(key, "has been retrieved");
      return (await getKV(appName + "-" + key)) || null;
    },
    setItem: async (key: string, value: string): Promise<void> => {
      console.log(key, "with value", value, "has been saved");
      await setKV(appName + "-" + key, value);
    },
    removeItem: async (key: string): Promise<void> => {
      console.log(key, "has been deleted");
      await delKV(appName + "-" + key);
    },
  };
  return createJSONStorage(() => kvStorage);
};

export interface KeyValueStore {
  token: any;
  _hasHydrated: any;
  updateToken: (_: string) => void;
  setHasHydrated: (_: boolean) => void;
}

export const useKeyValueStore = create<KeyValueStore>()(
  persist(
    (set, get) => ({
      token: "",
      _hasHydrated: false,
      setHasHydrated: (state: any) => {
        set({
          _hasHydrated: state,
        });
      },
      updateToken(token: string) {
        set(() => ({ token }));
      },
    }),
    {
      name: "keyvalue-store",
      version: 1,
      storage: createKVStorage("chatgpt"),
      onRehydrateStorage: () => (state, error) => {
        console.log("onRehydrateStorage", state);
        if (error) {
          console.log("an error happened during hydration", error);
        } else {
          console.log("hydration finished");
          state?.setHasHydrated(true);
        }
      },
    },
  ),
);
