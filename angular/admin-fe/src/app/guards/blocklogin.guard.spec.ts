import { TestBed } from '@angular/core/testing';

import { BlockloginGuard } from './blocklogin.guard';

describe('BlockloginGuard', () => {
  let guard: BlockloginGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(BlockloginGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
