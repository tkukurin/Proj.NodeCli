#!/usr/bin/env node
import cli from 'commander';
import parser from '@/parser';

cli
  .description('tk-gotcha: toy app')
  .arguments('<userinput...>')
  .action((userinput: Array<string>) => {
    const p = parser(userinput.join(''));
    console.log(p);
  }).parse();

