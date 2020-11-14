import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core'
import { ENTITY, ENTITY_PAGE_PROVIDERS } from '@pages/entity-page/entity-page.providers'
import { APP_CONSTANTS, AppConstantsInterface } from '@constants'
import { LoadingWrapperModel } from '@libs/loading-wrapper/loading-wrapper'
import {ContractCertificateModel} from '@services/contract/contract.model';
import {TransactionService} from '@services/transaction/transaction.service';

@Component({
  selector: 'app-entity-page',
  templateUrl: './entity-page.component.html',
  styleUrls: ['./entity-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: ENTITY_PAGE_PROVIDERS
})
export class EntityPageComponent implements OnInit {
  constructor (
      @Inject(APP_CONSTANTS) public readonly constants: AppConstantsInterface,
      @Inject(ENTITY) public readonly entity: LoadingWrapperModel<ContractCertificateModel>,
      private transactionService: TransactionService
  ) {
  }

  ngOnInit (): void {}

  getCertificate(certificate: string) {
    this.transactionService.create(certificate);
  }
}
