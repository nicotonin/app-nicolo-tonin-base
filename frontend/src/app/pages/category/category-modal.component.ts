import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Category } from '../../../service/category.entity';

@Component({
  selector: 'app-category-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrl: './category-modal.component.css',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">{{ item.id ? 'Modifica' : 'Aggiungi' }} Categoria</h4>
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
    </div>

    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="activeModal.dismiss()">Annulla</button>
      <button type="button" class="btn btn-primary" (click)="confirm()">Conferma</button>
    </div>
  `
})
export class CategoryModalComponent {

  activeModal = inject(NgbActiveModal);

  item: Partial<Category> = {};

  setData(data: Category) {
    this.item = { ...data };
  }

  confirm() {
    this.activeModal.close(this.item);
  }
}
