#!/usr/bin/env node
import cli from 'commander';
import parser from '@/parser';
import {UniqFilter, urlNorm} from '@/utils';

cli
  .description('tk-gotcha: toy app')
  .arguments('<user-input...>')
  .action((userinput: Array<string>) => {
    const f = new UniqFilter();
    const p = parser(userinput.join(''))
      .map(urlNorm)
      .filter(x => f.seen(x));

    console.log(p);
  }).parse();

