import { RoundTheNumber } from './shared/round.pipe';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DispalyAmortizationComponent } from './dispaly-amortization/dispaly-amortization.component';
import { ChartComponent } from './chart/chart.component';
import { ChartsModule } from 'ng2-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
// import { CurrencyMaskInputMode, NgxCurrencyModule } from 'ngx-currency';
import { NgxMaskModule } from 'ngx-mask'


// export const customCurrencyMaskConfig = {
//   align: "left",
//   allowNegative: false,
//   allowZero: false,
//   decimal: ",",
//   precision: 0,
//   prefix: "₹",
//   suffix: "",
//   thousands: "",
//   nullable: false,
//   min: null,
//   max: null,
//   inputMode: CurrencyMaskInputMode.NATURAL
// };

@NgModule({
  declarations: [
    AppComponent,
    DispalyAmortizationComponent,
    RoundTheNumber,
    ChartComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    FontAwesomeModule,
    // NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
    NgxMaskModule.forRoot(),
  ],
  providers: [],
  exports: [RoundTheNumber],
  bootstrap: [AppComponent],
})
export class AppModule { }
