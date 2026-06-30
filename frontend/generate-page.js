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
const detailPath = path.join(root, 'src/app/pages', `${name}-detail`);
const modalPath = path.join(root, 'src/app/components', `${name}-modal`);
const servicePath = path.join(root, 'src/service');

fs.mkdirSync(pagePath, { recursive: true });
fs.mkdirSync(detailPath, { recursive: true });
fs.mkdirSync(modalPath, { recursive: true });

/* =========================
   COMPONENT TS (LIST PAGE)
========================= */
const componentTs = `
import { Component, inject } from '@angular/core';
import { ${ClassName}Service } from '../../../service/${name}.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, switchMap, of, catchError } from 'rxjs';
import { AuthService } from '../../../service/auth.service';
import { ${ClassName} } from '../../../service/${name}.entity';
import { ${ClassName}ModalComponent } from '../../components/${name}-modal/${name}-modal.component';

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

    modalRef.result.then(() => {
      this.refresh$.next();
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

    modalRef.result.then(() => {
      this.refresh$.next();
    }).catch(() => {});
  }

  openDetail(id: string) {
    this.router.navigate(['/${name}', id]);
  }
}
`;

/* =========================
   HTML (LIST PAGE)
========================= */
const componentHtml = `
<div class="page">

  <h1>Lista ${name}</h1>

  <button class="btn-add" (click)="openAdd()">
    + Aggiungi
  </button>

  <div class="table-wrapper">
  <table *ngIf="items$ | async as items">

    <thead>
     <tr>
        <th>Name</th>
        <th>Actions</th>
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

</div>
`;

/* =========================
   CSS (LIST PAGE)
========================= */
const componentCss = `
.page {
  min-height: 100vh;
  padding: 40px 20px;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

h1 {
  font-size: 15px;
  font-weight: 600;
  color: #000;
  letter-spacing: -0.3px;
  margin-bottom: 20px;
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
  display: flex;
  justify-content: center;
}

table {
  width: auto;
  min-width: 500px;
  max-width: 100%;
  border-collapse: collapse;
}

th {
  text-align: left;
  padding: 10px 0;
  font-size: 12px;
  font-weight: 600;
  color: #000;
  letter-spacing: -0.2px;
  border-bottom: 1px solid #e5e5e5;
}

td {
  padding: 10px 0;
  font-size: 13px;
  color: #000;
  opacity: 0.7;
  border-bottom: 1px solid #f0f0f0;
}

tbody tr {
  transition: opacity 0.2s ease;
}

tbody tr:hover {
  opacity: 1;
}

tbody tr:hover td {
  opacity: 1;
}

.actions {
  display: flex;
  gap: 8px;
}

button {
  border: none;
  padding: 4px 10px;
  cursor: pointer;
  font-size: 11px;
  font-family: inherit;
  opacity: 0.7;
  transition: opacity 0.2s;
}

button:hover {
  opacity: 1;
}

.btn-add {
  background: none;
  color: #000;
  font-size: 13px;
  font-weight: 500;
  padding: 6px 0;
  margin-bottom: 16px;
  opacity: 0.7;
}

.btn-add:hover {
  opacity: 1;
}

.btn-edit { background: none; color: #000; }
.btn-delete { background: none; color: #000; }

@media (max-width: 768px) {
  .page {
    padding: 24px 12px;
  }

  h1 {
    font-size: 14px;
    margin-bottom: 16px;
  }

  .table-wrapper {
    justify-content: flex-start;
  }

  table {
    width: 100%;
    min-width: 0;
    max-width: 100%;
  }

  th,
  td {
    padding: 8px 0;
    font-size: 12px;
  }

  .actions {
    flex-direction: column;
    gap: 4px;
  }

  button {
    padding: 4px 8px;
    font-size: 11px;
  }
}
`;

