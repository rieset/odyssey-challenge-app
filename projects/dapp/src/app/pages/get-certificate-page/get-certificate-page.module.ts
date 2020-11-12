import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { GetCertificatePageRoutingModule } from './get-certificate-page-routing.module';
import { GetCertificatePageComponent } from './get-certificate-page.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';


@NgModule({
  declarations: [GetCertificatePageComponent],
  imports: [
    CommonModule,
    GetCertificatePageRoutingModule,
    MatRadioModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule
  ],
})
export class GetCertificatePageModule { }
