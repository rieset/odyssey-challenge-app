import { GeoContractUpdatedModel } from '@services/geo/geo.model'

export type ApplicationTransportModel = 'stay' | 'walking' | 'run' | 'bike' | 'auto' | 'public transport'
export const ApplicationTransportVariants: ApplicationTransportModel[] = ['stay', 'walking', 'run', 'bike', 'public transport', 'auto']

export type ApplicationStateModel = 'busy' | 'free'

export type ApplicationSpeedModel = number

export interface ApplicationDirectionModel {
  x: number
  y: number
}

export interface ApplicationPositionModel {
  lat: number
  lng: number
}

export interface ApplicationCertificatePublicModel {
  // address: string
  // title: string
  uuid: string
}

export interface ApplicationCertificatePrivateModel extends ApplicationCertificatePublicModel {
  address: string
  title: string
}

export interface ApplicationRegisterModel {
  color: string
  alias: string
  certificate: ApplicationCertificatePublicModel
}

export interface ApplicationPrivateModel extends ApplicationRegisterModel {
  address: string
  privateCertificates: ApplicationCertificatePrivateModel[]
  speed: number
  direction: ApplicationDirectionModel
}
