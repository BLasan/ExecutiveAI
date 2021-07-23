/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ClusteringPredictComponent } from './clustering-predict.component';

describe('ClusteringPredictComponent', () => {
  let component: ClusteringPredictComponent;
  let fixture: ComponentFixture<ClusteringPredictComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClusteringPredictComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClusteringPredictComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
