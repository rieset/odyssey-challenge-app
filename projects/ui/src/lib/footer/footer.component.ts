import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, ElementRef, Inject, OnChanges, OnDestroy,
  OnInit, PLATFORM_ID, SimpleChanges, ViewChild,
} from '@angular/core'
import { LogService } from '@services/log/log.service'
import {debounceTime, last, takeUntil} from 'rxjs/operators'
import {DOCUMENT, isPlatformBrowser} from '@angular/common';
import {fromEvent, Subject} from 'rxjs';
import {WINDOW} from '@services/window';

@Component({
  selector: 'ui-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  private destroyed$ = new Subject();
  @ViewChild('footerRef', { static: false }) footerRef: ElementRef<HTMLElement> | null = null;
  private isBrowser: boolean;
  public lastLogMessage$ = this.logService.stream.pipe(

  )

  constructor (
      private logService: LogService,
      private cdr: ChangeDetectorRef,
      @Inject(PLATFORM_ID) platformId: object,
      @Inject(WINDOW) public window: Window,
      @Inject(DOCUMENT) public document: Document,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    setInterval(() => {
      this.cdr.markForCheck();
      this.updateCssVariable();
    }, 1000)
  }

  updateCssVariable () {
    let footerHeight = 0;
    if ( this.footerRef && this.footerRef.nativeElement && this.isBrowser ){
      this.cdr.markForCheck();
      this.cdr.detectChanges();
      footerHeight = this.footerRef.nativeElement.offsetHeight;
      this.document.documentElement.style.setProperty('--footer-height', footerHeight + 'px');
    }
  }
  ngAfterViewInit (): void {
    this.updateCssVariable();
  }

  ngOnChanges (changes: SimpleChanges) {
    console.log('qwe');
  }

  ngOnInit () {
    if (this.isBrowser) {
      this.updateCssVariable();
      fromEvent(this.window, 'resize')
        .pipe(takeUntil(this.destroyed$), debounceTime(10))
        .subscribe(() => {
          this.updateCssVariable();
        });
    }
  }
  ngOnDestroy () {
    this.destroyed$.next();
  }
}
