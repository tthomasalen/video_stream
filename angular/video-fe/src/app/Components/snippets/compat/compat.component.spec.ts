import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompatComponent } from './compat.component';

describe('CompatComponent', () => {
  let component: CompatComponent;
  let fixture: ComponentFixture<CompatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
