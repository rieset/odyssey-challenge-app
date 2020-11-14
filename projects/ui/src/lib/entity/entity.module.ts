import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { EntityComponent } from './entity.component'
import {MatButtonModule} from '@angular/material/button';

@NgModule({
  declarations: [EntityComponent],
  imports: [
    CommonModule,
    MatButtonModule
  ],
  exports: [EntityComponent]
})
export class EntityModule { }
