import { TestBed } from '@angular/core/testing';

import { WatchGuard } from './watch.guard';

describe('WatchGuard', () => {
  let guard: WatchGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(WatchGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
