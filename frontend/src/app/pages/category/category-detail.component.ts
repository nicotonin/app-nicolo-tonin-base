import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { CategoryService } from '../../../service/category.service';
import { Category } from '../../../service/category.entity';

@Component({
  selector: 'app-category-detail',
  standalone: false,
  templateUrl: './category-detail.component.html',
  styleUrl: './category-detail.component.css',
})
export class CategoryDetailComponent {

  private route = inject(ActivatedRoute);
  private srv = inject(CategoryService);

  item$ = this.route.paramMap.pipe(
    switchMap(params => this.srv.get(params.get('id')!))
  );
}
