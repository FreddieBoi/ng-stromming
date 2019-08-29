import { ISearchResult } from './search-result';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { getCorsProxyUrl } from './utils';

/**
 * Sample URL; https://content.viaplay.se/pcdash-se/search?query=mysearchterm
 */
@Injectable({
  providedIn: 'root',
})
export class ViaplayService {

  private static readonly url = 'https://content.viaplay.se/pcdash-se/search';

  public static readonly title = 'Viaplay';

  public static readonly href = 'https://viaplay.se/';

  constructor(private http: HttpClient) {

  }

  public search(term: string): Observable<ISearchResult> {
    const searchUrl = `${getCorsProxyUrl(ViaplayService.url)}?query=${encodeURIComponent(term)}`;
    return this.http.get(searchUrl)
      .pipe(
        // tslint:disable-next-line: no-console
        tap(_ => console.info(`Search '${ViaplayService.title}' for '${term}' using ${searchUrl}...`)),
        map(response => {
          const json = response as any;
          const count = json &&
            json._embedded &&
            json._embedded['viaplay:blocks'] &&
            json._embedded['viaplay:blocks'][0] &&
            json._embedded['viaplay:blocks'][0].totalProductCount
            ? json._embedded['viaplay:blocks'][0].totalProductCount
            : 0;
          // tslint:disable-next-line: no-console
          console.info(`Search '${ViaplayService.title}' for '${term}' found ${count} hits!`);
          return {
            count,
            href: ViaplayService.href,
            title: ViaplayService.title,
          };
        }),
        catchError(error => {
          // tslint:disable-next-line: no-console
          console.error(`Search '${ViaplayService.title}' for '${term}' failed!`);
          return of({
            count: 0,
            error,
            href: ViaplayService.href,
            title: ViaplayService.title,
          });
        })
      );
    // .then(
    //   (json: any) => {
    //     const count = json &&
    //       json._embedded &&
    //       json._embedded['viaplay:blocks'] &&
    //       json._embedded['viaplay:blocks'][0] &&
    //       json._embedded['viaplay:blocks'][0].totalProductCount
    //       ? json._embedded['viaplay:blocks'][0].totalProductCount
    //       : 0;
    //     return {
    //       count,
    //       href: this.href,
    //       name: this.name,
    //     };
    //   },
    //   (reason: any) => {
    //     return {
    //       count: 0,
    //       error: reason,
    //       href: this.href,
    //       name: this.name,
    //     };
    //   },
    // );
  }

}
