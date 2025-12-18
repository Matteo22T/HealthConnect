import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MieiMedici } from './miei-medici';

describe('MieiMedici', () => {
  let component: MieiMedici;
  let fixture: ComponentFixture<MieiMedici>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MieiMedici]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MieiMedici);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
