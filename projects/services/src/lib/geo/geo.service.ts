import {Inject, Injectable} from '@angular/core'
import { API, AppApiInterface } from '@constants'
import {HttpClient} from '@angular/common/http'
import {Observable} from 'rxjs'
import {publishReplay, refCount, take} from 'rxjs/operators'
import {GeoContractModel, GeoContractUpdatedModel} from './geo.model'
import {ApplicationRegisterModel} from '@services/application/application.model'

@Injectable({
  providedIn: 'root'
})
export class GeoService {
  private apiGetGeoContracts = new URL('/geo/contracts', this.api.geo)
  private apiRegisterOnContract = new URL('/geo/register', this.api.geo)

  private geoContracts$: Observable<GeoContractModel[]> = this.http.get<GeoContractModel[]>(this.apiGetGeoContracts.href, {
    headers: {
      accept: 'application/json; charset=utf-8'
    }
  }).pipe(publishReplay(1), refCount())

  constructor (
    private readonly http: HttpClient,
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

}
