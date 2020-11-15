export interface GeoContractModel {
  x: number
  y: number
  z: number
  zoom: number
  address: string
  publicKeyOperators: string
  warning: string | null
  point: {lat: number, lng: number}
  emergency: string | null
}

export interface GeoContractUpdatedModel extends GeoContractModel {
  distance: number,
  contain: boolean
}
