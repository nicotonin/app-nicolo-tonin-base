import { Component, inject } from '@angular/core';
import { FilmService } from '../../../service/film.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, switchMap, of, catchError } from 'rxjs';
import { AuthService } from '../../../service/auth.service';
import { Film } from '../../../service/film.entity';
import { FilmModalComponent } from './film-modal.component';

@Component({
  selector: 'app-film',
  standalone: false,
  templateUrl: './film.component.html',
  styleUrl: './film.component.css',
})
export class FilmComponent {

  private srv = inject(FilmService);
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
    const modalRef = this.modalService.open(FilmModalComponent);

    modalRef.result.then(() => {
      this.refresh$.next();
    }).catch(() => {});
  }

  delete(id: string) {
    this.srv.remove(id).subscribe(() => {
      this.refresh$.next();
    });
  }

  edit(item: Film) {
    const modalRef = this.modalService.open(FilmModalComponent);

    modalRef.componentInstance.setData(item);

    modalRef.result.then(() => {
      this.refresh$.next();
    }).catch(() => {});
  }

  openDetail(id: string) {
    this.router.navigate(['/film', id]);
  }

  getCategoryName(film: Film): string {
    if (typeof film.categoryID === 'object' && film.categoryID) {
      return (film.categoryID as any).name;
    }
    return '';
  }
}
