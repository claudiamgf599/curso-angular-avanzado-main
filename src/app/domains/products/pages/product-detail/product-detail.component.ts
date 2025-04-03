import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, effect, inject, input, linkedSignal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from '@env/environment';
import { CartService } from '@shared/services/cart.service';
import { ProductService } from '@shared/services/product.service';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './product-detail.component.html',
})
export default class ProductDetailComponent {
  readonly product_slug = input.required<string>();
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  productRs = rxResource({
    request: () => ({
      slug: this.product_slug(),
    }),
    loader: ({ request }) => {
      return this.productService.getOne({ product_slug: request.slug });
    },
  });

  $cover = linkedSignal({
    source: this.productRs.value, // cover se recalcula cada vez que se haga un set a product. los computed no permiten set
    computation: (product, previousValue) => {
      if (product && product.images.length > 0) {
        return product.images[0];
      }
      return previousValue?.value;
    },
  });

  titleService = inject(Title);
  metaService = inject(Meta);

  constructor() {
    effect(() => {
      // esto se hace para seguir el Open Graph protocol y lograr previsualizaciones al compartir el enlace
      const product = this.productRs.value();
      if (product) {
        this.titleService.setTitle(product.title);
        this.metaService.updateTag({
          name: 'description',
          content: product.description,
        });
        this.metaService.updateTag({
          property: 'og:title',
          content: product.title,
        });
        this.metaService.updateTag({
          property: 'og:description',
          content: product.description,
        });
        this.metaService.updateTag({
          property: 'og:image',
          content: product.images[0],
        });
        this.metaService.updateTag({
          property: 'og:url',
          content: `${environment.domain}/product/${product.slug}`,
        });
      }
    });
  }

  changeCover(newImg: string) {
    this.$cover.set(newImg);
  }

  addToCart() {
    const product = this.productRs.value();
    if (product) {
      this.cartService.addToCart(product);
    }
  }
}
