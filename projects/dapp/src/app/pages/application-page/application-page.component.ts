import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core'
import { ApplicationService } from '@services/application/application.service'
import {
  map,
  publishReplay,
  refCount,
  take,
  takeUntil,
  tap,
} from 'rxjs/operators';
import {GeoUtils} from '@libs/geo/geo'
import {combineLatest, Observable, Subject} from 'rxjs'
import { ApplicationPositionModel } from '@services/application/application.model'
import {AgmMap, GoogleMapsAPIWrapper } from '@agm/core'
import {DestroyedSubject} from '@libs/decorators/destroyed-subject.decorator'
import {GeoService} from '@services/geo/geo.service';


export interface MapCoords extends ApplicationPositionModel {
  mapLat: number
  mapLng: number
}

@Component({
  selector: 'app-application-page',
  templateUrl: './application-page.component.html',
  styleUrls: ['./application-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApplicationPageComponent implements OnInit, OnDestroy {

  @DestroyedSubject()
  private destroyed$!: Subject<null>

  private gMap$: Subject<GoogleMapsAPIWrapper> = new Subject()

  public contacts$ = this.applicationService.contracts$.pipe(tap((data) => {
    console.log('data', data)
  }), publishReplay(1), refCount())

  public readonly map$: Observable<MapCoords> = this.applicationService.position.pipe(map((position) => {
    const deltaY = GeoUtils.meterToLat(300)
    const deltaX = GeoUtils.meterToLng(300, position.lat)

    return {
      ...position,
      mapLat: position.lat + deltaY,
      mapLng: position.lng - deltaX
    }
  }))

  public readonly speed$ = this.applicationService.speed$.pipe(takeUntil(this.destroyed$))
  public readonly movement$ = this.applicationService.movement$.pipe(takeUntil(this.destroyed$))
  public readonly direction$ = this.applicationService.direction$.pipe(takeUntil(this.destroyed$))

  constructor (
      private applicationService: ApplicationService,
      private geoService: GeoService,
  ) {

  }

  ngOnInit (): void {
    combineLatest([this.gMap$, this.map$])
    .pipe(takeUntil(this.destroyed$))
    .subscribe(([gMap, position]) => {
      console.log('Set position')
      gMap.setCenter(position)
    })
  }

  trackByFn (index: number) {
    return index
  }

  mapReady (gMap: GoogleMapsAPIWrapper) {
    this.gMap$.next(gMap)
  }

  ngOnDestroy () {}

  createEmergencySituation(protocol: string) {
    combineLatest([
      this.applicationService.position,
      this.contacts$
    ])
    .pipe(take(1))
    .subscribe(([position, contracts]) => {
      if (contracts && contracts[0]) {
        this.geoService.activationProtocol(contracts[0], position, protocol);
      } else {

      }
    })
  }
}
