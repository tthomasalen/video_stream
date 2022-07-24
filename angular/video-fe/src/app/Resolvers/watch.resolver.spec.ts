import { TestBed } from '@angular/core/testing';

import { WatchResolver } from './watch.resolver';

describe('WatchResolver', () => {
  let resolver: WatchResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(WatchResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
