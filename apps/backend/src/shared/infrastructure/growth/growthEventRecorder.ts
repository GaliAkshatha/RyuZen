import { GrowthEventRepository } from "./GrowthEventRepository.js";
import { RecordGrowthEventUseCase } from "./RecordGrowthEventUseCase.js";

/*
 Module-level singleton, matching cacheService's exact pattern - every
 domain that wants to record a growth event imports this one real
 instance directly, the same lightweight way Logger/cacheService are
 consumed, rather than needing DI container plumbing for something
 this cross-cutting and ownership-free. This is deliberately even
 lighter-weight than Point Ledger's container-wired pattern, because
 Growth Profile genuinely has no business logic of its own to
 substitute in tests - it only ever records what a real domain use
 case already decided happened.
*/
export const growthEventRecorder = new RecordGrowthEventUseCase(

    new GrowthEventRepository()

);
