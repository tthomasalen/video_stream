import { TestBed } from '@angular/core/testing';

import { LoginBlockGuard } from './login-block.guard';

describe('LoginBlockGuard', () => {
  let guard: LoginBlockGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(LoginBlockGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
