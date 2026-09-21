import { EnvironmentProviders, inject, makeEnvironmentProviders, provideAppInitializer } from '@angular/core';
import { ReturnUrl } from './return-url';

export const provideReturnUrl = (): EnvironmentProviders =>
  makeEnvironmentProviders([
    // Initialize the ReturnUrl tracking
    provideAppInitializer(() => {
      inject(ReturnUrl);
    })
  ]);
