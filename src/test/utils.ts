import { expect } from 'chai';
import { uniq } from '@/utils';

describe('uniq', async () => {
  expect([1, 1, 2, 3, 1, 1].filter(uniq())).to.have.all.members([1, 2, 3]);
});
