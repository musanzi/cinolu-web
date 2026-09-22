import { Component, model } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import type { IActivityResource } from '../../interfaces';

@Component({
  selector: 'resources-editor',
  imports: [MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule],
  templateUrl: './resources-editor.html'
})
export class ResourcesEditor {
  value = model.required<IActivityResource[]>();

  protected addResource(): void {
    this.value.update((resources) => [...resources, { title: '', value: '' }]);
  }

  protected updateResource(index: number, patch: Partial<IActivityResource>): void {
    this.value.update((resources) =>
      resources.map((resource, resourceIndex) =>
        resourceIndex === index ? { ...resource, ...patch } : resource
      )
    );
  }

  protected removeResource(index: number): void {
    this.value.update((resources) => resources.filter((_, resourceIndex) => resourceIndex !== index));
  }
}