/* =========================
   MODAL COMPONENT (with validation)
========================= */
const modalTs = `
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ${ClassName} } from '../../../service/${name}.entity';
import { ${ClassName}Service } from '../../../service/${name}.service';

@Component({
  selector: 'app-${name}-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrl: './${name}-modal.component.css',
  template: \`
    <div class="modal-header">
      <h4 class="modal-title">{{ item.id ? 'Modifica' : 'Aggiungi' }} ${ClassName}</h4>
    </div>

    <form #form="ngForm">
    <div class="modal-body">

      <div *ngIf="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>

      <div class="mb-3">
        <label class="form-label">Name</label>
        <input type="text" class="form-control" name="name" [(ngModel)]="item.name" #name="ngModel" required />
        <div *ngIf="name.invalid && name.touched" class="text-danger mt-1">
          Name is required
        </div>
      </div>

    </div>

    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="activeModal.dismiss()">Annulla</button>
      <button type="button" class="btn btn-primary" [disabled]="form.invalid || loading" (click)="confirm()">
        <span *ngIf="loading" class="spinner-border spinner-border-sm me-1"></span>
        Conferma
      </button>
    </div>
    </form>
  \`
})
export class ${ClassName}ModalComponent {

  activeModal = inject(NgbActiveModal);
  private srv = inject(${ClassName}Service);

  item: Partial<${ClassName}> = {};
  loading = false;
  errorMessage = '';

  setData(data: ${ClassName}) {
    this.item = { ...data };
  }

  confirm() {
    this.loading = true;
    this.errorMessage = '';

    const request = this.item.id
      ? this.srv.update(this.item.id, this.item)
      : this.srv.create(this.item);

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
`;

/* =========================
   DETAIL PAGE COMPONENT TS
========================= */
const detailTs = `
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { ${ClassName}Service } from '../../../service/${name}.service';

@Component({
  selector: 'app-${name}-detail',
  standalone: false,
  templateUrl: './${name}-detail.component.html',
  styleUrl: './${name}-detail.component.css',
})
export class ${ClassName}DetailComponent {

  private route = inject(ActivatedRoute);
  private srv = inject(${ClassName}Service);

  item$ = this.route.paramMap.pipe(
    switchMap(params => this.srv.get(params.get('id')!))
  );
}
`;

/* =========================
   DETAIL PAGE HTML
========================= */
const detailHtml = `
<div class="page">

  <h1>Dettaglio ${name}</h1>

  <div *ngIf="item$ | async as item; else loading" class="card">
    <p><strong>ID:</strong> {{ item.id }}</p>
    <p><strong>Name:</strong> {{ item.name }}</p>
  </div>

  <ng-template #loading>
    <p>Caricamento...</p>
  </ng-template>

  <button class="btn-back" routerLink="/${name}">Indietro</button>

</div>
`;

/* =========================
   DETAIL PAGE CSS
========================= */
const detailCss = `
.page {
  min-height: 100vh;
  padding: 40px 20px;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

h1 {
  font-size: 30px;
  font-weight: 600;
  color: #000;
  margin-bottom: 25px;
}

.card {
  background: #fff;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
}

.card p {
  font-size: 14px;
  color: #000;
  margin: 8px 0;
}

.btn-back {
  margin-top: 20px;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  background: #000;
  color: #fff;
  font-size: 13px;
  font-family: inherit;
}

@media (max-width: 768px) {
  .page {
    padding: 24px 12px;
  }

  h1 {
    font-size: 22px;
    margin-bottom: 18px;
  }

  .card {
    padding: 16px;
  }

  .card p {
    font-size: 13px;
  }

  .btn-back {
    width: 100%;
    max-width: 300px;
    text-align: center;
  }
}
`;

