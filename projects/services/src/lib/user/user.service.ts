import {Inject, Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {generateAddress} from '@libs/utils/utils.library';
import {UserModel} from '@services/user/user.model';
import {WINDOW} from '@services/window';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user$: BehaviorSubject<UserModel> = new BehaviorSubject({
    address: this.window.localStorage.getItem('address') || generateAddress()
  })

  constructor(
      @Inject(WINDOW) public window: Window,
  ) {
    if (!this.window.localStorage.getItem('address')) {
      this.window.localStorage.setItem('address', this.user$.getValue().address);
    }
  }

  sendScore() {

  }

}
