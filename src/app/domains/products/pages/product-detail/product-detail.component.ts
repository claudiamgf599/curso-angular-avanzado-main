import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  linkedSignal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { environment } from '@env/environment';
import { RelatedComponent } from '@products/components/related/related.component';
import { CartService } from '@shared/services/cart.service';
import { MetaTagsService } from '@shared/services/meta-tags.service';
import { ProductService } from '@shared/services/product.service';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, NgOptimizedImage, RelatedComponent],
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProductDetailComponent {
  readonly product_slug = input.required<string>();
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private metaTagsService = inject(MetaTagsService);

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

  constructor() {
    effect(() => {
      // esto se hace para seguir el Open Graph protocol y lograr previsualizaciones al compartir el enlace
      const product = this.productRs.value();
      if (product) {
        this.metaTagsService.updateMetaTags({
          title: product.title,
          description: product.description,
          image: product.images[0],
          url: `${environment.domain}/product/${product.slug}`,
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
