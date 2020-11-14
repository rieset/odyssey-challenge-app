import {Inject, Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {generateAddress} from '@libs/utils/utils.library';
import {UserModel} from '@services/user/user.model';
import {WINDOW} from '@services/window';
import { randomSeed, address } from '@waves/ts-lib-crypto';
import {ContractService} from '@services/contract/contract.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user$: BehaviorSubject<UserModel> = new BehaviorSubject({
    address: this.window.localStorage.getItem('address') || generateAddress(),
  })

  constructor (
      @Inject(WINDOW) public window: Window,
      private contractService: ContractService
  ) {
    if (!this.window.localStorage.getItem('address')) {
      this.window.localStorage.setItem('address', this.user$.getValue().address);
    }

    this.contractService.stream.subscribe((contracts) => {
      console.log('contracts', contracts);
    })
  }

  public get user () {
    return this.user$;
  }

}
