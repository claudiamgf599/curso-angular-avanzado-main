import {
  Component,
  signal,
  effect,
  OnInit,
  AfterViewInit,
  OnDestroy,
  computed,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-counter',
  imports: [CommonModule],
  templateUrl: './counter.component.html',
})
export class CounterComponent implements OnInit, AfterViewInit, OnDestroy {
  $duration = input.required<number>({ alias: 'duration' }); // con el alias el componente que lo llama lo puede llamar como duration, se debe deshabilitar la regla de eslint
  // doubleDuration = signal(0); // valor inicial, así sería para usar effect, pero pues no es necesario porque existe computed
  $doubleDuration = computed(() => this.$duration() * 2);
  $message = input.required<string>({ alias: 'message' });
  $counter = signal(0);
  counterRef: number | undefined;

  constructor() {
    // NO ASYNC
    // before render
    // una vez
    console.log('constructor');
    console.log('-'.repeat(10));

    // effect permite suscribrirse al signal (como reemplazo del ngOnChanges)
    effect(() => {
      this.$duration(); // ejecuta doSomething solo si se cambia duration
      //this.doubleDuration.set(this.duration() * 2); // cuando duration cambia ejecuta esto y cambia doubleDuration, pero con computed no es necesario
      this.doSomething();
    });

    effect(() => {
      this.$message();
      this.doSomething2();
    });
  }

  /* // ya no se requiere en Angular 19
  ngOnChanges(changes: SimpleChanges) {
    // before and during render
    console.log('ngOnChanges');
    console.log('-'.repeat(10));
    console.log(changes);
    const duration = changes['duration'];
    if (duration && duration.currentValue !== duration.previousValue) {
      this.doSomething();
    }
  }*/

  ngOnInit() {
    // after render
    // una vez
    // async, then, subs
    console.log('ngOnInit');
    console.log('-'.repeat(10));
    console.log('duration =>', this.$duration);
    console.log('message =>', this.$message);
    this.counterRef = window.setInterval(() => {
      console.log('run interval');
      this.$counter.update(statePrev => statePrev + 1);
    }, 1000);
  }

  ngAfterViewInit() {
    // after render
    // hijos ya fueron pintandos
    console.log('ngAfterViewInit');
    console.log('-'.repeat(10));
  }

  ngOnDestroy() {
    console.log('ngOnDestroy');
    console.log('-'.repeat(10));
    window.clearInterval(this.counterRef);
  }

  doSomething() {
    console.log('change duration');
    // async
  }

  doSomething2() {
    console.log('change message');
    // async
  }
}
