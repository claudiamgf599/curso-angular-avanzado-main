import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  resource,
} from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ListComponent {
  private cartService = inject(CartService);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  readonly slug = input<string>();

  /* // a este sigal no se le puede hacer set
  $categories = toSignal(this.categoryService.getAll(), {
    initialValue: [],
  });
  */

  // Al usar rxResource se puede hacer set a la señal y se tienen los estados de la petición, por lo que no se requiere crear variables adicionales
  //   hace el parseo a signal
  /*
  categoriesResource = rxResource({
    loader: () => this.categoryService.getAll(),
  });  
  */

  // Se puede cambiar el rxResource por resource para recuperar la información como Promise
  categoriesResource = resource({
    loader: () => this.categoryService.getAllPromise(),
  });

  productsResource = rxResource({
    /* // esta es una forma de hacerlo, aunque lleva más código porque no es javascript moderno
      request: () => {
        return {
          category_slug: this.slug(), //  cada vez que cambia el slug se hace la petición, y se envía al request como category_slug
        };
      }
      */
    request: () => ({ category_slug: this.slug() }), // se podrían añadir más parámetros, por ejemplo, si se quiere hacer un search, se podría añadir un parámetro search
    loader: ({ request }) => this.productService.getProducts(request),
  });

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }

  resetCategories() {
    this.categoriesResource.set([]);
  }

  reloadCategories() {
    this.categoriesResource.reload();
  }

  reloadProducts() {
    this.productsResource.reload();
  }
}
