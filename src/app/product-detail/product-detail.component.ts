import { Component} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../shared/product.model';
import { CartService } from '../cart.service';
import { ProductService } from '../product.service';
import { CurrencyService } from '../currency.service';
import { ActivityTrackerService } from '../activity-tracker.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent {

  product: Product | undefined;
  comments: string[] = [];
  newComment: string = '';
  selectedCurrencySymbol: string = '$';
  description: string = '';
  private commentsLoaded: boolean = false;
  private activityTrackerSubscription: Subscription | undefined;

  constructor(private route: ActivatedRoute, private cartService: CartService, private productService: ProductService, private router: Router, private currencyService: CurrencyService, private activityTrackerService: ActivityTrackerService) {
    this.currencyService.currencyChanged.subscribe(() => {
      this.selectedCurrencySymbol = this.currencyService.getCurrencySymbol();
      });

      this.selectedCurrencySymbol = this.currencyService.getCurrencySymbol();

      this.activityTrackerSubscription = this.activityTrackerService.getIsUserBlocked().subscribe((isUserBlocked) => {
        if (isUserBlocked) {
          this.router.navigate(['/robot-verification']);
        } else {
          this.route.paramMap.subscribe((params) => {
            const productId = params.get('id');
            if (productId !== null) {
              const parsedProductId = productId;
              this.product = this.productService.getProductById(parsedProductId);
              if (this.product && !this.commentsLoaded) {
                this.loadCommentsFromLocalStorage();
              }
            }
          });
        }
      });
  }

  // ngOnInit(): void {
  //   this.route.paramMap.subscribe(params => {
  //     const productId = params.get('id');
  //     if (productId !== null) {
  //       const parsedProductId = productId;
  //       this.product = this.productService.getProductById(parsedProductId);
  //       if (this.product && !this.commentsLoaded) {
  //         this.loadCommentsFromLocalStorage();
  //       }
  //     }
  //   });

  //   this.route.data.subscribe(data => {
  //     this.selectedCurrencySymbol = data['currency'];
  //   });
  // }

  ngOnDestroy(): void {
    if (this.activityTrackerSubscription) {
      this.activityTrackerSubscription.unsubscribe();
    }
  }

  loadCommentsFromLocalStorage() {
    const storedComments = localStorage.getItem(`comments_${this.product?.id}`);
    if (storedComments) {
      const loadedComments = JSON.parse(storedComments) as string[];
      if (this.product) {
        const newComments = loadedComments.filter(comment => !this.product!.comments.includes(comment));
        this.product.comments = [...this.product.comments, ...newComments];
        this.comments = [...this.product.comments];
        console.log('Загруженные комментарии:', this.product.comments);
      }
    }
    this.commentsLoaded = true;
  }

  addComment() {
    if (this.newComment.trim() !== '') {
      const sanitizedComment = this.sanitizeComment(this.newComment);
      if (this.product) {
        if (!this.product.comments) {
          this.product.comments = [];
        }
        this.product.comments.push(sanitizedComment);

        this.saveCommentsToLocalStorage(this.product.id, this.product.comments);
        this.comments = this.product.comments.slice();

        console.log('Комментарий сохранен в локальное хранилище:', sanitizedComment);
        console.log('Комментарии внутри this.product после добавления:', this.product.comments);
      }
      this.newComment = '';
    }
  }

  saveCommentsToLocalStorage(productId: string, comments: string[]) {
    if (this.product) {
      localStorage.setItem(`comments_${this.product?.id}`, JSON.stringify(comments));
      console.log('Комментарии сохранены в локальное хранилище',productId);
    }
  }

  addProductToCart() {
    if (this.product) {
      this.cartService.addToCart(this.product);
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }

  sanitizeComment(comment: string): string {
    let replacedCount = 0;
    comment = comment.replace(/кокос|банан|плохой|@/gi, (match) => {
      replacedCount += match.length;
      return '*'.repeat(match.length);
    });

    return comment;
  }
}


