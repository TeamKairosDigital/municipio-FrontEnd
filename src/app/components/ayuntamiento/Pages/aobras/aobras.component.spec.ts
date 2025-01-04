import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AobrasComponent } from './aobras.component';

describe('AobrasComponent', () => {
  let component: AobrasComponent;
  let fixture: ComponentFixture<AobrasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AobrasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AobrasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
