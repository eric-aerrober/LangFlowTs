import { atom } from "recoil";

export const modalState = atom({
  key: "modalState",
  default: {
    open: false,
    data: undefined as any,
  },
});
