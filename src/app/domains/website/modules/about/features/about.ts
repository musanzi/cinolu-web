import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { Component, OnDestroy, PLATFORM_ID, afterNextRender, inject, signal } from '@angular/core';
import { IAboutSectionId } from '../interfaces';
import { AboutHistory } from '../ui/history/history';
import { AboutHero } from '../ui/hero/hero';
import { AboutImpact } from '../ui/impact/impact';
import { AboutManifesto } from '../ui/manifesto/manifesto';
import { AboutStory } from '../ui/story/story';
import { AboutTeam } from '../ui/team/team';
import { AboutVision } from '../ui/vision/vision';

const ABOUT_SECTION_IDS = [
  'story',
  'vision',
  'history',
  'impact',
  'team'
] as const satisfies readonly IAboutSectionId[];

function isAboutSectionId(value: string): value is IAboutSectionId {
  return ABOUT_SECTION_IDS.some((sectionId) => sectionId === value);
}

@Component({
  imports: [AboutHero, AboutStory, AboutManifesto, AboutVision, AboutHistory, AboutImpact, AboutTeam],
  templateUrl: './about.html'
})
export class AboutUs implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);
  private sectionObserver?: IntersectionObserver;

  protected readonly activeSection = signal<IAboutSectionId>('story');

  constructor() {
    afterNextRender(() => this.initSectionObserver());
  }

  ngOnDestroy(): void {
    this.sectionObserver?.disconnect();
  }

  protected scrollToSection(sectionId: IAboutSectionId, event: MouseEvent): void {
    event.preventDefault();
    const target = this.document.getElementById(sectionId);
    if (!target) {
      return;
    }

    const prefersReducedMotion = this.document.defaultView?.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
    this.activeSection.set(sectionId);
  }

  protected isActiveSection(sectionId: IAboutSectionId): boolean {
    return this.activeSection() === sectionId;
  }

  private initSectionObserver(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const sections = ABOUT_SECTION_IDS.map((id) => this.document.getElementById(id)).filter(
      (el): el is HTMLElement => !!el
    );

    if (!sections.length) {
      return;
    }

    this.sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        const id = visible[0]?.target.id;
        if (id && isAboutSectionId(id)) {
          this.activeSection.set(id);
        }
      },
      {
        rootMargin: '-35% 0px -50% 0px',
        threshold: [0, 0.15, 0.35, 0.5]
      }
    );

    sections.forEach((section) => this.sectionObserver?.observe(section));
  }
}
