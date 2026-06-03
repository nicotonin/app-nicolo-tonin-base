const fs = require('fs');
const path = require('path');

const name = process.argv[2];

if (!name) {
  console.log('Uso: node generate-page.js nome');
  process.exit(1);
}

const ClassName = name.charAt(0).toUpperCase() + name.slice(1);
const root = process.cwd();

const pagePath = path.join(root, 'src/app/pages', name);
const servicePath = path.join(root, 'src/service');

/* 🔥 CREA CARTELLE SE NON ESISTONO */
fs.mkdirSync(pagePath, { recursive: true });
fs.mkdirSync(servicePath, { recursive: true });

/* =========================
   COMPONENT TS (IL TUO TEMPLATE)
========================= */
const componentTs = `
import { Component, inject } from '@angular/core';
import { ${ClassName}Service } from '../../../service/${name}.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, switchMap, of, catchError } from 'rxjs';
import { AuthService } from '../../../service/auth.service';
import { ${ClassName} } from '../../../service/${name}.entity';

@Component({
  selector: 'app-${name}',
  standalone: false,
  templateUrl: './${name}.component.html',
  styleUrl: './${name}.component.css',
})
export class ${ClassName}Component {

  private srv = inject(${ClassName}Service);
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
    const modalRef = this.modalService.open(${ClassName}ModalComponent);

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

  edit(item: ${ClassName}) {
    const modalRef = this.modalService.open(${ClassName}ModalComponent);

    modalRef.componentInstance.setData(item);

    modalRef.result.then((result) => {
      this.srv.update(item.id, result).subscribe(() => {
        this.refresh$.next();
      });
    }).catch(() => {});
  }

  openDetail(id: string) {
    this.router.navigate(['/${name}', id]);
  }
}
`;

/* =========================
   HTML (IL TUO TEMPLATE)
========================= */
const componentHtml = `
<div class="page">

  <h1>Lista ${name}</h1>

  <button class="btn-add" (click)="openAdd()">
    + Aggiungi
  </button>

  <table *ngIf="items$ | async as items">

    <thead>
      <tr>
        <th>Name</th>
      </tr>
    </thead>

    <tbody>

      <tr *ngFor="let c of items" (click)="openDetail(c.id)">

        <td>{{ c.name }}</td>

        <td class="actions">

          <button class="btn-edit" (click)="edit(c); $event.stopPropagation()">
            Modifica
          </button>

          <button class="btn-delete" (click)="delete(c.id); $event.stopPropagation()">
            Elimina
          </button>

        </td>

      </tr>

    </tbody>

  </table>

</div>
`;

/* =========================
   CSS (IL TUO STILE)
========================= */
const componentCss = `
.page {
  min-height: 100vh;
  padding: 40px 20px;
  background: #f4f6fb;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: Arial, sans-serif;
}

h1 {
  font-size: 30px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 25px;
}

table {
  width: 100%;
  max-width: 950px;
  border-collapse: collapse;
  background: #ffffff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

thead {
  background: linear-gradient(90deg, #2563eb, #1d4ed8);
  color: #fff;
}

th {
  text-align: left;
  padding: 16px;
  font-size: 14px;
}

td {
  padding: 14px 16px;
  font-size: 14px;
  color: #374151;
}

tbody tr {
  border-bottom: 1px solid #e5e7eb;
  transition: all 0.2s ease;
}

tbody tr:hover {
  background: #f0f6ff;
  transform: scale(1.01);
}

.actions {
  display: flex;
  gap: 8px;
}

button {
  border: none;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
}

.btn-add { background: #10b981; color: white; }
.btn-edit { background: #3b82f6; color: white; }
.btn-delete { background: #ef4444; color: white; }
`;

/* =========================
   ENTITY
========================= */
const entity = `
export type ${ClassName} = {
  id: string;
  name: string;
};
`;

/* =========================
   SERVICE
========================= */
const service = `
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { ${ClassName} } from './${name}.entity';

@Injectable({
  providedIn: 'root'
})
export class ${ClassName}Service {

  protected http = inject(HttpClient);

  list() {
    return this.http.get<${ClassName}[]>(
      \`\${environment.apiUrl}/${name}\`
    );
  }

  get(id: string) {
    return this.http.get<${ClassName}>(
      \`\${environment.apiUrl}/${name}/\${id}\`
    );
  }

  create(data: Partial<${ClassName}>) {
    return this.http.post<${ClassName}>(
      \`\${environment.apiUrl}/${name}\`,
      data
    );
  }

  update(id: string, body: Partial<${ClassName}>) {
    return this.http.put<${ClassName}>(
      \`\${environment.apiUrl}/${name}/\${id}\`,
      body
    );
  }

  remove(id: string) {
    return this.http.delete(
      \`\${environment.apiUrl}/${name}/\${id}\`
    );
  }
}
`;
/* =========================
   WRITE FILES
========================= */
fs.writeFileSync(path.join(pagePath, `${name}.component.ts`), componentTs);
fs.writeFileSync(path.join(pagePath, `${name}.component.html`), componentHtml);
fs.writeFileSync(path.join(pagePath, `${name}.component.css`), componentCss);

fs.writeFileSync(path.join(servicePath, `${name}.entity.ts`), entity);
fs.writeFileSync(path.join(servicePath, `${name}.service.ts`), service);

console.log('✅ CRUD GENERATO COMPLETAMENTE DA JS');