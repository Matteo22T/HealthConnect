import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicoNavbar } from './medico-navbar';

describe('MedicoNavbar', () => {
  let component: MedicoNavbar;
  let fixture: ComponentFixture<MedicoNavbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicoNavbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicoNavbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
