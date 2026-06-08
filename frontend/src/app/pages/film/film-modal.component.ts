import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Film } from '../../../service/film.entity';
import { CategoryService } from '../../../service/category.service';

@Component({
  selector: 'app-film-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrl: './film-modal.component.css',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">{{ item.id ? 'Modifica' : 'Aggiungi' }} Film</h4>
    </div>

    <div class="modal-body">
      <div class="mb-3">
        <label class="form-label">Nome</label>
        <input type="text" class="form-control" [(ngModel)]="item.name" />
      </div>

      <div class="mb-3">
        <label class="form-label">Descrizione</label>
        <textarea class="form-control" [(ngModel)]="item.description"></textarea>
      </div>

      <div class="mb-3">
        <label class="form-label">Rating</label>
        <input type="number" step="0.1" class="form-control" [(ngModel)]="item.rating" />
      </div>

      <div class="mb-3">
        <label class="form-label">Data di uscita</label>
        <input type="date" class="form-control" [(ngModel)]="releaseDate" (ngModelChange)="onDateChange($event)" />
      </div>

      <div class="mb-3">
        <label class="form-label">Categoria</label>
        <select class="form-control" [(ngModel)]="item.categoryID">
          <option *ngFor="let cat of categories$ | async" [value]="cat.id">
            {{ cat.name }}
          </option>
        </select>
      </div>
    </div>

    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="activeModal.dismiss()">Annulla</button>
      <button type="button" class="btn btn-primary" (click)="confirm()">Conferma</button>
    </div>
  `
})
export class FilmModalComponent {

  activeModal = inject(NgbActiveModal);
  private categorySrv = inject(CategoryService);

  categories$ = this.categorySrv.list();

  item: Partial<Film> = {};
  releaseDate: string = '';

  setData(data: Film) {
    this.item = { ...data };
    if (typeof data.categoryID === 'object') {
      this.item.categoryID = (data.categoryID as any).id;
    }
    if (data.releaseDate) {
      this.releaseDate = data.releaseDate.substring(0, 10);
    }
  }

  onDateChange(value: string) {
    this.item.releaseDate = value ? new Date(value).toISOString() : undefined;
  }

  confirm() {
    this.activeModal.close(this.item);
  }
}
