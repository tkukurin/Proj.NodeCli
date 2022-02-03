import {AxiosResponse, AxiosError} from 'axios';
import {hash} from './utils';

/** Regex-based tag match. Use DOM parser if sth more complex required. */
const htmlTitleRe = /<title\b.*>(.*)<\/title>/;
export const extractTitleTag = (s: string) => htmlTitleRe.exec(s)?.[1];

// cf. https://stackoverflow.com/questions/201323/how-can-i-validate-an-email-address-using-a-regular-expression
const rfc5322Re = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
/** RFC5322 mail regex. Undefined if no email is present */
export const extractFirstEmail = (s: string) => rfc5322Re.exec(s)?.[0];

export class DefaultFormatter {
  constructor(private hashSalt: string) {}

  fmtOut(response: AxiosResponse) {
    const email = extractFirstEmail(response.data);
    return {
      url: response.config.url,
      title: extractTitleTag(response.data),
      email: email ? hash(email, this.hashSalt) : undefined
    }
  }

  fmtErr(err: AxiosError) {
    return {
      name: err.name,
      msg: err.message,
      url: err.config.url
    };
  }
}

