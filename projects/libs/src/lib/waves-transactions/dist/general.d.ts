import { ICancelOrder, TTx, TTxParams, TOrder, WithTxType, IAuthParams } from './transactions';
import { TSeedTypes } from './types';
import { TSignedData } from './requests/custom-data';
export declare const txTypeMap: {
    [type: number]: {
        sign: (tx: TTx | TTxParams & WithTxType, seed: TSeedTypes) => TTx;
    };
};
/**
 * Signs arbitrary transaction. Can also create signed transaction if provided params have type field
 * @param tx
 * @param seed
 */
export declare function signTx(tx: TTx | TTxParams & WithTxType, seed: TSeedTypes): TTx;
/**
 * Converts transaction or order object to Uint8Array
 * @param obj transaction or order
 */
export declare function serialize(obj: TTx | TOrder): Uint8Array;
/**
 * Verifies signature of transaction or order
 * @param obj
 * @param proofN - proof index. Takes first proof by default
 * @param publicKey - takes senderPublicKey by default
 */
export declare function verify(obj: TTx | TOrder, proofN?: number, publicKey?: string): boolean;
export declare function verifyCustomData(data: TSignedData): boolean;
export declare function verifyAuthData(authData: {
    signature: string;
    publicKey: string;
    address: string;
}, params: IAuthParams, chainId?: string | number): boolean;
export declare function verifyWavesAuthData(authData: {
    signature: string;
    publicKey: string;
    address: string;
    timestamp: number;
}, params: {
    publicKey: string;
    timestamp: number;
}, chainId?: string | number): boolean;
/**
 * Sends order to matcher
 * @param ord - transaction to send
 * @param options - matcher address to send order to. E.g. https://matcher.wavesplatform.com/. Optional 'market' flag to send market order
 */
export declare function submitOrder(ord: TOrder, options: {
    matcherUrl: string;
    market?: boolean;
}): Promise<any>;
/**
 * Sends order to matcher
 * @param ord - transaction to send
 * @param matcherUrl - matcher address to send order to. E.g. https://matcher.wavesplatform.com/
 */
export declare function submitOrder(ord: TOrder, matcherUrl: string): Promise<any>;
/**
 * Sends cancel order command to matcher. Since matcher api requires amountAsset and priceAsset in request url,
 * this function requires them as params
 * @param co - signed cancelOrder object
 * @param amountAsset - amount asset of the order to be canceled
 * @param priceAsset - price asset of the order to be canceled
 * @param matcherUrl - matcher address to send order cancel to. E.g. https://matcher.wavesplatform.com/
 */
export declare function cancelSubmittedOrder(co: ICancelOrder, amountAsset: string | null, priceAsset: string | null, matcherUrl: string): Promise<any>;
