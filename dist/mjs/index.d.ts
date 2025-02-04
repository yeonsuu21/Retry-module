export type RetryResponseOptions = {
    maxRetries: number;
    initialDelay: number;
    timeOut: number;
};
export declare const RetryRequestWithTimeout: (fn: (...args: any) => Promise<any>, params: any, retryOptions?: RetryResponseOptions) => Promise<any>;
