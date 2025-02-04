# Retry-module

## Description

지수 백오프 로직을 이용하여 API응답이 지연되면 API요청을 취소하고 일정 횟수만큼 재시도 요청을 수행하는 라이브러리입니다.
A library that uses an exponential backoff logic to cancel an API request if the response is delayed and retries the request a certain number of times.

---

클라이언트가 지정된 시간이 지나도 서버로부터 응답을 받지 못하면 요청을 취소하며
사용자가 지정한 횟수와 시간내에 backOff전략을 통해 점진적으로 요청들을 다시 보내 서버의 응답값을 받을 수 있게하는 역할을 함

## Dependency

- library를 사용하기 위한 node의 최소 버전은 20.11.0 입니다.
- fetch : 전 버전 지원가능
- Axios : v.0.22.0 이상
- node.js : v.15.0.0 이상

## Usage

```jsx
await RetryRequestWithTimeout(fn, params, retryOptions);
```

```jsx
// service 에서 사용 예시
getEvents = async (request: getEventsRequest, params: RequestParams = {}) =>
  await RetryRequestWithTimeout(
    this.request,
    {
      path: "/api/v1/events", // API 경로
      method: "GET",
      query: request.query, // 쿼리 파라미터
      format: "json", // 응답 형식
      ...params, // 추가적인 파라미터 (headers 등)
    },
    { maxRetries: 5, initialDelay: 1000, timeOut: 5000 }
  );
```

## API

| Method                  | Description                                                                                                                               |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| RetryRequestWithTimeout | 응답이 오면 타임아웃을 해지하고 응답을 반환하고, 응답이 timeout만큼 오지않으면 다시 API요청을 재시도 합니다.                              |
| countController         | - 재시도 횟수(count)의 초기값을 정의하고 재시도 횟수를 1개 증가하여 업데이트 합니다.                                                      |
| setAbortSignal          | AbortController() 호출을 통해 abortController를 선언하고 abortController를 통해 signal을 정의합니다.                                      |
| shouldRetry             | 최대 재시도횟수와 현재 재시도횟수를 비교하여 재시도 가능 여부를 반환하고,현재 재시도 횟수가 최대 재시도횟수보다 작으면 ture를 반환합니다. |
| setDelay                | 지수 Backoff 알고리즘을 이용하여 다음 API요청까지의 대기시간을 계산합니다.                                                                |
