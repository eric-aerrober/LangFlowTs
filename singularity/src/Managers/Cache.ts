/*
    Calls are expensive, so we cache them whenever possible
*/

import md5 from 'md5';
import * as fs from 'fs';

interface CacheItem<Key, Value> {
    key: Key;
    value: Value;
}

export class Cache<Key, Value> {

    private cache: Map<string, Value> = new Map();

    public async resolve(key: Key, lookup: () => Promise<Value>) {

        const cached = await this.tryLoad(key);
        if (cached) {
            return {
                cached: true,
                value: cached.value
            }
        }
        
        const result = await lookup();
        await this.doSave(key, result);

        return {
            cached: false,
            value: result
        };
    }

    private stringifyKey(key: Key) {
        return md5(JSON.stringify(key))
    }

    private async tryLoad (item: Key){
        
        const key = this.stringifyKey(item);

        if (this.cache.has(key)) {
            return this.cache.get(key);
        }
        
        if (fs.existsSync(`./cache/${key}.json`)) {
            const data = fs.readFileSync(`./cache/${key}.json`).toString();
            return JSON.parse(data as any);
        }
    }

    private async doSave (item: Key, value: Value) {
        const key = this.stringifyKey(item);
        const cacheItem: CacheItem<Key, Value> = {key: item, value}
        const raw = JSON.stringify(cacheItem, null, 2);
        fs.writeFileSync(`./cache/${key}.json`, raw);
        this.cache.set(key, value);
    }

}