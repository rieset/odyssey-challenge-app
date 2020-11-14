import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, Inject,
  OnDestroy,
  OnInit, PLATFORM_ID,
} from '@angular/core'
import { ApplicationService } from '@services/application/application.service'
import {
  map,
  publishReplay,
  refCount,
  take,
  takeUntil,
  tap,
} from 'rxjs/operators'
import {GeoUtils} from '@libs/geo/geo'
import {combineLatest, Observable, Subject} from 'rxjs'
import {
  ApplicationDirectionInputModel,
  ApplicationDirectionModel,
  ApplicationPositionModel,
} from '@services/application/application.model'
import {AgmMap, GoogleMapsAPIWrapper } from '@agm/core'
import {DestroyedSubject} from '@libs/decorators/destroyed-subject.decorator'
import {GeoService} from '@services/geo/geo.service'
import { styles } from './application-page.map'
import {isPlatformBrowser} from '@angular/common';
import Joystick from './joystick'
import {APP_CONSTANTS, AppConstantsInterface} from '@constants';


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
export class ApplicationPageComponent implements OnInit, OnDestroy, AfterViewInit {

  @DestroyedSubject()
  private destroyed$!: Subject<null>

  private gMap$: Subject<GoogleMapsAPIWrapper> = new Subject()

  public contacts$ = this.applicationService.contracts$.pipe(tap((data) => {}), publishReplay(1), refCount())

  public styles = styles;

  public readonly map$: Observable<MapCoords> = this.applicationService.position.pipe(map((position) => {
    const deltaY = GeoUtils.meterToLat(300)
    const deltaX = GeoUtils.meterToLng(300, position.lat)

    this.cdr.markForCheck()
    return {
      ...position,
      mapLat: position.lat + deltaY,
      mapLng: position.lng - deltaX
    }
  }))

  public readonly speed$ = this.applicationService.speed$.pipe(takeUntil(this.destroyed$), map((speed) => {
    return  (speed * 60 * 60 ) / 1000
  }))
  public readonly movement$ = this.applicationService.movement$.pipe(takeUntil(this.destroyed$))
  public readonly direction$ = this.applicationService.direction$.pipe(takeUntil(this.destroyed$))
  isBrowser: boolean;

  constructor (
      private joystick: Joystick,
      private applicationService: ApplicationService,
      private geoService: GeoService,
      private cdr: ChangeDetectorRef,
      @Inject(PLATFORM_ID) platformId: object,
      @Inject(APP_CONSTANTS) public constants: AppConstantsInterface,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }


  ngOnInit (): void {
    combineLatest([this.gMap$, this.map$])
    .pipe(takeUntil(this.destroyed$))
    .subscribe(([gMap, position]) => {
      gMap.setCenter(position)
    })
  }

  ngAfterViewInit (){
    if (this.isBrowser) {
      this.joystick = new Joystick (document.getElementById('joystick-base') as HTMLElement, this.applicationService);
    }
  }

  trackByFn (index: number) {
    return index
  }

  mapReady (gMap: GoogleMapsAPIWrapper) {
    this.gMap$.next(gMap)
  }

  ngOnDestroy () {
    this.joystick.destroy();
  }

  createEmergencySituation (protocol: string) {
    combineLatest([
      this.applicationService.position,
      this.contacts$
    ])
    .pipe(take(1))
    .subscribe(([position, contracts]) => {
      if (contracts && contracts[0]) {
        this.geoService.activationProtocol(contracts[0], position, protocol)
      } else {

      }
    })
  }

  setDerection (direction: ApplicationDirectionInputModel) {
    const d = this.applicationService.direction$.getValue()
    this.applicationService.direction$.next({
      x: (((d.x + (direction.x || 0)) % 2)),
      y: (((d.y + (direction.y || 0)) % 2))
    })
  }
}
