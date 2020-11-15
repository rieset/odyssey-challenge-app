import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { GetCertificatePageRoutingModule } from './get-certificate-page-routing.module';
import { GetCertificatePageComponent } from './get-certificate-page.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {PipesModule} from '@libs/pipes/pipes.module';
import {TranslocoModule} from '@ngneat/transloco';


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
        MatButtonModule,
        PipesModule,
        TranslocoModule
    ],
})
export class GetCertificatePageModule { }
