import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BarHorizontalChartDirective } from './bar-horizontal-chart.directive';
import { MultipleBarChartDirective } from './multiple-bar-chart.directive';
@NgModule({
  declarations: [
    AppComponent,
    BarHorizontalChartDirective,
    MultipleBarChartDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
