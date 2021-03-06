/**
 * @module index
 */
export declare type TOption<T> = T | undefined | null;
export interface IIndexSeedMap {
    [key: number]: string;
}
export declare type TPrivateKey = {
    privateKey: string;
};
export declare type TSeedTypes = string | TOption<string | TPrivateKey>[] | IIndexSeedMap | TPrivateKey;
