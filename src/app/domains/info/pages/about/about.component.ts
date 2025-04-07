import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CounterComponent } from '@shared/components/counter/counter.component';
import { HighlightDirective } from '@shared/directives/highlight.directive';

import { WaveAudioComponent } from '@info/components/wave-audio/wave-audio.component';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, delay, Subject } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-about',
  imports: [
    CommonModule,
    CounterComponent,
    WaveAudioComponent,
    HighlightDirective,
    FormsModule,
  ],
  templateUrl: './about.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AboutComponent {
  duration = signal(1000);
  message = signal('Hola');

  // toSignal para un Observable que tiene valor inicial
  // usando el requireSync en true indicamos que están sincronizados el observable y el signal
  obsWithInit$ = new BehaviorSubject<string>('behavior subject initial value');
  $withInit = toSignal(this.obsWithInit$, {
    requireSync: true,
  });

  // toSignal para un Observable que no tiene valor inicial, aquí no se requiere que sea síncrono porque no hay valor inicial
  obsWithoutInit$ = new Subject<string>();
  $withoutInit = toSignal(this.obsWithoutInit$.pipe(delay(3000)), {
    initialValue: '-----',
  });

  changeDuration(event: Event) {
    const input = event.target as HTMLInputElement;
    this.duration.set(input.valueAsNumber);
  }

  changeMessage(event: Event) {
    const input = event.target as HTMLInputElement;
    this.message.set(input.value);
  }

  emitWithInit() {
    this.obsWithInit$.next('nuevo valor - emitWithInit');
  }

  emitWithoutInit() {
    this.obsWithoutInit$.next('**** - emitWithoutInit');
  }
}
