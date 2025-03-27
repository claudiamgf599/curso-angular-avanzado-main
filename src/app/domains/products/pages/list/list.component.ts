import { CommonModule } from '@angular/common';
import { Component, OnChanges, inject, input, signal } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';
import { ProductComponent } from '@products/components/product/product.component';

import { rxResource } from '@angular/core/rxjs-interop';
import { Product } from '@shared/models/product.model';
import { CartService } from '@shared/services/cart.service';
import { CategoryService } from '@shared/services/category.service';
import { ProductService } from '@shared/services/product.service';

@Component({
  selector: 'app-list',
  imports: [CommonModule, ProductComponent, RouterLinkWithHref],
  templateUrl: './list.component.html',
})
export default class ListComponent implements OnChanges {
  private cartService = inject(CartService);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  readonly slug = input<string>();

  $products = signal<Product[]>([]);
  /* // a este sigal no se le puede hacer set
  $categories = toSignal(this.categoryService.getAll(), {
    initialValue: [],
  });
  */

  // Al usar rxResource se puede hacer set a la señal y se tienen los estados de la petición, por lo que no se requiere crear variables adicionales
  //   hace el parseo a signal
  categoriesResource = rxResource({
    loader: () => this.categoryService.getAll(),
  });

  ngOnChanges() {
    this.getProducts();
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }

  private getProducts() {
    this.productService.getProducts({ category_slug: this.slug() }).subscribe({
      next: products => {
        this.$products.set(products);
      },
      error: () => {
        console.log('Error fetching products');
      },
    });
  }

  resetCategories() {
    this.categoriesResource.set([]);
  }

  reloadCategories() {
    this.categoriesResource.reload();
  }
}
