import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetCertificatePageComponent } from './get-certificate-page.component';

describe('GetCertificatePageComponent', () => {
  let component: GetCertificatePageComponent;
  let fixture: ComponentFixture<GetCertificatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetCertificatePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GetCertificatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
