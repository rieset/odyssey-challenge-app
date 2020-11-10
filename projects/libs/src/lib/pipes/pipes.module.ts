import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RelativeRoutePipe, RoutePipe, RoutesPipe } from './route-path.pipe'
import { SafeHtmlPipe } from './safe-html.pipe'
import { TimeLeftPipe } from './timeleft.pipe'
import {HexagonPipe} from '@libs/pipes/hexagon.pipe'

@NgModule({
  declarations: [
    RoutePipe,
    RoutesPipe,
    RelativeRoutePipe,
    SafeHtmlPipe,
    TimeLeftPipe,
    HexagonPipe
  ],
  imports: [CommonModule],
  exports: [
    RoutePipe,
    RoutesPipe,
    RelativeRoutePipe,
    SafeHtmlPipe,
    TimeLeftPipe,
    HexagonPipe
  ]
})
export class PipesModule {}
