import { SafePipe } from './safe.pipe';

describe('SafeUrlPipe', () => {
  it('create an instance', () => {
    const pipe = new SafePipe();
    expect(pipe).toBeTruthy();
  });
});
