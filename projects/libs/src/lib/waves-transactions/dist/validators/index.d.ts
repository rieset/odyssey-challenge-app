export * from './validators';
export declare const validate: {
    transfer: (tx: Record<string, any>) => boolean;
    massTransfer: (tx: Record<string, any>) => boolean;
    alias: (tx: Record<string, any>) => boolean;
    issue: (tx: Record<string, any>) => boolean;
    reissue: (tx: Record<string, any>) => boolean;
    sponsorship: (tx: Record<string, any>) => boolean;
    burn: (tx: Record<string, any>) => boolean;
    setAssetScript: (tx: Record<string, any>) => boolean;
    cancelLease: (tx: Record<string, any>) => boolean;
    data: (tx: Record<string, any>) => boolean;
    lease: (tx: Record<string, any>) => boolean;
    setScript: (tx: Record<string, any>) => boolean;
    invokeScript: (tx: Record<string, any>) => boolean;
    exchange: (tx: Record<string, any>) => boolean;
    cancelOrder: (tx: Record<string, any>) => boolean;
    customData: (value: unknown) => any;
    order: (value: unknown) => boolean;
    wavesAuth: (tx: Record<string, any>) => boolean;
    auth: (tx: Record<string, any>) => boolean;
};
