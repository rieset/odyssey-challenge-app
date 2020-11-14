import { Pipe, PipeTransform } from '@angular/core'
import { GeoUtils } from '@libs/geo/geo'

@Pipe({
  name: 'hexagon'
})
export class HexagonPipe implements PipeTransform {
  transform (value: {lat: number, lng: number}, radius: number = 0) {
    const { lat, lng } = value

    return [
      {
        lat: lat - GeoUtils.meterToLat(radius ? radius / 2 : 75),
        lng: lng - GeoUtils.meterToLng(radius || 155, lat)
      },
      {
        lat: lat - GeoUtils.meterToLat(radius || 150),
        lng: lng - GeoUtils.meterToLng(radius ? 0 : 10, lat)
      },
      {
        lat: lat - GeoUtils.meterToLat(radius ? radius / 2 : 75),
        lng: lng + GeoUtils.meterToLng(radius || 145, lat)
      },
      {
        lat: lat + GeoUtils.meterToLat(radius ? radius / 2 : 75),
        lng: lng + GeoUtils.meterToLng(radius || 150, lat)
      },
      {
        lat: lat + GeoUtils.meterToLat(radius || 150),
        lng: lng + GeoUtils.meterToLng(radius ? 0 : 0, lat)
      },
      {
        lat: lat + GeoUtils.meterToLat(radius ? radius / 2 : 75),
        lng: lng - GeoUtils.meterToLng(radius || 150, lat)
      }
    ]
  }
}
