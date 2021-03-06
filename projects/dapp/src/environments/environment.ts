// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { ApplyGrantPageComponent } from '@pages/apply-grant-page/apply-grant-page.component'

export const environment = {
  production: false,

  apis: {
    nodes: 'https://nodes-testnet.wavesnodes.com',
    rest: 'https://nodes-testnet.wavesnodes.com',
    signer: 'https://testnet.waves.exchange/signer/',
    contractAddress: '3Mvbw1Sx9xtM6akJrBPorkPpp4B3sJRFPFX',
    geo: 'http://localhost:3000',
    googleMaps: 'AIzaSyACN_pRwBJA4Vqb3PMOCXTJCXnUtbeTXgU'
  },

  geo: {
    lngRange: [4.768427, 4.969394],
    latRange: [52.323571, 52.424852]
  },

  // Routing constants on page
  routing: {
    application: '',
    listing: 'listing',
    entity: 'listing/:entityId',
    about: 'about',
    applyGrant: 'apply-grant/:entityId',
    setting: 'settings',
    create: 'create',
    stylesheet: 'stylesheet',
    getCertificate: 'get-certificate',
  }
}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
