export class GeoUtils {
  public static earthRadius = 6378.137

  public static meterInDegree = (1 / ((2 * Math.PI / 360) * GeoUtils.earthRadius)) / 1000

  public static meterToLat (meter: number) {
    return meter * GeoUtils.meterInDegree
  }

  public static meterToLng (meter: number, latitude: number) {
    return meter * GeoUtils.meterInDegree / Math.cos(latitude * (Math.PI / 180))
  }
}
