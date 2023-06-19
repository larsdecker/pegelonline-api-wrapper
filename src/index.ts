import axios, { AxiosInstance } from 'axios';
import { StationType } from './types/stationType';
import { MeasurementType } from './types/measurementsType';
import { StationTimeSeriesType } from './types/StationTimeSeriesType';
import * as https from 'https';

export class PegelOnlineApiClient {
  private readonly _apiClient: AxiosInstance;

  get apiClient(): AxiosInstance {
    return this._apiClient;
  }

  private baseURL = 'https://www.pegelonline.wsv.de/webservices/rest-api/v2/';

  constructor({
    timeout,
    userAgent,
    keepAlive
  }: {
    timeout?: number;
    userAgent?: string;
    keepAlive?: boolean;
  } = {}) {
    const httpsAgent =
      typeof keepAlive === 'undefined' || keepAlive === true
        ? new https.Agent({ keepAlive: true })
        : new https.Agent({ keepAlive: false });

    this._apiClient = axios.create({
      httpsAgent,
      baseURL: this.baseURL,
      timeout: timeout ?? 10000,
      headers: {
        'User-Agent': userAgent ?? 'pegelonline-api-client-javascript'
      }
    });
  }

  /**
   * Get a list of all stations
   */
  public async getStationList(): Promise<StationType[]> {
    try {
      const response = await this._apiClient.get<StationType[]>(
        'stations.json'
      );
      return response.data;
    } catch (e) {
      throw new Error(`Error while getting station list: ${e.toString()}`);
    }
  }

  /**
   * Get a specific station by its uuid
   * @param uuid
   */
  public async getStationDetails(uuid: string): Promise<StationType> {
    const url = new URL(`stations/${uuid}.json`, this.baseURL);
    return await this.getStation(url);
  }

  /**
   * Get a specific station details with included timeseries and includeCurrentMeasurements by its uuid
   * @param uuid
   */
  public async getStationDetailsWithCurrentMeasurementAndTimeSeries(
    uuid: string
  ): Promise<StationType & StationTimeSeriesType> {
    const url = new URL(`stations/${uuid}.json`, this.baseURL);
    url.searchParams.append('includeTimeseries', 'true');
    url.searchParams.append('includeCurrentMeasurement', 'true');
    return (await this.getStation(url)) as StationType & StationTimeSeriesType;
  }

  /**
   * Get the current measurement of a specific station
   * @param uuid
   */
  public async getCurrentMeasurement(uuid: string): Promise<MeasurementType[]> {
    let url = new URL(`stations/${uuid}/W/measurements.json`, this.baseURL);

    return await this.getMeasurements(url);
  }

  /**
   * Get the historic measurement of a specific station
   * @param uuid
   * @param period
   */
  public async getHistoricMeasurements(
    uuid: string,
    period: `P${number}D`
  ): Promise<MeasurementType[]> {
    let url = new URL(`stations/${uuid}/W/measurements.json`, this.baseURL);
    url.searchParams.append('start', period);

    return await this.getMeasurements(url);
  }

  /**
   * Internal function to get the measurements from a given url
   * @param url
   * @private
   */
  private async getMeasurements(url: URL) {
    try {
      const response = await this._apiClient.get<MeasurementType[]>(
        url.toString()
      );
      return response.data;
    } catch (e) {
      throw new Error(
        `Error while getting historic measurement: ${e.toString()}`
      );
    }
  }

  /**
   * Internal function to get a station from a given url
   * @param url
   * @private
   */
  private async getStation(url: URL): Promise<StationType> {
    try {
      const response = await this._apiClient.get<StationType>(url.toString());
      return response.data;
    } catch (e) {
      throw new Error(`Error while getting station: ${e.toString()}`);
    }
  }
}
