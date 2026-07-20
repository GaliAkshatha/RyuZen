import { ICacheService } from "../../core/cache/ICacheService.js";

import { env } from "../../../config/env.js";

interface CacheEntry<T> {

    value: T;

    expiresAt: number;

}

/*
 In-memory cache adapter.

 No external cache service (Redis or similar) is configured in
 this environment. Entries live in a process-local Map with lazy
 TTL expiration (checked on read), which is sufficient for a
 single-instance deployment. If this backend is ever scaled to
 multiple instances, swap this implementation for a real
 ICacheService adapter backed by a shared store (for example
 Redis) — no other file needs to change, since every caller
 depends only on the ICacheService port.
*/
export class InMemoryCacheService
implements ICacheService {

    private readonly store =

        new Map<string, CacheEntry<unknown>>();

    async get<T>(

        key: string

    ): Promise<T | null> {

        const entry =

            this.store.get(key);

        if (!entry) {

            return null;

        }

        if (entry.expiresAt <= Date.now()) {

            this.store.delete(key);

            return null;

        }

        return entry.value as T;

    }

    async set<T>(

        key: string,

        value: T,

        ttlSeconds: number = env.CACHE_DEFAULT_TTL_SECONDS

    ): Promise<void> {

        this.store.set(

            key,

            {

                value,

                expiresAt:
                    Date.now() + (ttlSeconds * 1000)

            }

        );

    }

    async delete(

        key: string

    ): Promise<void> {

        this.store.delete(

            key

        );

    }

    async clear(): Promise<void> {

        this.store.clear();

    }

}

/*
 Module-level singleton so every container shares the same cache
 state, consistent with how a process-wide cache is expected to
 behave.
*/
export const cacheService = new InMemoryCacheService();
