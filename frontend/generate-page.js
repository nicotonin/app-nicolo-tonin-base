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
import { ${ClassName}ModalComponent } from './${name}-modal.component';

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
   HTML (LIST PAGE)
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
   CSS (LIST PAGE)
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
   MODAL COMPONENT
========================= */
const modalTs = `
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ${ClassName} } from '../../../service/${name}.entity';

@Component({
  selector: 'app-${name}-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: \`
    <div class="modal-header">
      <h4 class="modal-title">{{ item.id ? 'Modifica' : 'Aggiungi' }} ${name}</h4>
    </div>

    <div class="modal-body">
      <div class="mb-3">
        <label class="form-label">Nome</label>
        <input type="text" class="form-control" [(ngModel)]="item.name" />
      </div>
    </div>

    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="activeModal.dismiss()">Annulla</button>
      <button type="button" class="btn btn-primary" (click)="confirm()">Conferma</button>
    </div>
  \`
})
export class ${ClassName}ModalComponent {

  activeModal = inject(NgbActiveModal);

  item: Partial<${ClassName}> = {};

  setData(data: ${ClassName}) {
    this.item = { ...data };
  }

  confirm() {
    this.activeModal.close(this.item);
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
import { ${ClassName} } from '../../../service/${name}.entity';

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
    <p><strong>Nome:</strong> {{ item.name }}</p>
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

.card {
  background: #fff;
  border-radius: 14px;
  padding: 24px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 600px;
}

.card p {
  font-size: 15px;
  color: #374151;
  margin: 8px 0;
}

.btn-back {
  margin-top: 20px;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  background: #6b7280;
  color: white;
  font-size: 14px;
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
fs.writeFileSync(path.join(pagePath, `${name}-modal.component.ts`), modalTs);
fs.writeFileSync(path.join(pagePath, `${name}-detail.component.ts`), detailTs);
fs.writeFileSync(path.join(pagePath, `${name}-detail.component.html`), detailHtml);
fs.writeFileSync(path.join(pagePath, `${name}-detail.component.css`), detailCss);

fs.writeFileSync(path.join(servicePath, `${name}.entity.ts`), entity);
fs.writeFileSync(path.join(servicePath, `${name}.service.ts`), service);

console.log('✅ File pagina generati');

/* =========================
   UPDATE APP-MODULE.TS
========================= */
const modulePath = path.join(root, 'src/app/app-module.ts');
let moduleContent = fs.readFileSync(modulePath, 'utf-8');

const pageImport = `import { ${ClassName}Component } from './pages/${name}/${name}.component';`;
const detailImport = `import { ${ClassName}DetailComponent } from './pages/${name}/${name}-detail.component';`;

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
const routingDetailImport = `import { ${ClassName}DetailComponent } from './pages/${name}/${name}-detail.component';`;

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