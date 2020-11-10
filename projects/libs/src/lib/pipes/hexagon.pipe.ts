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
        lat: lat - GeoUtils.meterToLat(radius ? radius / 2 : 250),
        lng: lng - GeoUtils.meterToLng(radius || 515, lat)
      },
      {
        lat: lat - GeoUtils.meterToLat(radius || 500),
        lng: lng - GeoUtils.meterToLng(radius ? 0 : 45, lat)
      },
      {
        lat: lat - GeoUtils.meterToLat(radius ? radius / 2 : 250),
        lng: lng + GeoUtils.meterToLng(radius || 485, lat)
      },
      {
        lat: lat + GeoUtils.meterToLat(radius ? radius / 2 : 250),
        lng: lng + GeoUtils.meterToLng(radius || 500, lat)
      },
      {
        lat: lat + GeoUtils.meterToLat(radius || 500),
        lng: lng + GeoUtils.meterToLng(radius ? 0 : 30, lat)
      },
      {
        lat: lat + GeoUtils.meterToLat(radius ? radius / 2 : 250),
        lng: lng - GeoUtils.meterToLng(radius || 500, lat)
      }
    ]
  }
}
