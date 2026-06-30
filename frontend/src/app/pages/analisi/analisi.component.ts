
import { Component, inject } from '@angular/core';
import { AnalisiService } from '../../../service/analisi.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, switchMap, of, catchError } from 'rxjs';
import { AuthService } from '../../../service/auth.service';
import { Analisi } from '../../../service/analisi.entity';
import { AnalisiModalComponent } from './analisi-modal.component';

@Component({
  selector: 'app-analisi',
  standalone: false,
  templateUrl: './analisi.component.html',
  styleUrl: './analisi.component.css',
})
export class AnalisiComponent {

  private srv = inject(AnalisiService);
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
    const modalRef = this.modalService.open(AnalisiModalComponent);

    modalRef.result.then(() => {
      this.refresh$.next();
    }).catch(() => {});
  }

  delete(id: string) {
    this.srv.remove(id).subscribe(() => {
      this.refresh$.next();
    });
  }

  edit(item: Analisi) {
    const modalRef = this.modalService.open(AnalisiModalComponent);

    modalRef.componentInstance.setData(item);

    modalRef.result.then(() => {
      this.refresh$.next();
    }).catch(() => {});
  }

  openDetail(id: string) {
    this.router.navigate(['/analisi', id]);
  }
}
