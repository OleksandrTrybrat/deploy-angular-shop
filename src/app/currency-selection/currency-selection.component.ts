import { Component } from '@angular/core';
import { CurrencySelection } from '../shared/currency-selection';
import { CurrencyService } from '../currency.service';

@Component({
  selector: 'app-currency-selection',
  templateUrl: './currency-selection.component.html',
})

export class CurrencySelectionComponent {
  currencies: CurrencySelection[] = [
    new CurrencySelection('USD', '$'),
    new CurrencySelection('EUR', '€'),
    new CurrencySelection('GBP', '£'),
  ];

  constructor(public currencyService: CurrencyService) {}


  selectCurrency(currencyCode: string) {
    this.currencyService.setSelectedCurrency(currencyCode);
  }

  setCurrency(currencyCode: string) {
    this.currencyService.setSelectedCurrency(currencyCode);
  }
}






