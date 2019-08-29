import { ISearchResult } from './search-result';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { getCorsProxyUrl } from './utils';
import { catchError, map, tap } from 'rxjs/operators';

/**
 * Sample URL; https://www.svtplay.se/api/search?q=mysearchterm
 */
@Injectable({
  providedIn: 'root',
})
export class SvtPlayService {

  private static readonly url = 'https://www.svtplay.se/api/search';

  public static readonly title = 'SVT Play';

  public static readonly href = 'https://www.svtplay.se/';

  constructor(private http: HttpClient) {

  }

  public search(term: string): Observable<ISearchResult> {
    const searchUrl = `${getCorsProxyUrl(SvtPlayService.url)}?q=${encodeURIComponent(term)}`;
    return this.http.get(searchUrl)
      .pipe(
        // tslint:disable-next-line: no-console
        tap(_ => console.info(`Search '${SvtPlayService.title}' for '${term}' using ${searchUrl}...`)),
        map(response => {
          const json = response as any;
          const count = json && json.totalResults
            ? json.totalResults
            : 0;
          // tslint:disable-next-line: no-console
          console.info(`Search '${SvtPlayService.title}' for '${term}' found ${count} hits!`);
          return {
            count,
            href: SvtPlayService.href,
            title: SvtPlayService.title,
          };
        }),
        catchError(error => {
          // tslint:disable-next-line: no-console
          console.error(`Search '${SvtPlayService.title}' for '${term}' failed!`);
          return of({
            count: 0,
            error,
            href: SvtPlayService.href,
            title: SvtPlayService.title,
          });
        })
      );
  }

}
