import { ISearchResult } from './search-result';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { getCorsProxyUrl } from './utils';
import { IServiceInfo } from './service-info';

/**
 * Sample URL; https://content.viaplay.se/pcdash-se/search?query=mysearchterm
 */
@Injectable({
  providedIn: 'root',
})
export class ViaplayService {

  private static readonly url = 'https://content.viaplay.se/pcdash-se/search';

  public static readonly info: IServiceInfo = {
    title: 'Viaplay',
    href: 'https://viaplay.se/',
  };

  constructor(private http: HttpClient) {

  }

  public search(term: string): Observable<ISearchResult> {
    const searchUrl = `${getCorsProxyUrl(ViaplayService.url)}?query=${encodeURIComponent(term)}`;
    return this.http.get(searchUrl)
      .pipe(
        tap(() => {
          // tslint:disable-next-line: no-console
          console.info(`Search '${ViaplayService.info.title}' for '${term}' using ${searchUrl}...`);
        }),
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
          console.info(`Search '${ViaplayService.info.title}' for '${term}' found ${count} hits!`);
          return {
            count,
            info: ViaplayService.info,
          };
        }),
        catchError(error => {
          // tslint:disable-next-line: no-console
          console.error(`Search '${ViaplayService.info.title}' for '${term}' failed!`);
          return of({
            count: 0,
            error,
            info: ViaplayService.info,
          });
        })
      );
  }

}
