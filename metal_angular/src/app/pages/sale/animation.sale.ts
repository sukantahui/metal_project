import {animate, keyframes, state, style, transition, trigger} from '@angular/animations';

export const SaleAnimation = [
  // metadata array
  trigger('toggleClick', [     // trigger block
    state('true', style({      // final CSS following animation
      backgroundColor: 'green'
    })),
    state('false', style({
      backgroundColor: 'red'
    })),
    transition('true => false', animate('1000ms linear')),  // animation timing
    transition('false => true', animate('1000ms linear'))
  ]), // end of trigger block
  trigger('animateArc', [
    state('true', style({
      left: '400px',
      top: '200px'
    })),
    state('false', style({
      left: '0',
      top: '200px'
    })),
    transition('false => true', animate('1000ms linear', keyframes([
      style({ left: '0',     top: '200px', offset: 0 }),
      style({ left: '200px', top: '100px', offset: 0.50 }),
      style({ left: '400px', top: '200px', offset: 1 })
    ]))),
    transition('true => false', animate('1000ms linear', keyframes([
      style({ left: '400px', top: '200px', offset: 0 }),
      style({ left: '200px', top: '100px', offset: 0.50 }),
      style({ left: '0',     top: '200px', offset: 1 })
    ])))
  ]), // end of trigger
  trigger('fadeSlideInOut', [
    transition(':enter', [
      style({ opacity: 0, transform: 'translateY(10px)' }),
      animate('1000ms', style({ opacity: .3, transform: 'translateY(0)' })),
    ]),
    transition(':leave', [
      animate('1000ms', style({ opacity: 0, transform: 'translateY(10px)' })),
    ]),
  ])
];
