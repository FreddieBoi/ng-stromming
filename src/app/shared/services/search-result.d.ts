import { IServiceInfo } from "./service-info";

export interface ISearchResult {
  info: IServiceInfo;
  count: number;
  error?: string;
}
