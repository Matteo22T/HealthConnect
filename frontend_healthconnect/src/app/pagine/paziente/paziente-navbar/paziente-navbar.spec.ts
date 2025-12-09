import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PazienteNavbar } from './paziente-navbar';

describe('PazienteNavbar', () => {
  let component: PazienteNavbar;
  let fixture: ComponentFixture<PazienteNavbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PazienteNavbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PazienteNavbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
