import { ISearchResult } from './search-result';
import { Observable, of, forkJoin } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { IServiceInfo } from './service-info';

/**
 * Sample URL; https://cmore-public-web-graphql-prod.herokuapp.com/graphql
 */
@Injectable({
  providedIn: 'root',
})
export class CmoreService {

  private static readonly url = 'https://cmore-public-web-graphql-prod.herokuapp.com/graphql';

  private static readonly sportQuery = `query ($limit: Int!, $q: String, $page: Int) {
  sport: search(type: "sport", limit: $limit, q: $q, page: $page) {
    totalHits
    viewables {
      ... on Asset {
        liveNow
        assetTitle
        brandDescription
        description
        duration
        genre
        category
        id
        imdb {
          id
          rating
          ratingCount
          __typename
        }
        landscape
        parentalGuidance
        poster
        relativeUrl
        series {
          id
          __typename
        }
        title
        type
        year
        episode
        season
        startTime
        league
        hometeam {
          logo
          __typename
        }
        awayteam {
          logo
          __typename
        }
        productGroups
        __typename
      }
      __typename
    }
    __typename
  }
}
`;

  private static readonly moviesAndSeriesQuery = `query ($limit: Int!, $q: String, $page: Int) {
  moviesAndSeries: search(type: "movie,series", limit: $limit, q: $q, page: $page) {
    totalHits
    viewables {
      ... on Asset {
        assetTitle
        brandDescription
        duration
        description
        genre
        category
        id
        imdb {
          id
          rating
          ratingCount
          __typename
        }
        landscape
        parentalGuidance
        poster
        relativeUrl
        liveNow
        series {
          id
          __typename
        }
        title
        type
        year
        episode
        season
        __typename
      }
      ... on Series {
        description
        genre
        category
        id
        imdb {
          id
          rating
          ratingCount
          __typename
        }
        landscape
        parentalGuidance
        poster
        relativeUrl
        title
        type
        year
        __typename
      }
      __typename
    }
    __typename
  }
}
`;

  public static readonly info: IServiceInfo = {
    title: 'C MORE',
    href: 'https://www.cmore.se/',
  };

  constructor(private http: HttpClient) {

  }

  public search(term: string): Observable<ISearchResult> {
    // tslint:disable-next-line: max-line-length

    return forkJoin(
      this.http.post(CmoreService.url, this.getData(term, CmoreService.moviesAndSeriesQuery)),
      this.http.post(CmoreService.url, this.getData(term, CmoreService.sportQuery)),
    )
      .pipe(
        tap(() => {
          // tslint:disable-next-line: no-console
          console.info(`Search '${CmoreService.info.title}' for '${term}' using ${CmoreService.url}...`);
        }),
        map(responses => {
          const count = responses.map(response => {
            const json = response as any;
            return json &&
              json.data &&
              json.data.moviesAndSeries &&
              json.data.moviesAndSeries.totalHits
              ? json.data.moviesAndSeries.totalHits as number
              : 0;
          }).reduce((a, b) => a + b, 0);
          // tslint:disable-next-line: no-console
          console.info(`Search '${CmoreService.info.title}' for '${term}' found ${count} hits!`);
          return {
            count,
            info: CmoreService.info,
          };
        }),
        catchError(error => {
          // tslint:disable-next-line: no-console
          console.error(`Search '${CmoreService.info.title}' for '${term}' failed!`);
          return of({
            count: 0,
            error,
            info: CmoreService.info,
          });
        })
      );
  }

  private getData(term: string, query: string): any {
    return {
      operationName: null,
      variables: {
        limit: 24,
        q: term,
        page: 0
      },
      query
    };
  }

}
