/**
 * @module index
 */
import { TSeed } from '@waves/ts-lib-crypto';
import { IDataEntry } from '../transactions';
export interface ICustomDataV1 {
    version: 1;
    /**
     * base64 encoded UInt8Array
     */
    binary: string;
    publicKey?: string;
}
export interface ICustomDataV2 {
    version: 2;
    data: IDataEntry[];
    publicKey?: string;
}
export declare type TCustomData = ICustomDataV1 | ICustomDataV2;
export declare type TSignedData = TCustomData & {
    /**
     * base58 public key
     */
    publicKey: string | undefined;
    /**
     * base58 encoded blake2b(serialized data)
     */
    hash: string;
    /**
     * base58 encoded signature
     */
    signature: string | undefined;
};
/**
 * Signs [[TCustomData]]
 */
export declare function customData(cData: TCustomData, seed?: TSeed): TSignedData;
export declare function serializeCustomData(d: TCustomData): Uint8Array;
