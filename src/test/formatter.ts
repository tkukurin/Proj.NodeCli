import { expect } from 'chai';
import { extractFirstEmail, extractTitleTag } from '@/formatter';

describe('gets emails', () => {
  it('no email', () => {
    const s = 'I am a string without an email';
    const email = extractFirstEmail(s);
    expect(email).to.be.undefined;
  });

  it('basic extract first email', () => {
    const s = 'I am a string me@email.com and another other@gmail.co.uk';
    const email = extractFirstEmail(s);
    expect(email).equal('me@email.com');
  });

  it('extract from href', () => {
    const s = '<a href="mailto:x@gmail.com">x@gmail.com</a>';
    const email = extractFirstEmail(s);
    expect(email).equal('x@gmail.com');
  });

  it('does not get confused by @s', () => {
    const s = 'I am a string me @email.com fail';
    const email = extractFirstEmail(s);
    expect(email).to.be.undefined;
  });
});

describe('gets title tag', () => {
  it('title', () => {
    const s = 'tis is my <title>page title</title> and text around';
    expect(extractTitleTag(s)).equal('page title');
  });

  it('title with id', () => {
    const s = 'tis is my <title id="123">page title</title> and text around';
    expect(extractTitleTag(s)).equal('page title');
  });

  it('title negative', () => {
    const s = 'tis is my <titlenot>page title</title> and text around';
    expect(extractTitleTag(s)).to.be.undefined;
  });
});
