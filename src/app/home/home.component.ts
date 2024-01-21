import { Component } from '@angular/core';
import { Product } from '../shared/product.model';
import { ProductService } from '../product.service';
import { PaginationInstance } from 'ngx-pagination';
import { CurrencyService } from '../currency.service';
import { UserService } from '../user.service';
import { ActivityTrackerService } from '../activity-tracker.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  products: Product[] = [];
  paginatedProducts: Product[] = [];
  selectedCurrencySymbol: string = '$';
  filterText: string = '';
  config: PaginationInstance = {
    itemsPerPage: 15,
    currentPage: 1,
  };
  currencySymbol: string = this.currencyService.getCurrencySymbol();

  constructor(private productService: ProductService, private currencyService: CurrencyService,private userService: UserService, private activityTrackerService: ActivityTrackerService) {
    this.products = this.productService.getProducts();
    this.currencyService.currencyChanged.subscribe((currencyCode) => {
      this.selectedCurrencySymbol = this.currencyService.getCurrencySymbol();
      this.recalculatePrices(currencyCode);
    });
    this.selectedCurrencySymbol = this.currencyService.getCurrencySymbol();
    this.recalculatePrices(this.currencyService.getSelectedCurrency());
  }

  filterProducts() {
    this.config.currentPage = 1;
  }

  get filteredProducts(): Product[] {
    return this.products.filter(product =>
      product.name.toLowerCase().replace(/\s/g, '').includes(this.filterText.toLowerCase().replace(/\s/g, ''))
    );
  }

  getDisplayedPrice(price: number): string {
    const selectedCurrency = this.currencyService.getSelectedCurrency();
    const exchangeRate = this.currencyService.getExchangeRate(selectedCurrency);
    const priceInSelectedCurrency = price * exchangeRate;
    return priceInSelectedCurrency.toFixed(0) + ' ' + selectedCurrency;
  }

  recalculatePrices(currencyCode: string) {
    this.products.forEach((product) => {
      const exchangeRate = this.currencyService.getExchangeRate(currencyCode);
      product.priceInSelectedCurrency = product.price * exchangeRate;
    });
  }

  recalculatePaginatedPrices() {
    this.selectedCurrencySymbol = this.currencyService.getCurrencySymbol();
    const selectedCurrency = this.currencyService.getSelectedCurrency();
    const exchangeRate = this.currencyService.getExchangeRate(selectedCurrency);
    this.paginatedProducts.forEach((product) => {
      product.priceInSelectedCurrency = product.price * exchangeRate;
    });
  }

  onProductClick(product: Product) {
    const userId = this.userService.getUserId();
    this.activityTrackerService.logActivity('Product Click', userId);
    if (this.activityTrackerService.analyzeActivity(userId)) {
      const isUserBlocked = this.activityTrackerService.blockUser(userId);
    }
  }
}
