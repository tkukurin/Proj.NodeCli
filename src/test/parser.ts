import {expect} from "chai";
import {UserQueryParser} from '@/parser';
import parser from '@/parser';


describe('online streaming parser', () => {
  it('keeps state between invocations for online updates', () => {
    const parser = new UserQueryParser();
    const chunks = ['[ partial ', 'www.a.com', ']', '[www.b', '.com', ']'];
    const urls = chunks.flatMap(c => [...parser.update(c)]);
    expect(urls).to.have.all.members(['www.a.com', 'www.b.com']);
  });
});

describe('parser', () => {
  it('simple url in brackets', () => {
    const s = '[ www.google.com ]';
    expect(parser(s)).to.have.all.members(['www.google.com']);
  });

  it('simple url not in brackets', () => {
    const s = 'www.google.com';
    expect(parser(s)).to.have.all.members([]);
  });

  it('multiple urls, nested brackets', () => {
    const s = '[ www.a.com [www.b.com] not url realy ]';
    expect(parser(s)).to.have.all.members(['www.b.com']);
  });

  it('multiple urls in same bracket chooses last', () => {
    const s = '[ not url www.a.com mid www.b.com]';
    expect(parser(s)).to.have.all.members(['www.b.com']);
  });

  it('multiple urls, sequential brackets', () => {
    const s = '[ www.a.com ] [www.b.com]';
    expect(parser(s)).to.have.all.members(['www.a.com', 'www.b.com']);
  });

  it('nested brackets, last deeply nested with url', () => {
    const s = '[ www.a.com  [www.b.com] [[www.c.com]]]'
    expect(parser(s)).to.have.all.members(['www.c.com']);
  });

  it('nested brackets, last without URL', () => {
    const s = '[ notUrl  [www.b.com] [[notUrl]]]';
    expect(parser(s)).to.have.all.members(['www.b.com']);
  });

  it('escape state', () => {
    // Actual slashes sent after conversion:
    //            \[                   \[            \]
    const s = '[ \\[ notUrl www.b.com \\[ www.c.com \\] ]';
    expect(parser(s)).to.have.all.members(['www.c.com']);
  });

  it('handles multi-escape state', () => {
    // Actual slashes sent after conversion:
    //           \\[           \\\[             \\[
    const s = '\\\\[ notUrl \\\\\\[ www.b.com \\\\[ www.c.com ] ]';
    expect(parser(s)).to.have.all.members(['www.c.com']);
  });

  it('handles more closing than opening brackets', () => {
    const s = ']]]]]]]]] [www.a.com]';
    expect(parser(s)).to.have.all.members(['www.a.com']);
  });

  it('url with special characters, uppercase and [ escaped', () => {
    const s1 = 'one url [bla www.fIrst.xyz/ab?xyz=123\\[escaped ]';
    expect(parser(s1)).to.have.all.members(['www.fIrst.xyz/ab?xyz=123[escaped']);
  });

  it('examples ignore inner brackets', () => {
    const s1 = 'multiple lvls[ [www.first.com] www.second.com]';
    expect(parser(s1)).to.have.all.members(['www.second.com']);
    const s2 = '>1 lvls[ www.first.com [www.third.com]]';
    expect(parser(s2)).to.have.all.members(['www.third.com']);
  })
});

