export abstract class BaseRepository<TEntity> {

    abstract create(
        entity: TEntity
    ): Promise<TEntity>;

    abstract findById(
        id: string
    ): Promise<TEntity | null>;

    abstract save(
        entity: TEntity
    ): Promise<TEntity>;

    abstract delete(
        id: string
    ): Promise<void>;

}