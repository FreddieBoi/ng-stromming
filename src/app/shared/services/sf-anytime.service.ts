import { ISearchResult } from './search-result';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

/**
 * Sample URL; https://e38fd90mob-dsn.algolia.net/1/indexes//queries?
 * x-algolia-agent=Algolia%20for%20vanilla%20JavaScript%20(lite)%203.21.1%3Binstantsearch.js%201.11.7%3BJS%20Helper%202.19.0
 * &x-algolia-application-id=E38FD90MOB
 * &x-algolia-api-key=3f56a452156f1a76c8939af1798a2335
 */
@Injectable({
  providedIn: 'root',
})
export class SfAnytimeService {

  // tslint:disable-next-line: max-line-length
  private static readonly url = 'https://e38fd90mob-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20vanilla%20JavaScript%20(lite)%203.21.1%3Binstantsearch.js%201.11.7%3BJS%20Helper%202.19.0&x-algolia-application-id=E38FD90MOB&x-algolia-api-key=3f56a452156f1a76c8939af1798a2335';

  public static readonly title = 'SF Anytime';

  public static readonly href = 'https://www.sfanytime.com/sv';

  constructor(private http: HttpClient) {

  }

  public search(term: string): Observable<ISearchResult> {
    // tslint:disable-next-line: max-line-length
    const data = `{"requests":[{"indexName":"prod_sfanytime_movies","params":"query=${encodeURIComponent(term)}&numericFilters=adult%3D0%2C%20available_in_se%3D1&hitsPerPage=60&maxValuesPerFacet=3&page=0&attributesToRetrieve=mediaid%2Cproducttype%2Cproducttypeid%2Ctitle%2Ctitle_sv%2Ctitle_no%2Ctitle_da%2Ctitle_fi%2Ccover_id%2Ccover_no%2Ccover_sv%2Ccover_da%2Ccover_fi&distinct=true&facets=%5B%5D&tagFilters="}]}`;
    return this.http.post(SfAnytimeService.url, data)
      .pipe(
        // tslint:disable-next-line: no-console
        tap(_ => console.info(`Search '${SfAnytimeService.title}' for '${term}' using ${SfAnytimeService.url}...`)),
        map(response => {
          const json = response as any;
          const count = json &&
            json.results &&
            json.results[0] &&
            json.results[0].nbHits
            ? json.results[0].nbHits
            : 0;
          // tslint:disable-next-line: no-console
          console.info(`Search '${SfAnytimeService.title}' for '${term}' found ${count} hits!`);
          return {
            count,
            href: SfAnytimeService.href,
            title: SfAnytimeService.title,
          };
        }),
        catchError(error => {
          // tslint:disable-next-line: no-console
          console.error(`Search '${SfAnytimeService.title}' for '${term}' failed!`);
          return of({
            count: 0,
            error,
            href: SfAnytimeService.href,
            title: SfAnytimeService.title,
          });
        })
      );
  }

}
