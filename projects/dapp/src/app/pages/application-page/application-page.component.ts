import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, ElementRef, Inject,
  OnDestroy,
  OnInit, PLATFORM_ID, ViewChild,
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
import { UserService } from '@services/user/user.service'


export interface MapCoords extends ApplicationPositionModel {
  mapLat: number
  mapLng: number
}

@Component({
  selector: 'app-application-page',
  templateUrl: './application-page.component.html',
  styleUrls: ['./application-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicationPageComponent implements OnInit, OnDestroy, AfterViewInit {

  @DestroyedSubject()
  private destroyed$!: Subject<null>

  private gMap$: Subject<GoogleMapsAPIWrapper> = new Subject()

  @ViewChild('joystickNode') joystickNode: ElementRef | undefined;

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
  joystick: Joystick|null;
  constructor (
      private applicationService: ApplicationService,
      private geoService: GeoService,
      private cdr: ChangeDetectorRef,
      public userService: UserService,
      @Inject(PLATFORM_ID) platformId: object,
      @Inject(APP_CONSTANTS) public constants: AppConstantsInterface,
  ) {
    this.joystick = null;
    this.isBrowser = isPlatformBrowser(platformId);
  }


  ngOnInit (): void {
    combineLatest([this.gMap$, this.map$])
    .pipe(takeUntil(this.destroyed$))
    .subscribe(([gMap, position]) => {
      gMap.setCenter(position);
    })

    // this.contacts$.subscribe((val) => {
    //   console.log('cc', val);
    // });
    // combineLatest([this.gMap$, this.map$, this.contacts$])
    //   .pipe(takeUntil(this.destroyed$))
    //   .subscribe(([gMap, position, contacts]) => {
    //     // contacts.some( (contact)=> {
    //     //   gMap.containsLocation(this.hexagonPipe.transform(contact.point), position)
    //     //
    //     // })
    //     console.log('c', contacts);
    //
    //   })
  }

  ngAfterViewInit (){
    if (this.isBrowser && this.joystickNode) {
      this.joystick = new Joystick (this.joystickNode.nativeElement as HTMLElement, this.applicationService);
    }
  }

  trackByFn (index: number) {
    return index
  }

  mapReady (gMap: GoogleMapsAPIWrapper) {
    this.gMap$.next(gMap)
  }

  ngOnDestroy () {
    if (this.joystick){
      this.joystick.destroy();
    }
  }

  helping (protocol: string) {
    combineLatest([
      this.applicationService.position,
      this.contacts$
    ])
    .pipe(take(1))
    .subscribe(([position, contracts]) => {
      if (contracts && contracts[0]) {
        this.geoService.activationProtocol(contracts[0], position, protocol)
        // console.log('contracts', contracts);

      } else {

      }
    })
  }

  warning (protocol: string){
    combineLatest([
      this.applicationService.position,
      this.contacts$
    ])
      .pipe(take(1))
      .subscribe(([position, contracts]) => {
        if (contracts && contracts[0]) {
          this.geoService.warningProtocol(contracts[0], position, protocol)
        } else {

        }
      })
  }



}
