import { atom } from "recoil";

export const selectedObjects = atom({
  key: "selectedObjects",
  default: [] as string[],
});
