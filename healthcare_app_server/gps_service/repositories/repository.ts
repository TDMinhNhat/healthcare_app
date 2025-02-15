interface IRepository<T,P> {
    add(T: object): T;
    delete(P: string): boolean;
    getAll(): T[];
    getById(P: string): T;
}

export { IRepository }