import { InjectionToken, Provider } from '@angular/core'
import { ContractService } from '@services/contract/contract.service'
import { catchError, filter, map, tap } from 'rxjs/operators'
import { translate } from '@ngneat/transloco'
import { MatSnackBar } from '@angular/material/snack-bar'
import { LoadingWrapper, LoadingWrapperModel } from '@libs/loading-wrapper/loading-wrapper'
import { ContractCertificateModel } from '@services/contract/contract.model'

export const CERTS = new InjectionToken<LoadingWrapperModel<ContractCertificateModel[]>>(
    'A stream with contracts list'
)

export const CERTS_PROVIDERS: Provider[] = [
  {
    provide: CERTS,
    deps: [ContractService, MatSnackBar],
    useFactory: grantsFactory
  }
]

export function grantsFactory (
    contractService: ContractService,
    snackBar: MatSnackBar
): LoadingWrapperModel<ContractCertificateModel[]> {
  return new LoadingWrapper(
      contractService.streamTasks.pipe(
          map((data: ContractCertificateModel[]) => {
            return data.filter((item) => {
              return item?.status?.value  === 'accepted'
            });
          }),
          catchError((error) => {
            // Todo обработать ошибки в нормальное сообщение
            snackBar.open(error, translate('messages.ok'))
            return []
          }))
  )
}
