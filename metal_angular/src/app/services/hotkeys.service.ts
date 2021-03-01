import { Injectable } from '@angular/core';
import {EventManager} from '@angular/platform-browser';
import {Observable} from 'rxjs';
// https://netbasal.com/diy-keyboard-shortcuts-in-your-angular-application-4704734547a2
type Options = {
  element: any;
  keys: string;
};

@Injectable({
  providedIn: 'root'
})
export class HotkeysService {
  defaults: Partial<Options> = {
    element: this.document
  }
  // @ts-ignore
  constructor(private eventManager: EventManager, @Inject(DOCUMENT) private document: Documen) { }
  addShortcut(options: Partial<Options>) {
    const merged = { ...this.defaults, ...options };
    const event = `keydown.${merged.keys}`;

    return new Observable(observer => {
      const handler = (e) => {
        e.preventDefault()
        observer.next(e);
      };

      const dispose = this.eventManager.addEventListener(
        merged.element, event, handler
      );

      return () => {
        dispose();
      };
    });
  }
}
