import { Component, ViewChild} from '@angular/core';
import { NgForm } from '@angular/forms';
import { ProductService } from '../product.service';
import { Product } from '../shared/product.model';
import { v4 as uuidv4 } from 'uuid';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DeleteProductModalComponent } from '../delete-product-modal/delete-product-modal.component';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  bsModalRef: BsModalRef | undefined;
  @ViewChild('productForm') productForm!: NgForm;
  products: Product[] = [];

  public productName: string = '';
  public productPrice!: number;
  public productImageUrl: string = '';
  public productDescription: string = '';
  public productQuantity: number = 0;
  public productComments: string[] = [];
  public productPriceInSelectedCurrency!: number;

  imageLoadError: string | null = null;
  adminPassword: string = '';
  isAdminAuthenticated: boolean = false;

  constructor(private productService: ProductService, private modalService: BsModalService) {
    this.products = this.productService.getProducts();
  }

  addProduct(productForm: NgForm) {
    if (productForm.valid) {
      const newProduct: Product = new Product(
        uuidv4(),
        this.productName,
        this.productPrice,
        this.productImageUrl,
        this.productDescription,
        this.productQuantity,
        this.productComments,
        this.productPriceInSelectedCurrency,
      );

      console.log(newProduct);
      console.log(productForm.valid);


      this.productService.addProduct(newProduct);
      this.products = this.productService.getProducts();
      this.productForm.resetForm();
    }
  }

  handleImageError() {
    this.imageLoadError = 'Ошибка загрузки изображения';
    this.productImageUrl = '';
  }

  loginAdmin() {
    if (this.adminPassword === 'admin') {
      this.isAdminAuthenticated = true;
    }
  }

  deleteProduct(product: Product) {
    this.bsModalRef = this.modalService.show(DeleteProductModalComponent);
    this.bsModalRef.content.product = product;
    this.bsModalRef.content.confirmDelete.subscribe(() => {
      this.productService.deleteProduct(product.id);
      this.products = this.productService.getProducts();
      this.bsModalRef!.hide();
    });
    this.bsModalRef.content.cancelDelete.subscribe(() => {
      this.bsModalRef!.hide();
    });
  }

}
