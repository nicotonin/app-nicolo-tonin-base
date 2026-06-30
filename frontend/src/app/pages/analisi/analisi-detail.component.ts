
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { AnalisiService } from '../../../service/analisi.service';
import { Analisi } from '../../../service/analisi.entity';

@Component({
  selector: 'app-analisi-detail',
  standalone: false,
  templateUrl: './analisi-detail.component.html',
  styleUrl: './analisi-detail.component.css',
})
export class AnalisiDetailComponent {

  private route = inject(ActivatedRoute);
  private srv = inject(AnalisiService);

  item$ = this.route.paramMap.pipe(
    switchMap(params => this.srv.get(params.get('id')!))
  );
}
