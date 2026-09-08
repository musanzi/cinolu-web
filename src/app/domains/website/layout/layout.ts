import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './ui/header/header';
import { Footer } from './ui/footer/footer';
import { PageLoader } from '@/app/shared/ui';

@Component({
  selector: 'web-layout',
  imports: [RouterOutlet, Header, Footer, PageLoader],
  template: `
    @defer (on immediate) {
      <div class="public-site min-h-screen overflow-x-hidden font-outfit">
        <app-header />
        <main id="main-content">
          <router-outlet />
        </main>
        <app-footer />
      </div>
    } @placeholder {
      <app-page-loader />
    } @loading (minimum 500ms) {
      <app-page-loader />
    }
  `
})
export class WebLayout {}
