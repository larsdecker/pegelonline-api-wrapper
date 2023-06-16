import { AxiosInstance } from 'axios';
import { StationType } from './types/stationType';
import { MeasurementType } from './types/measurementsType';
import { StationTimeSeriesType } from './types/StationTimeSeriesType';
export declare class PegelOnlineApiWrapper {
    private readonly _apiClient;
    get apiClient(): AxiosInstance;
    private baseURL;
    constructor({ timeout, userAgent, keepAlive }?: {
        timeout?: number;
        userAgent?: string;
        keepAlive?: boolean;
    });
    getStationList(): Promise<StationType[]>;
    getStationDetails(uuid: string): Promise<StationType>;
    getStationDetailsWithCurrentMeasurementAndTimeSeries(uuid: string): Promise<StationType & StationTimeSeriesType>;
    getCurrentMeasurement(uuid: string): Promise<MeasurementType[]>;
    getHistoricMeasurements(uuid: string, period: `P${number}D`): Promise<MeasurementType[]>;
    private getMeasurements;
    private getStation;
}
