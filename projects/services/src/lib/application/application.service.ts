import {ChangeDetectorRef, Inject, Injectable} from '@angular/core'
import {BehaviorSubject, combineLatest, EMPTY, Observable, of} from 'rxjs'
import {
  ApplicationCertificatePublicModel,
  ApplicationDirectionModel,
  ApplicationPositionModel,
  ApplicationSpeedModel,
  ApplicationStateModel,
  ApplicationTransportModel, ApplicationTransportVariants,
} from '@services/application/application.model'
import {
  bufferCount,
  map, pairwise, startWith,
  switchMap,
  take,
} from 'rxjs/operators'
import {APP_CONSTANTS, AppConstantsInterface} from '@constants'
import { GeoService } from '@services/geo/geo.service'
import {GeoContractUpdatedModel, GeoContractModel} from '@services/geo/geo.model'
import { generateAddress } from '@libs/utils/utils.library'
import {LogService} from '@services/log/log.service'

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  private color = `rgb(${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)})`

  private updateInterval = 3000

  private zoom = 1000

  private earthRadius = 6378.137

  private meterInDegree = (1 / ((2 * Math.PI / 360) * this.earthRadius)) / 1000

  public movement$: BehaviorSubject<ApplicationTransportModel> = new BehaviorSubject('walking' as ApplicationTransportModel)

  private state$: BehaviorSubject<ApplicationStateModel> = new BehaviorSubject('free' as ApplicationStateModel)

  private address: string = generateAddress()

  private certificates: ApplicationCertificatePublicModel[] = [{
    uuid: generateAddress(),
  }]

  private alias: string = generateAddress()

  public direction$: BehaviorSubject<ApplicationDirectionModel> = new BehaviorSubject(
      {
        x: this.getDirectionOnAxis(),
        y: this.getDirectionOnAxis()
      })

  public speed$: Observable<ApplicationSpeedModel> = this.movement$.pipe(map((movement) => {
    if (movement === 'walking') {
      return Math.random() * 4 + 2
    }

    if (movement === 'run') {
      return Math.random() * 10 + 5
    }

    return 0
  }), map((speed) => {
    return (speed / 60 / 60) * 1000 // meter in second
  }))

  private position$: BehaviorSubject<ApplicationPositionModel> = new BehaviorSubject({
    lat: this.getDefaultLat(),
    lng: this.getDefaultLng(),
  })

  public contracts$: Observable<GeoContractUpdatedModel[]> = this.position$.pipe(switchMap((position) => {
    return this.geoService.geoContracts.pipe(map((contracts: GeoContractModel[]) => {
      return contracts.map((hexagon) => {
        const distance = Math.sqrt(
            Math.pow((position.lat - hexagon.point.lat) / this.meterToLat(1), 2) +
            Math.pow((position.lng - hexagon.point.lng) / this.meterToLng(1, hexagon.point.lat), 2))
        return {
          ...hexagon,
          distance,
          contain: distance <= 1000 // Get hexagons on 2*R
        }
      })
    }))
  }),
      startWith([]),
      bufferCount(1),
      map((stream: GeoContractUpdatedModel[][]): GeoContractUpdatedModel[] => {
        const contracts: GeoContractUpdatedModel[] = stream && stream instanceof Array ? stream.shift() as GeoContractUpdatedModel[] : []
        return contracts
        .filter((hexagon) => {
          return hexagon.contain
        })
        .sort((a, b) => {
          return a.distance - b.distance
        })
      }),
  )

  constructor (
      @Inject(APP_CONSTANTS) public readonly constants: AppConstantsInterface,
      private readonly geoService: GeoService,
      private logService: LogService
  ) {
    // Create interval with calculation position and state
    setInterval(() => {
      this.tick()
    }, this.updateInterval)

    this.contracts$.pipe(
        pairwise(),
        switchMap(([first, second]) => {
          if (!first || first.length === 0 || (first && first[0].address !== second[0].address)) {
            return of(second)
          }
          return EMPTY
        })
    ).subscribe((data: GeoContractUpdatedModel[]) => {
      const contract = data[0]
      this.logService.apply(`Send <b>public</b> data to segment <b>${contract.address}</b>: {user-alias: ${this.alias}, certificate: ${JSON.stringify(this.certificates[0])}}`)

      this.geoService.registerToContract(contract.address, {
        color: this.color,
        alias: this.alias,
        certificate: this.certificates[0]
      }).subscribe(() => {
        this.alias = generateAddress()
        // this.cdr.markForCheck();
      })
    })
  }

  meterToLat (meter: number){
    return meter * this.meterInDegree
  }

  meterToLng (meter: number, latitude: number) {
    return meter * this.meterInDegree / Math.cos(latitude * (Math.PI / 180))
  }

  tick () {
    // Chance 5% // Change transport
    if (Math.random() < .05) {
      const variants = ApplicationTransportVariants[Math.round(Math.random() * 5)]
      if (variants === 'stay') {
        this.direction$.next({x: 0, y: 0})
      }

      this.movement$.next(ApplicationTransportVariants[Math.round(Math.random() * 5)])
    }

    // Chance 10% // Change direction
    if (Math.random() < .1) {
      this.movement$.pipe(take(1)).subscribe((move) => {
        let xDirection = 0
        let yDirection = 0

        if (move !== 'stay') {
          while (xDirection + yDirection === 0 && xDirection - yDirection === 0) {
            xDirection = this.getDirectionOnAxis()
            yDirection = this.getDirectionOnAxis()
          }
        }

        this.direction$.next({
          x: xDirection,
          y: yDirection
        })

      })
    }

    combineLatest([this.speed$, this.state$, this.direction$, this.position$])
    .pipe(take(1))
    .subscribe(([speed, state, direction, position]) => {
      const lat = direction.y === 0 ? position.lat : position.lat + this.meterToLat(speed * (this.updateInterval / 1000) * direction.y)
      const lng = direction.x === 0 ? position.lng : position.lng + this.meterToLng(speed * (this.updateInterval / 1000) * direction.x, lat)

      this.position$.next({
        lng,
        lat
      })
    })
  }

  getDirectionOnAxis () {
    return Math.round(Math.random() * 2.49) - 1
  }

  getDefaultLat () {
    return (Math.random() * (this.constants.geo.latRange[1] - this.constants.geo.latRange[0]) + this.constants.geo.latRange[0])
  }

  getDefaultLng () {
    return (Math.random() * (this.constants.geo.lngRange[1] - this.constants.geo.lngRange[0]) + this.constants.geo.lngRange[0])
  }

  get position (): Observable<ApplicationPositionModel> {
    return this.position$.pipe()
  }
}
