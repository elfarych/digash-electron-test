/// <reference types="@angular/localize" />

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { RootModule } from './app/root.module';
import {LOCALE_ID} from "@angular/core";

platformBrowserDynamic()
  .bootstrapModule(RootModule, {
    providers: [{provide: LOCALE_ID, useValue: 'ru' }]
  })
  .catch((err) => console.error(err));
