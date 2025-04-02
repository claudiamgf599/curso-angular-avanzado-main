import { afterNextRender, Component, resource, signal } from '@angular/core';
import { environment } from '@env/environment';

@Component({
  selector: 'app-locations',
  imports: [],
  templateUrl: './locations.component.html',
})
export default class LocationsComponent {
  $origin = signal('');

  constructor() {
    afterNextRender(() => {
      // TODO esto debería estar en un service
      navigator.geolocation.getCurrentPosition(position => {
        console.log(position);
        const origin = `${position.coords.latitude},${position.coords.longitude}`;
        this.$origin.set(origin);
      });
    });
  }
  locationsResource = resource({
    request: () => ({
      origin: this.$origin(),
    }),
    loader: async ({ request }) => {
      const url = new URL(`${environment.apiUrl}/api/v1/locations`); // URL corre tanto el browser como en el server
      if (request.origin) {
        url.searchParams.set('origin', request.origin);
      }

      const response = await fetch(url.toString());
      return response.json();
    },
  });
}
