import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  Component,
  OnInit,
  inject,
  input,
  linkedSignal,
  signal,
} from '@angular/core';
import { Product } from '@shared/models/product.model';
import { CartService } from '@shared/services/cart.service';
import { ProductService } from '@shared/services/product.service';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './product-detail.component.html',
})
export default class ProductDetailComponent implements OnInit {
  readonly product_slug = input<string>();
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  $product = signal<Product | null>(null);
  $cover = linkedSignal(() => {
    const product = this.$product(); // cover se recalcula cada vez que se haga un set a product. los computed no permiten set
    if (product && product.images.length > 0) {
      return product.images[0];
    }
    return '';
  });

  ngOnInit() {
    const product_slug = this.product_slug();
    if (product_slug) {
      this.productService.getOne({ product_slug: product_slug }).subscribe({
        next: product => {
          this.$product.set(product);
        },
      });
    }
  }

  changeCover(newImg: string) {
    this.$cover.set(newImg);
  }

  addToCart() {
    const product = this.$product();
    if (product) {
      this.cartService.addToCart(product);
    }
  }
}
