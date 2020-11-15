import { Inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import {
  map,
  publishReplay,
  refCount,
  repeatWhen,
  switchMap, takeUntil,
  tap
} from 'rxjs/operators'
import { API, AppApiInterface } from '@constants'
import { BehaviorSubject, from, Observable, Subject } from 'rxjs'
import {
  ContractCertificateModel,
  ContractDataModel,
  ContractRawData,
  ContractRawDataEntityId,
  ContractRawDataNumber,
  ContractRawDataString
} from './contract.model'
import { PreloaderService } from '@services/preloader/preloader.service'
import { SignerService } from '@services/signer/signer.service'
import { IInvokeScriptTransaction, IWithApiMixin } from '@waves/ts-types'

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  private apiGetAddressData = new URL('/addresses/data/' + this.api.contractAddress, this.api.rest)

  private contractRefresh$: Subject<null> = new Subject()

  private readonly contractState = this.http.get<Observable<ContractRawData>>(this.apiGetAddressData.href, {
    headers: {
      accept: 'application/json; charset=utf-8'
    }
  }).pipe(
    // @ts-ignore
    repeatWhen(() => this.contractRefresh$),
      // @ts-ignore
    map((data: ContractRawData) => {
      return this.prepareData(data)
    }),
    tap((data) => {
      console.log('Origin contract data :: projects/services/src/lib/contract/contract.service.ts: 47\n\n', data)
    }),
    publishReplay(1),
    refCount()
  )

  public readonly stream: Observable<ContractDataModel> = this.contractState.pipe(
    publishReplay(1),
    refCount()
  )

  public readonly streamTasks: Observable<ContractCertificateModel[]> = this.contractState.pipe(map((contract) => {
    if (!contract?.template) {
      return []
    }

    return Object.keys(contract?.template).map((entityKey: string) => {
      return {
        ...contract?.template[entityKey],
        id: entityKey
      }
    })
  }))

  constructor (
      private readonly http: HttpClient,
      private readonly signerService: SignerService,
      @Inject(API) private readonly api: AppApiInterface
  ) {}

  public refresh () {
    this.contractRefresh$.next(null)
  }

  private group (keys: string[], context: {[s: string]: object}, value: ContractRawDataString|ContractRawDataNumber): void {
    // Todo поправить типизацию, пришлось лезть в контракт и переделывать структуру данных
    // @ts-ignore
    const key: string = keys.shift()

    if (!key) {
      return
    }

    if (!context[key]) {
      context[key] = keys.length === 0 ? value : {}
    }

    // Todo поправить типизацию, пришлось лезть в контракт и переделывать структуру данных
    // @ts-ignore
    return this.group(keys, context[key], value)
  }

  private prepareData (data: ContractRawData): ContractDataModel {
    // Todo поправить типизацию, пришлось лезть в контракт и переделывать структуру данных
    // @ts-ignore
    return data.reduce((orig, item) => {
      const keys = item.key.split('_')
      this.group(keys, orig, item)
      return orig
    }, {})
  }

  public entityById (entityId: ContractRawDataEntityId): Observable<ContractCertificateModel> {
    return this.stream.pipe(map((data) => {
      return data?.template[entityId]
    }))
  }

  public createCertificate (title: string): Observable<[IInvokeScriptTransaction<string | number> & IWithApiMixin]> {
    return from(this.signerService.invoke('proposeTemplate',
      [{ type: 'string', value: title }]))
  }

  public certificateDescription (
    templateId: string,
    description: string,
    author: string,
    company: string,
    link: string
  ): Observable<[IInvokeScriptTransaction<string | number> & IWithApiMixin]> {
    console.log('Update data', templateId, description, author, company, link)
    return from(this.signerService.invoke('addTemplateDetails', [
      { type: 'string', value: templateId },
      { type: 'string', value: description },
      { type: 'string', value: author },
      { type: 'string', value: company },
      { type: 'string', value: link }
    ]))
  }

  public acceptCertificate (templateId: string): Observable<[IInvokeScriptTransaction<string | number> & IWithApiMixin]> {
    return from(this.signerService.invoke('acceptTemplate', [
      { type: 'string', value: templateId }
    ]))
  }

  public voteForApplicant (
    templateId: string,
    applicantId: string,
    voteValue: number
  ): Observable<[IInvokeScriptTransaction<string | number> & IWithApiMixin]> {
    return from(this.signerService.invoke('voteForApplicant', [
      { type: 'string', value: templateId },
      { type: 'string', value: applicantId },
      { type: 'integer', value: voteValue }
    ]))
  }

  public finishApplicantVoting (
    templateId: string,
    applicantId: string
  ): Observable<[IInvokeScriptTransaction<string | number> & IWithApiMixin]> {
    return from(this.signerService.invoke('voteForApplicant', [
      { type: 'string', value: templateId },
      { type: 'string', value: applicantId }
    ]))
  }

  public requestCertificate (templateId: string, details: string): Observable<[IInvokeScriptTransaction<string | number> & IWithApiMixin]> {
    return from(this.signerService.invoke('requestCertificate', [
      { type: 'string', value: templateId },
      { type: 'string', value: details }
    ]))
  }
}
