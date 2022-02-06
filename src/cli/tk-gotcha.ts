#!/usr/bin/env node
import cli from 'commander';
import parser from '@/parser';
import { uniq, urlNorm } from '@/utils';
import { outFmt, errFmt } from '@/formatter';
import getter from '@/getter';

const KEY_SHA_SALT = 'IM_SECRET';
const SEC_BACKOFF = 60;
const SEC_BETWEEN_REQUESTS = 1;

cli
  .description('tk-gotcha: toy app')
  .arguments('<user-input...>')
  .option('--secret <secret>', `override environment variable ${KEY_SHA_SALT}`)
  .action(async (userinput: string[], opts: any) => {
    const shaSecret = opts.secret ?? process.env[KEY_SHA_SALT];
    if (!shaSecret) {
      throw `Please set the secret value '${KEY_SHA_SALT}'.`;
    }
    await parser(userinput.join(''))
      .map(urlNorm)
      .filter(uniq())
      .map(getter(SEC_BACKOFF, SEC_BETWEEN_REQUESTS))
      .map((promise) => promise.then((s) => outFmt(s, shaSecret)).catch(errFmt))
      .forEach((promise) => promise.then(console.log).catch(console.error));
  })
  .parseAsync()
  .catch((e) => console.error('ERROR: ', e));
