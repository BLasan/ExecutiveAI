import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectoryManagementComponent } from './directory-management.component';

describe('DirectoryManagementComponent', () => {
  let component: DirectoryManagementComponent;
  let fixture: ComponentFixture<DirectoryManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DirectoryManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectoryManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
