import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SfAnytimeService } from '../shared/services/sf-anytime.service';
import { ISearchResult } from '../shared/services/search-result';
import { SvtPlayService } from '../shared/services/svt-play.service';
import { ViaplayService } from '../shared/services/viaplay.service';
import { CmoreService } from '../shared/services/cmore.service';
import { merge } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {

  results: ISearchResult[] = [];
  searchForm: FormGroup;
  isSearching = false;

  constructor(
    private formBuilder: FormBuilder,
    private sfAnytimeService: SfAnytimeService,
    private svtPlayService: SvtPlayService,
    private viaplayService: ViaplayService,
    private cmoreService: CmoreService,
  ) {
    this.searchForm = this.formBuilder.group({
      term: '',
    });
  }

  search(data) {
    this.isSearching = true;
    this.searchForm.disable();
    this.results = [];
    const searchTerm = data.term
      ? data.term.trim()
      : '';
    if (!searchTerm) {
      return;
    }
    // tslint:disable-next-line: no-console
    console.info(`Searching...`);
    this.searchForm.reset();
    merge(
      this.sfAnytimeService.search(searchTerm),
      this.svtPlayService.search(searchTerm),
      this.viaplayService.search(searchTerm),
      this.cmoreService.search(searchTerm),
    ).subscribe(
      value => {
        if (value && value.count > 0) {
          this.results.push(value);
        }
      },
      error => {
        // tslint:disable-next-line: no-console
        console.error(`Search failed: ${error}`);
        this.isSearching = false;
        this.searchForm.enable();
      },
      () => {
        // tslint:disable-next-line: no-console
        console.info(`Search complete!`);
        this.isSearching = false;
        this.searchForm.enable();
      },
    );
  }

}
