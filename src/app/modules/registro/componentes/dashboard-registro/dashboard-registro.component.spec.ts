import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardRegistroComponent } from './dashboard-registro.component';

describe('DashboardRegistroComponent', () => {
  let component: DashboardRegistroComponent;
  let fixture: ComponentFixture<DashboardRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardRegistroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