/* =========================
   MODAL CSS
========================= */
const modalCss = `
.modal-body {
  padding: 20px;
}
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
      \`\${environment.apiUrl}/${name}s\`
    );
  }

  get(id: string) {
    return this.http.get<${ClassName}>(
      \`\${environment.apiUrl}/${name}s/\${id}\`
    );
  }

  create(data: Partial<${ClassName}>) {
    return this.http.post<${ClassName}>(
      \`\${environment.apiUrl}/${name}s\`,
      data
    );
  }

  update(id: string, body: Partial<${ClassName}>) {
    return this.http.put<${ClassName}>(
      \`\${environment.apiUrl}/${name}s/\${id}\`,
      body
    );
  }

  remove(id: string) {
    return this.http.delete(
      \`\${environment.apiUrl}/${name}s/\${id}\`
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

fs.writeFileSync(path.join(modalPath, `${name}-modal.component.ts`), modalTs);
fs.writeFileSync(path.join(modalPath, `${name}-modal.component.css`), modalCss);

fs.writeFileSync(path.join(detailPath, `${name}-detail.component.ts`), detailTs);
fs.writeFileSync(path.join(detailPath, `${name}-detail.component.html`), detailHtml);
fs.writeFileSync(path.join(detailPath, `${name}-detail.component.css`), detailCss);

fs.writeFileSync(path.join(servicePath, `${name}.entity.ts`), entity);
fs.writeFileSync(path.join(servicePath, `${name}.service.ts`), service);

console.log('✅ File pagina generati');

/* =========================
   UPDATE APP-MODULE.TS
========================= */
const modulePath = path.join(root, 'src/app/app-module.ts');
let moduleContent = fs.readFileSync(modulePath, 'utf-8');

const pageImport = `import { ${ClassName}Component } from './pages/${name}/${name}.component';`;
const detailImport = `import { ${ClassName}DetailComponent } from './pages/${name}-detail/${name}-detail.component';`;

for (const imp of [pageImport, detailImport]) {
  if (!moduleContent.includes(imp)) {
    const lines = moduleContent.split('\n');
    const lastImportIdx = lines.map((l, i) => ({ l, i })).filter(x => x.l.startsWith('import ')).pop()?.i || 0;
    lines.splice(lastImportIdx + 1, 0, imp);
    moduleContent = lines.join('\n');
  }
}

const declMarker = 'declarations: [';
const declIdx = moduleContent.indexOf(declMarker);
if (declIdx !== -1) {
  const afterDecl = moduleContent.slice(declIdx + declMarker.length);
  const closeBracketIdx = afterDecl.indexOf(']');
  const declSection = afterDecl.slice(0, closeBracketIdx);
  if (!declSection.includes(ClassName + 'Component')) {
    moduleContent = moduleContent.slice(0, declIdx + declMarker.length) +
      `\n    ${ClassName}Component,\n    ${ClassName}DetailComponent,` +
      afterDecl;
  }
}

fs.writeFileSync(modulePath, moduleContent);

console.log('✅ AppModule aggiornato (import + declarations)');

/* =========================
   UPDATE APP-ROUTING-MODULE.TS
========================= */
const routingPath = path.join(root, 'src/app/app-routing-module.ts');
let routingContent = fs.readFileSync(routingPath, 'utf-8');

const routingImport = `import { ${ClassName}Component } from './pages/${name}/${name}.component';`;
const routingDetailImport = `import { ${ClassName}DetailComponent } from './pages/${name}-detail/${name}-detail.component';`;

if (!routingContent.includes(routingImport)) {
  const lines = routingContent.split('\n');
  const lastImportIdx = lines.map((l, i) => ({ l, i })).filter(x => x.l.startsWith('import ')).pop()?.i || 0;
  lines.splice(lastImportIdx + 1, 0, routingImport, routingDetailImport);
  routingContent = lines.join('\n');
}

const listRoute = `  {\n    path: '${name}',\n    component: ${ClassName}Component\n  },`;
const detailRoute = `  {\n    path: '${name}/:id',\n    component: ${ClassName}DetailComponent\n  },`;

if (!routingContent.includes(`path: '${name}'`)) {
  routingContent = routingContent.replace(
    /const routes: Routes = \[/,
    match => match + `\n${listRoute}\n${detailRoute}`
  );
}

fs.writeFileSync(routingPath, routingContent);

console.log('✅ RoutingModule aggiornato (routes)');
