import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Film } from '../../../service/film.entity';
import { FilmService } from '../../../service/film.service';
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

    <form #filmForm="ngForm">
    <div class="modal-body">

      <div *ngIf="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>

      <div class="mb-3">
        <label class="form-label">Nome</label>
        <input type="text" class="form-control" name="name" [(ngModel)]="item.name" #name="ngModel" required />
        <div *ngIf="name.invalid && name.touched" class="text-danger mt-1">
          Name is required
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label">Descrizione</label>
        <textarea class="form-control" name="description" [(ngModel)]="item.description" #description="ngModel" required></textarea>
        <div *ngIf="description.invalid && description.touched" class="text-danger mt-1">
          Description is required
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label">Rating</label>
        <input type="number" step="0.1" class="form-control" name="rating" [(ngModel)]="item.rating" #rating="ngModel" required min="0" max="10" />
        <div *ngIf="rating.invalid && rating.touched" class="text-danger mt-1">
          <div *ngIf="rating.errors?.['required']">Rating is required</div>
          <div *ngIf="rating.errors?.['min'] || rating.errors?.['max']">Rating must be between 0 and 10</div>
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label">Data di uscita</label>
        <input type="date" class="form-control" name="releaseDate" [(ngModel)]="releaseDate" (ngModelChange)="onDateChange($event)" #releaseDateField="ngModel" required />
        <div *ngIf="releaseDateField.invalid && releaseDateField.touched" class="text-danger mt-1">
          Release date is required
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label">Categoria</label>
        <select class="form-control" name="categoryID" [(ngModel)]="item.categoryID" #categoryID="ngModel" required>
          <option [value]="null" disabled>Seleziona una categoria</option>
          <option *ngFor="let cat of categories$ | async" [value]="cat.id">
            {{ cat.name }}
          </option>
        </select>
        <div *ngIf="categoryID.invalid && categoryID.touched" class="text-danger mt-1">
          Category is required
        </div>
      </div>
    </div>

    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="activeModal.dismiss()">Annulla</button>
      <button type="button" class="btn btn-primary" [disabled]="filmForm.invalid || loading" (click)="confirm()">
        <span *ngIf="loading" class="spinner-border spinner-border-sm me-1"></span>
        Conferma
      </button>
    </div>
    </form>
  `
})
export class FilmModalComponent {

  activeModal = inject(NgbActiveModal);
  private filmSrv = inject(FilmService);
  private categorySrv = inject(CategoryService);

  categories$ = this.categorySrv.list();

  item: Partial<Film> = {};
  releaseDate: string = '';
  loading = false;
  errorMessage = '';

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
    this.loading = true;
    this.errorMessage = '';

    const request = this.item.id
      ? this.filmSrv.update(this.item.id, this.item)
      : this.filmSrv.create(this.item);

    request.subscribe({
      next: (result) => {
        this.activeModal.close(result);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'An unexpected error occurred';
      }
    });
  }
}
