import {ChangeDetectorRef, Inject, Injectable} from '@angular/core'
import {BehaviorSubject, combineLatest, Observable} from 'rxjs'
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
  map,
  switchMap,
  take,
} from 'rxjs/operators'
import {APP_CONSTANTS, AppConstantsInterface} from '@constants'
import { GeoService } from '@services/geo/geo.service'
import {GeoContractUpdatedModel, GeoContractModel} from '@services/geo/geo.model'
import { generateAddress } from '@libs/utils/utils.library'

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  private color = `rgb(${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)})`

  private updateInterval = 3000

  private zoom = 1000

  private earthRadius = 6378.137

  private meterInDegree = (1 / ((2 * Math.PI / 360) * this.earthRadius)) / 1000

  private movement$: BehaviorSubject<ApplicationTransportModel> = new BehaviorSubject('walking' as ApplicationTransportModel)

  private state$: BehaviorSubject<ApplicationStateModel> = new BehaviorSubject('free' as ApplicationStateModel)

  private address: string = generateAddress()

  private certificates: ApplicationCertificatePublicModel[] = [{
    uuid: generateAddress(),
  }]

  private alias: string = generateAddress()

  private direction$: BehaviorSubject<ApplicationDirectionModel> = new BehaviorSubject(
      {
        x: this.getDirectionOnAxis(),
        y: this.getDirectionOnAxis()
      })

  private speed$: Observable<ApplicationSpeedModel> = this.movement$.pipe(map((movement) => {
    if (movement === 'walking') {
      return Math.random() * 4 + 1
    }

    if (movement === 'run') {
      return Math.random() * 10 + 5
    }

    if (movement === 'bike') {
      return Math.random() * 25 + 5
    }

    if (movement === 'auto') {
      return Math.random() * 45 + 15
    }

    if (movement === 'public transport') {
      return Math.random() * 30 + 15
    }

    return 0
  }), map((speed) => {
    return (speed / 60 / 60) * 1000 // meter in second
  }))

  private position$: BehaviorSubject<ApplicationPositionModel> = new BehaviorSubject({
    lat: this.getDefaultLat(),
    lng: this.getDefaultLng(),
  })

  private contracts$: Observable<GeoContractUpdatedModel[]> = this.position$.pipe(switchMap((position) => {
    return this.geoService.geoContracts.pipe(map((contracts: GeoContractModel[]) => {
      console.log('contracts', contracts)
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
  }))

  constructor (
      @Inject(APP_CONSTANTS) public readonly constants: AppConstantsInterface,
      private readonly geoService: GeoService
  ) {
    // Create interval with calculation position and state
    setInterval(() => {
      this.tick()
    }, this.updateInterval)

    this.contracts$.pipe(
        bufferCount(3),
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
    ).subscribe((data: GeoContractUpdatedModel[]) => {
      const contract = data[0]
      this.geoService.registerToContract(contract.address, {
        color: this.color,
        alias: this.alias,
        certificates: this.certificates
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
      this.movement$.next(ApplicationTransportVariants[Math.round(Math.random() * 5)])
    }

    // Chance 10% // Change direction
    if (Math.random() < .1) {
      this.direction$.next({
        x: this.getDirectionOnAxis(),
        y: this.getDirectionOnAxis()
      })
    }

    combineLatest([this.speed$, this.state$, this.direction$, this.position$])
    .pipe(take(1))
    .subscribe(([speed, state, direction, position]) => {
      const lat = direction.y === 0 ? position.lat : position.lat + this.meterToLat(speed * (this.updateInterval / 1000) * direction.y)
      const lng = direction.x === 0 ? position.lng : position.lng + this.meterToLng(speed * (this.updateInterval / 1000) * direction.x, lat)

      console.log('>>', speed, state, direction, position)
      this.position$.next({
        lng,
        lat
      })
    })
  }

  getDirectionOnAxis () {
    return Math.round(Math.random() * 3) - 1
  }

  getDefaultLat () {
    return (Math.random() * (this.constants.geo.latRange[1] - this.constants.geo.latRange[0]) + this.constants.geo.latRange[0])
  }

  getDefaultLng () {
    return (Math.random() * (this.constants.geo.lngRange[1] - this.constants.geo.lngRange[0]) + this.constants.geo.lngRange[0])
  }

}
