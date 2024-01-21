import { Injectable, EventEmitter  } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private selectedCurrency: string = 'USD';
  private exchangeRates: { [currency: string]: number } = {
    USD: 1,
    EUR: 0.91,
    GBP: 0.84,
  };
  currencyChanged: EventEmitter<string> = new EventEmitter<string>();

  getSelectedCurrency(): string {
    return this.selectedCurrency;
  }

  setSelectedCurrency(currencyCode: string) {
    if (this.selectedCurrency !== currencyCode) {
      this.selectedCurrency = currencyCode;
      this.currencyChanged.emit(currencyCode);
    }
  }

  getExchangeRate(currency: string): number {
    return this.exchangeRates[currency] || 1;
  }

  getCurrencySymbol(): string {
    const selectedCurrency = this.getSelectedCurrency();
    const currencySymbols: { [currency: string]: string } = {
      USD: '$',
      EUR: '€',
      GBP: '£',
    };

    return currencySymbols[selectedCurrency] || '$';
  }

  getFormattedPrice(price: number): string {
    const selectedCurrency = this.getSelectedCurrency();
    const exchangeRate = this.getExchangeRate(selectedCurrency);
    const priceInSelectedCurrency = price * exchangeRate;

    return priceInSelectedCurrency.toFixed(0) + ' ' + this.getCurrencySymbol();
  }
}
