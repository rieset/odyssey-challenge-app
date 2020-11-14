import {Inject, Injectable} from '@angular/core'
import { API, AppApiInterface } from '@constants'
import {HttpClient} from '@angular/common/http'
import {Observable, Subject} from 'rxjs'
import {publishReplay, refCount, take, tap} from 'rxjs/operators'
import {GeoContractModel, GeoContractUpdatedModel} from './geo.model'
import {
  ApplicationPositionModel,
  ApplicationRegisterModel,
} from '@services/application/application.model'
import { LogService } from '@services/log/log.service'
import {generateAddress} from '@libs/utils/utils.library'

declare const JSEncrypt: object

@Injectable({
  providedIn: 'root'
})
export class GeoService {
  private apiGetGeoContracts = new URL('/geo/contracts', this.api.geo)
  private apiRegisterOnContract = new URL('/geo/register', this.api.geo)
  private apiEmergencyOnContract = new URL('/geo/emergency', this.api.geo)
  private apiWarningOnContract = new URL('/geo/warnings', this.api.geo)

  private geoContracts$: Observable<GeoContractModel[]> = this.http.get<GeoContractModel[]>(this.apiGetGeoContracts.href, {
    headers: {
      accept: 'application/json; charset=utf-8'
    }
  }).pipe(tap(() => {
    this.logService.apply('Get hexagons contracts list: { address, publicKey }[]', 'get')
  }), publishReplay(1), refCount())

  constructor (
    private readonly http: HttpClient,
    private logService: LogService,
    @Inject(API) private readonly api: AppApiInterface
  ) {}

  public get geoContracts (): Observable<GeoContractModel[]> {
    return this.geoContracts$.pipe(take(1))
  }

  public registerToContract (address: string, data: ApplicationRegisterModel) {
    return this.http.post<void>(this.apiRegisterOnContract.href + '/' + address, data, {
      headers: {
        accept: 'application/json; charset=utf-8'
      }
    })
  }

  public activationProtocol (contract: GeoContractUpdatedModel, position: ApplicationPositionModel, protocol: string) {
    const subject  = new Subject()
    // @ts-ignore
    const encrypt = new JSEncrypt()
    encrypt.setPublicKey(contract.publicKeyOperators)
    const message = encrypt.encrypt(JSON.stringify({
      user: 'John Dow',
      lat: position.lat,
      lng: position.lng,
      protocol,
      certificate: []
    }))

    const uuid = generateAddress()

    this.logService.apply(`Emergency encrypted data with public key for operator<br/>{
      emergencyUuid: ${uuid},
      privateData: '...Encrypted message...'
    }`, `send`)

    this.http.post<void>(this.apiEmergencyOnContract.href + '/' + contract.address, {
      emergencyUuid: uuid,
      privateData: message
    }, {
      headers: {
        accept: 'application/json; charset=utf-8'
      }
    }).subscribe((data) => {
      subject.next(data)
    })

    return subject
  }

  public warningProtocol (contract: GeoContractUpdatedModel, position: ApplicationPositionModel, protocol: string) {
    const subject  = new Subject()
    // @ts-ignore
    const encrypt = new JSEncrypt()
    encrypt.setPublicKey(contract.publicKeyOperators)
    const message = encrypt.encrypt(JSON.stringify({
      user: 'John Dow',
      lat: position.lat,
      lng: position.lng,
      protocol,
      certificate: []
    }))

    const uuid = generateAddress()

    this.logService.apply(`Emergency encrypted data with public key for operator<br/>{
      emergencyUuid: ${uuid},
      privateData: '...Encrypted message...'
    }`, `send`)

    this.http.post<void>(this.apiWarningOnContract.href + '/' + contract.address, {
      emergencyUuid: uuid,
      privateData: message
    }, {
      headers: {
        accept: 'application/json; charset=utf-8'
      }
    }).subscribe((data) => {
      subject.next(data)
    })

    return subject
  }

}
