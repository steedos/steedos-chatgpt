import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";

const getHeaders = () => {
  return {
    Authorization: "Bearer " + (window as any).keycloak?.token,
  };
};

const getKV = async (key: string) => {
  const res = await fetch(`https://api.steedos.cn/keyvalue/v1/chatgpt-${key}`, {
    method: "GET",
    headers: getHeaders(),
  });

  console.log(res);
  return res?.value;
};

const setKV = async (key: string, value: any) => {
  await fetch(`https://api.steedos.cn/keyvalue/v1/chatgpt-${key}`, {
    method: "PUT",
    body: value,
    headers: getHeaders(),
  });
};

const delKV = async (key: string) => {
  await fetch(`https://api.steedos.cn/keyvalue/v1/chatgpt-${key}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
};

// Custom storage object
export const kvStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    console.log(name, "has been retrieved");
    return (await getKV(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    console.log(name, "with value", value, "has been saved");
    await setKV(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    console.log(name, "has been deleted");
    await delKV(name);
  },
};
