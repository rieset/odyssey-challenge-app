import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {GetCertificatePageComponent} from '@pages/get-certificate-page/get-certificate-page.component';

const routes: Routes = [
  {
    path: '',
    component: GetCertificatePageComponent,
    pathMatch: 'full',
    data: {}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GetCertificatePageRoutingModule { }
