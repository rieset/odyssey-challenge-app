export type ApplicationTransportModel = 'bike'
export const ApplicationTransportVariants: ApplicationTransportModel[] = ['bike']

export type ApplicationStateModel = 'busy' | 'free'

export type ApplicationSpeedModel = number

export interface ApplicationDirectionModel {
  x: number
  y: number
}

export interface ApplicationDirectionInputModel {
  x?: number
  y?: number
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
