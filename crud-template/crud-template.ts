import { Component, inject } from '@angular/core';
import { CrudService } from '../frontend/src/service/crud.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, switchMap, of, catchError } from 'rxjs';
import { AuthService } from '../frontend/src/service/auth.service';
import { Crud } from '../frontend/src/service/crud.entity';

@Component({
  selector: 'app-crud-template',
  standalone: false,
  templateUrl: './crud-template.html',
  styleUrl: './crud-template.css',
})
export class CrudComponent {

 private srv= inject(CrudService);
  private router = inject(Router);
  private modalService = inject(NgbModal);
  protected authSrv = inject(AuthService);
  refresh$ = new BehaviorSubject<void>(undefined);


  crud: Crud[] = [];
  loading = false;

  crud$ = this.authSrv.isAuthenticated$.pipe(

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
  const modalRef = this.modalService.open(CrudModalComponent);

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


edit(crud: any) {
  const modalRef = this.modalService.open(CrudModalComponent);

  modalRef.componentInstance.setData(crud);

  modalRef.result.then((result) => {
    this.srv.update(crud.id, result).subscribe(() => {
      this.refresh$.next();
    });
  }).catch(() => {});
}

  openDetail(id: string) {
    this.router.navigate(['/crud', id]);
  }

}
