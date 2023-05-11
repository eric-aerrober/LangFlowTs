import { atom } from "recoil";

const loadingData = {} as {[id: string] : boolean}

export function setLoading (id: string, value: boolean, setLoadingStates: any) {
    if (loadingData[id] === value) return
    loadingData[id] = value
    setLoadingStates({... loadingData})
}

export const LoadingStates = atom({
    key: "loadingstates",
    default: {} as {[id: string] : boolean},
});
