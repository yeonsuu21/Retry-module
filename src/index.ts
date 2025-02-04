export type RetryResponseOptions = {
  maxRetries: number,
  initialDelay: number,
  timeOut: number,
};

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

const shouldRetry = (count: number, maxRetries: number) => {
  return count < maxRetries;
};

const setDelay = (count: number, initialDelay: number) => {
  // 첫 시도 : 0
  // 2번째 시도 : 1 * initialDelay
  return (Math.pow(2, count - 1) - 1) * initialDelay;
};

export const RetryRequestWithTimeout = async (
  fn: (...args: any) => Promise<any>,
  params: any,
  retryOptions?: RetryResponseOptions
) => {
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

    await new Promise((resolve) =>
      setTimeout(resolve, setDelay(count, retryOptions.initialDelay))
    );

    try {
      const res = await fn(params, signal);
      clearTimeout(makeAbortSignal);
      return res;
    } catch (error) {
      //재시도
    }
    clearTimeout(makeAbortSignal);
  }
};
