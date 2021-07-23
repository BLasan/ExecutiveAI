/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TrendTrainComponent } from './trend-train.component';

describe('TrendTrainComponent', () => {
  let component: TrendTrainComponent;
  let fixture: ComponentFixture<TrendTrainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrendTrainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrendTrainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
