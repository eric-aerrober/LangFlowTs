/*
    Entry point for the executor.
    Assumes the config has allready been set
*/

import { Config, defaultConfig } from "./config";

export class Executor {

    private useConfig: Config;

    constructor (config?: Config) {
        this.useConfig = config || defaultConfig;
    }    





}