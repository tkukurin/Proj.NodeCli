/** Throttle and basic backoff for GET requests. */
import axios from 'axios';
import {AxiosResponse} from 'axios';
import throttledQueue from 'throttled-queue';

/**
 * Do backoff *once* (`failTimeoutSec` delay) on GET failure.
 * Wait `secBetweenRequests` seconds between each request.
 */
export default (failTimeoutSec: number, secBetweenRequests: number) => {
  const throttleQ = throttledQueue(1, secBetweenRequests * 1000);
  const throttleGet = (u: string) => throttleQ(() => axios.get(u));
  return (url: string): Promise<AxiosResponse> =>
    throttleGet(url).catch(e => {
      console.error('Retrying:', e.config.url);
      return new Promise<AxiosResponse>((acc, rej) => {
        setTimeout(
          () => Promise.resolve().then(() => throttleGet(url)).then(acc).catch(rej),
          failTimeoutSec * 1000);
      });
    });
}

