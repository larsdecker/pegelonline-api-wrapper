export type TimeSeriesWaterType = {
    shortname: 'W';
    longname: string;
    unit: string;
    equidistance: number;
    currentMeasurement: {
        value: number;
        stateMnwMhw: string;
        stateNswHsw: string;
        timestamp: string;
    };
    gaugeZero: {
        value: number;
        unit: string;
        validFrom: string;
    };
};
export type TimeSeriesWaterTemperatureType = {
    shortname: 'WT';
    longname: string;
    unit: string;
    equidistance: number;
    currentMeasurement: {
        value: number;
        timestamp: string;
    };
};
export type StationTimeSeriesType = {
    water: {
        shortname: string;
        longname: string;
    };
    timeseries: TimeSeriesWaterType[] | TimeSeriesWaterTemperatureType[];
};
