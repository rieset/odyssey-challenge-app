export const environment = {
  production: true,

  apis: {
    nodes: 'https://nodes-testnet.wavesnodes.com',
    rest: 'https://nodes-testnet.wavesnodes.com',
    contractAddress: '3N1eyWNffhxPCmYBWBdnWbhmAVAVjkTEqY5',
    geo: 'https://waves-challenge-backend.herokuapp.com/'
  },

  geo: {
    lngRange: [4.768427, 4.969394],
    latRange: [52.323571, 52.424852]
  },

  // Routing constants on page
  routing: {
    application: '',
    listing: 'listing',
    entity: 'entity/:entityId',
    about: 'about',
    applyGrant: 'apply-grant/:entityId',
    setting: 'settings',
    create: 'create',
    stylesheet: 'stylesheet'
  }
}
