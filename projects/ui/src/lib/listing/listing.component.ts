import { Component, Inject, OnInit } from '@angular/core'
import {CERTS, CERTS_PROVIDERS} from './listing.providers'
import {
  ContractCertificateModel,
} from '@services/contract/contract.model';
import { LoadingWrapperModel } from '@libs/loading-wrapper/loading-wrapper'
import { APP_CONSTANTS, AppConstantsInterface } from '@constants'
import {BehaviorSubject, Subject} from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'ui-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.scss'],
  providers: CERTS_PROVIDERS
})
export class ListingComponent implements OnInit {

  constructor (
      @Inject(APP_CONSTANTS) public readonly constants: AppConstantsInterface,
      @Inject(CERTS) public readonly certs: LoadingWrapperModel<ContractCertificateModel[]>,
  ) { }

  ngOnInit (): void {}

  trackByFn (index: number) {
    return index
  }
}
