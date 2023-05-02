import md5 from 'md5';
import { tryLoadFromCache } from "./Interface";
import { saveToCache } from "./Interface";

export interface CacheConfig {
    cacheDirectory: string;
}

interface CacheItem<Key, Value> {
    key: Key;
    value: Value;
}

export class Cache<Key, Value> {

    private config: CacheConfig;
    private cache: Map<string, Value>;

    constructor (config: Partial<CacheConfig>) {
        this.config = {
            cacheDirectory: './cache',
            ...config
        }
        this.cache = new Map();
    }

    public async resolve(key: Key, lookup: () => Promise<Value>) {

        const cached = await this.tryLoad(key);
        if (cached) return cached.value;

        const result = await lookup();
        await this.doSave(key, result);

        return result;
    }

    private stringifyKey(key: Key) {
        return md5(JSON.stringify(key))
    }

    private async tryLoad (item: Key){
        
        const key = this.stringifyKey(item);

        if (this.cache.has(key)) {
            return this.cache.get(key);
        }

        const data = await tryLoadFromCache(key);

        if (data) {
            return JSON.parse(data as any);
        }

    }

    private async doSave (item: Key, value: Value) {

        const key = this.stringifyKey(item);

        const cacheItem: CacheItem<Key, Value> = {key: item, value}
        const raw = JSON.stringify(cacheItem, null, 2);

        await saveToCache(key, raw)
        
        this.cache.set(key, value);
    }


}