import { AfterContentChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../store';
import { getLoading } from './store/selectors/loader.selectors';

@Component({
  selector: 'app-layouts',
  templateUrl: './layouts.component.html',
  styleUrls: ['./layouts.component.css']
})
export class LayoutsComponent implements OnInit, AfterContentChecked {

  isLoading$: Observable<boolean>;

  constructor(
    private store: Store<AppState>,
    private changeDetector: ChangeDetectorRef
  ) {

    this.isLoading$ = this.store.select(getLoading);
  }

  ngOnInit(): void {
  }

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }
}
