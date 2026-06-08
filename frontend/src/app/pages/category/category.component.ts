import { Component, inject } from '@angular/core';
import { CategoryService } from '../../../service/category.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, switchMap, of, catchError } from 'rxjs';
import { AuthService } from '../../../service/auth.service';
import { Category } from '../../../service/category.entity';
import { CategoryModalComponent } from './category-modal.component';

@Component({
  selector: 'app-category',
  standalone: false,
  templateUrl: './category.component.html',
  styleUrl: './category.component.css',
})
export class CategoryComponent {

  private srv = inject(CategoryService);
  private router = inject(Router);
  private modalService = inject(NgbModal);
  protected authSrv = inject(AuthService);

  refresh$ = new BehaviorSubject<void>(undefined);

  items$ = this.authSrv.isAuthenticated$.pipe(
    switchMap(isAuth => {
      if (!isAuth) return of([]);

      return this.refresh$.pipe(
        switchMap(() =>
          this.srv.list().pipe(
            catchError(err => {
              console.error(err);
              return of([]);
            })
          )
        )
      );
    })
  );

  openAdd() {
    const modalRef = this.modalService.open(CategoryModalComponent);

    modalRef.result.then((result) => {
      this.srv.create(result).subscribe(() => {
        this.refresh$.next();
      });
    }).catch(() => {});
  }

  delete(id: string) {
    this.srv.remove(id).subscribe(() => {
      this.refresh$.next();
    });
  }

  edit(item: Category) {
    const modalRef = this.modalService.open(CategoryModalComponent);

    modalRef.componentInstance.setData(item);

    modalRef.result.then((result) => {
      this.srv.update(item.id, result).subscribe(() => {
        this.refresh$.next();
      });
    }).catch(() => {});
  }

  openDetail(id: string) {
    this.router.navigate(['/category', id]);
  }
}
