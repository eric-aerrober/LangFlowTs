import { atom } from "recoil";

export interface Chat {
    id: string
    name: string
    role: string
    messages: string[]
}

export interface DataObject {
    id: string
    name: string
    type: string
    metadata: any
    childrenActionContextIds: string[]
    chatContexts: Chat[],
    parentActionContextId: string,
    loading: boolean,
    timeline: {
        id: string
        time: number
    }[]
}

export interface DataObjects {
    [key: string]: DataObject
}

export const dataObjects = atom({
  key: "dataObjects",
  default: {} as DataObjects,
});
