"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PegelOnlineApiWrapper = void 0;
const axios_1 = require("axios");
const https = require("https");
class PegelOnlineApiWrapper {
    get apiClient() {
        return this._apiClient;
    }
    constructor({ timeout, userAgent, keepAlive } = {}) {
        this.baseURL = 'https://www.pegelonline.wsv.de/webservices/rest-api/v2/';
        const httpsAgent = typeof keepAlive === 'undefined' || keepAlive === true
            ? new https.Agent({ keepAlive: true })
            : new https.Agent({ keepAlive: false });
        this._apiClient = axios_1.default.create({
            httpsAgent,
            baseURL: this.baseURL,
            timeout: timeout !== null && timeout !== void 0 ? timeout : 10000,
            headers: {
                'User-Agent': userAgent !== null && userAgent !== void 0 ? userAgent : require('../package.json').name
            }
        });
    }
    getStationList() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._apiClient.get('stations.json');
                return response.data;
            }
            catch (e) {
                throw new Error(`Error while getting station list: ${e.toString()}`);
            }
        });
    }
    getStationDetails(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = new URL(`stations/${uuid}.json`, this.baseURL);
            return yield this.getStation(url);
        });
    }
    getStationDetailsWithCurrentMeasurementAndTimeSeries(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = new URL(`stations/${uuid}.json`, this.baseURL);
            url.searchParams.append('includeTimeseries', 'true');
            url.searchParams.append('includeCurrentMeasurement', 'true');
            return (yield this.getStation(url));
        });
    }
    getCurrentMeasurement(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            let url = new URL(`stations/${uuid}/W/measurements.json`, this.baseURL);
            return yield this.getMeasurements(url);
        });
    }
    getHistoricMeasurements(uuid, period) {
        return __awaiter(this, void 0, void 0, function* () {
            let url = new URL(`stations/${uuid}/W/measurements.json`, this.baseURL);
            url.searchParams.append('start', period);
            return yield this.getMeasurements(url);
        });
    }
    getMeasurements(url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._apiClient.get(url.toString());
                return response.data;
            }
            catch (e) {
                throw new Error(`Error while getting historic measurement: ${e.toString()}`);
            }
        });
    }
    getStation(url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._apiClient.get(url.toString());
                return response.data;
            }
            catch (e) {
                throw new Error(`Error while getting station: ${e.toString()}`);
            }
        });
    }
}
exports.PegelOnlineApiWrapper = PegelOnlineApiWrapper;
//# sourceMappingURL=index.js.map