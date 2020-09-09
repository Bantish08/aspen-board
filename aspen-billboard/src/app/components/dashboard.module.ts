import { DashboardRoutingModule } from './dashboard-routing.module';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CommonModule } from '@angular/common';
import { MatSliderModule } from '@angular/material/slider';
import { MaterialDesignModule } from '../components/shared/material-design.module';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatSliderModule,
    MaterialDesignModule,
    ChartsModule
  ],
  exports: [],
  providers: []
})
export class DashboardModule { }
