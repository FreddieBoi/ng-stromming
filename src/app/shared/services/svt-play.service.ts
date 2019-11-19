import { ISearchResult } from './search-result';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

/**
 * Sample URL; https://api.svt.se/contento/graphql
 */
@Injectable({
  providedIn: 'root',
})
export class SvtPlayService {

  private static readonly url = 'https://api.svt.se/contento/graphql';

  public static readonly title = 'SVT Play';

  public static readonly href = 'https://www.svtplay.se/';

  constructor(private http: HttpClient) {

  }

  public search(term: string): Observable<ISearchResult> {
    const searchUrl = this.getUrl(term);
    return this.http.get(searchUrl)
      .pipe(
        tap(() => {
          // tslint:disable-next-line: no-console
          console.info(`Search '${SvtPlayService.title}' for '${term}' using ${searchUrl}...`);
        }),
        map(response => {
          const json = response as any;
          const count = json && json.data && json.data.search
            ? json.data.search.length
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


  private getUrl(term: string): string {
    // tslint:disable-next-line: max-line-length
    return `${SvtPlayService.url}?ua=svtplaywebb-play-render-prod-client&operationName=SearchPage&variables=%7B%22querystring%22%3A%22${encodeURIComponent(term)}%22%7D&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%225dc9b6838966c23614566893feed440e718c51069fc394bcbfd3096d13ccf72f%22%7D%7D`;
  }

}
