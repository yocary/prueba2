import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestEntrepreneurshipComponent } from './request-entrepreneurship.component';

describe('RequestEntrepreneurshipComponent', () => {
  let component: RequestEntrepreneurshipComponent;
  let fixture: ComponentFixture<RequestEntrepreneurshipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestEntrepreneurshipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestEntrepreneurshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
