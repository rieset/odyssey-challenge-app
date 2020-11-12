import {Component, Inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core'
import {isPlatformBrowser} from '@angular/common';
import {fromEvent, Subject} from 'rxjs';
import {debounceTime, takeUntil} from 'rxjs/operators';
import {WINDOW} from '@services/window';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private destroyed$ = new Subject();
  isBrowser: boolean;
  constructor (
    @Inject(PLATFORM_ID) platformId: object,
    @Inject(WINDOW) public window: Window,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  updateCssVariableVh () {
    if ( this.isBrowser ){
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
  }
  ngOnInit () {
    if (this.isBrowser) {
      this.updateCssVariableVh();
      fromEvent(this.window, 'resize')
        .pipe(takeUntil(this.destroyed$), debounceTime(10))
        .subscribe(() => {
          this.updateCssVariableVh();
        });
    }
  }
  ngOnDestroy () {
    this.destroyed$.next();
  }
}
