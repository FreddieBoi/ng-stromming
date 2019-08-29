import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SfAnytimeService } from '../shared/services/sf-anytime.service';
import { ISearchResult } from '../shared/services/search-result';
import { SvtPlayService } from '../shared/services/svt-play.service';
import { ViaplayService } from '../shared/services/viaplay.service';

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
  ) {
    this.searchForm = this.formBuilder.group({
      term: '',
    });
  }

  search(data) {
    this.searchForm.disable();
    this.results = [];
    const searchTerm = data.term
      ? data.term.trim()
      : '';
    if (!searchTerm) {
      return;
    }
    this.searchForm.reset();
    this.sfAnytimeService.search(searchTerm).subscribe(result => this.results.push(result));
    this.svtPlayService.search(searchTerm).subscribe(result => this.results.push(result));
    this.viaplayService.search(searchTerm).subscribe(result => this.results.push(result));
    // TODO: Invoke "later"...
    this.searchForm.enable();
  }

}
