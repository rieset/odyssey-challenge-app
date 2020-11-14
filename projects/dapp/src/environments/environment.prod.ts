export const environment = {
  production: true,

  apis: {
    nodes: 'https://nodes-testnet.wavesnodes.com',
    rest: 'https://nodes-testnet.wavesnodes.com',
    contractAddress: '3Mvbw1Sx9xtM6akJrBPorkPpp4B3sJRFPFX',
    signer: 'https://testnet.waves.exchange/signer/',
    geo: 'https://waves-challenge-backend.herokuapp.com/',
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
