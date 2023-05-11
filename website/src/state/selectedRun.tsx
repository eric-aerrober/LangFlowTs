import { atom } from "recoil";

export const selectedRun = atom({
  key: "selectedRun",
  default: undefined as string | undefined,
});
