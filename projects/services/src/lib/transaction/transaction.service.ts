import { Injectable } from '@angular/core';
import {broadcast, IInvokeScriptParams, invokeScript, transfer } from '@libs/waves-transactions/dist';
import { randomSeed, address } from '@waves/ts-lib-crypto';


@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private faucet = 'junior describe disorder harsh broom detect index tonight tray method miracle whisper master since impose';

  constructor () {}

  public async create () {
    const userSeed = randomSeed();
    const userAddress = address(userSeed, 'T');

    const signedTranferViaPrivateKey = transfer({
      recipient: userAddress,
      amount: 2000000,
      feeAssetId: null
    }, this.faucet)

    await broadcast(signedTranferViaPrivateKey, 'https://nodes-testnet.wavesnodes.com').then(resp => console.log('transfer', resp))

    console.log('Random address', userAddress);
    console.log('Random seed', userSeed);

    setTimeout(() => {

      const params = {
        call: {
          args: [{ type: 'string', value: 'C8LqSJUsxsSbyfd8ytmkWLyoVNUonWvKH2cQfgf9hPyf' },
            { type: 'string', value: 'DETAILS (for example, link to pdf)' }],
          function: 'requestCertificate',
        },
        payment: [],
        dApp: '3Mvbw1Sx9xtM6akJrBPorkPpp4B3sJRFPFX',
        chainId: 'T',
        fee: 500000,
        feeAssetId: null
      } as IInvokeScriptParams

      const signedInvokeScriptTx = invokeScript(params, userSeed)
      broadcast(signedInvokeScriptTx, 'https://nodes-testnet.wavesnodes.com').then(resp => console.log(resp))


    }, 1000)

    console.log('finish');
  }
}
