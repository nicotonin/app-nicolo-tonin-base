import { Component, inject, OnInit } from '@angular/core';
import { BehaviorSubject, catchError, map, of, switchMap } from 'rxjs';
import { AuthService } from '../../service/auth.service';
import { RequestService } from '../../service/request.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddRequestModal } from '../../components/add-request-modal/add-request-modal';
import { User } from '../../service/user.entity';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {

  protected requestService = inject(RequestService);
  protected authSrv = inject(AuthService);
  private modalService = inject(NgbModal);
  protected userSrv = inject(UserService);

  refresh$ = new BehaviorSubject<void>(undefined);

  userRole: string | null = null;
  user: User | null = null;
  users: User[] = [];

userMap = new Map<string, User>();

ngOnInit() {
  this.user = this.authSrv.getCurrentUser();
  this.userRole = this.user?.role ?? null;

  this.userSrv.list('role1').subscribe(res => {
    this.users = res;
    this.userMap = new Map(res.map(u => [u.id!, u]));
  });
}
getUserName(id: string) {
  console.log('REQUEST ID:', id);
  console.log('USER MAP KEYS:', Array.from(this.userMap.keys()));

  const u = this.userMap.get(id);

  return u ? `${u.firstName} ${u.lastName}` : 'Utente sconosciuto';
}
 request$ = this.authSrv.isAuthenticated$.pipe(
  switchMap(isAuth => {
    if (!isAuth) return of([]);

    return this.refresh$.pipe(
      switchMap(() =>
        this.requestService.list().pipe(
          map(list =>
            list.filter(r =>
              r.stato !== 'Rifiutato' 
            )
          ),
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
    const modalRef = this.modalService.open(AddRequestModal);

    modalRef.result.then((result) => {
      this.requestService.add(result).subscribe(() => {
        this.refresh$.next();
      });
    }).catch(() => {});
  }

 deleteRequest(id: string) {
  if (!confirm('Vuoi eliminare questa richiesta?')) return;

  this.requestService.delete(id).subscribe(() => {
    this.refresh$.next();
  });
}
  approveRequest(id: string) {
    this.requestService.approveRequest(id).subscribe(() => {
      this.refresh$.next();
    });
  }

  rejectRequest(id: string) {
    this.requestService.rejectRequest(id).subscribe(() => {
      this.refresh$.next();
    });
  }

  editRequest(request: any) {
    const modalRef = this.modalService.open(AddRequestModal);

    modalRef.componentInstance.dataInizio = request.dataInizio;
    modalRef.componentInstance.dataFine = request.dataFine;
    modalRef.componentInstance.categoriaId = request.categoriaId;
    modalRef.componentInstance.motivazione = request.motivazione;

    modalRef.result.then(result => {
      this.requestService.update(request.id, result).subscribe(() => {
        this.refresh$.next();
      });
    }).catch(() => {});
  }
}