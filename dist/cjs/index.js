"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetryRequestWithTimeout = void 0;
const countController = () => {
    let count = 0;
    const addCount = () => {
        count = count + 1;
        return count;
    };
    const getCount = () => count;
    return { addCount, getCount };
};
const setAbortSignal = () => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    return { abortController, signal };
};
const shouldRetry = (count, maxRetries) => {
    return count < maxRetries;
};
const setDelay = (count, initialDelay) => {
    // 첫 시도 : 0
    // 2번째 시도 : 1 * initialDelay
    return (Math.pow(2, count - 1) - 1) * initialDelay;
};
const RetryRequestWithTimeout = (fn, params, retryOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { abortController, signal } = setAbortSignal();
    const { addCount, getCount } = countController();
    let count = getCount();
    if (!retryOptions) {
        retryOptions = {
            maxRetries: 5,
            initialDelay: 1000,
            timeOut: 3000,
        };
    }
    while (shouldRetry(count, retryOptions.maxRetries)) {
        count = addCount();
        const makeAbortSignal = setTimeout(() => {
            abortController.abort();
        }, retryOptions.timeOut);
        yield new Promise((resolve) => setTimeout(resolve, setDelay(count, retryOptions.initialDelay)));
        try {
            const res = yield fn(params, signal);
            clearTimeout(makeAbortSignal);
            return res;
        }
        catch (error) {
            //재시도
        }
        clearTimeout(makeAbortSignal);
    }
});
exports.RetryRequestWithTimeout = RetryRequestWithTimeout;
