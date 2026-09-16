import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { PageLoader } from '@/app/shared/ui/page-loader/page-loader';
import { AuthCard } from '../ui/auth-card/auth-card';

@Component({
  selector: 'auth-layout',
  imports: [RouterOutlet, PageLoader, AuthCard],
  templateUrl: './layout.html'
})
export class AuthLayout {
  private readonly route = inject(ActivatedRoute);

  protected readonly content = signal({
    asideDescription: "Connectez-vous aux programmes, aux activités et à la communauté d'innovation.",
    asideFootnote: 'Votre parcours commence ici.'
  });

  protected updateContent(): void {
    this.content.set(this.route.firstChild?.snapshot.data['authContent'] ?? this.content());
  }
}
