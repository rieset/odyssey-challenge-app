import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core'
import { LogService } from '@services/log/log.service'
import {last} from 'rxjs/operators'

@Component({
  selector: 'ui-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent implements OnInit {

  public lastLogMessage$ = this.logService.stream.pipe(

  )

  constructor (
      private logService: LogService,
      private cdr: ChangeDetectorRef
  ) {
    setInterval(() => {
      this.cdr.markForCheck()
    }, 1000)
  }

  ngOnInit (): void {}
}
