import { atom } from "recoil";

export interface AgentRun {
  id: string;
  timestamp: number;
  data: {
    [key: string]: number
  }
  root: string;
}

export interface AgentRuns {
  runs: {
    [id: string]: AgentRun
  },
  lastUpdated: number
}

export const agentRunCollection = atom({
  key: "simulartionRuns",
  default: {
    runs: {}
  } as AgentRuns,
});
