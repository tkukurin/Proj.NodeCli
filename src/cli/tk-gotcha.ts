#!/usr/bin/env node
import cli from 'commander';
import parser from '@/parser';
import {uniq, urlNorm} from '@/utils';
import {DefaultFormatter} from '@/formatter';
import getter from '@/getter';

const KEY_SHA_SALT = 'IM_SECRET'
const SEC_TIMEOUT = 5;
const SEC_BETWEEN_REQUESTS = 1;

const shaSecret = process.env[KEY_SHA_SALT];
if (!shaSecret) {
  throw `Please set the '${KEY_SHA_SALT}' environment variable.`;
}

cli
  .description('tk-gotcha: toy app')
  .arguments('<user-input...>')
  .action((userinput: Array<string>) => {
    const fmt = new DefaultFormatter(shaSecret);
    parser(userinput.join(''))
      .map(urlNorm)
      .filter(uniq())
      .map(getter(SEC_TIMEOUT, SEC_BETWEEN_REQUESTS))
      .map(promise => promise.then(x => fmt.fmtOut(x)).catch(x => fmt.fmtErr(x)))
      .forEach(promise => promise.then(console.log).catch(console.error));
  }).parse();

