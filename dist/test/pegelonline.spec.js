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
const src_1 = require("../src");
describe('PegelOnlineTest', () => {
    it('should use keepAlive', () => __awaiter(void 0, void 0, void 0, function* () {
        const pegelOnlineApiWrapper = new src_1.PegelOnlineApiWrapper({
            keepAlive: true
        });
        const pegelOnlineApiWrapperTestDefault = new src_1.PegelOnlineApiWrapper();
        expect(pegelOnlineApiWrapper.apiClient.defaults.httpsAgent.keepAlive).toBeTruthy();
        expect(pegelOnlineApiWrapperTestDefault.apiClient.defaults.httpsAgent.keepAlive).toBeTruthy();
    }));
    it('should not use keepAlive for several request', () => __awaiter(void 0, void 0, void 0, function* () {
        const pegelOnlineApiWrapper = new src_1.PegelOnlineApiWrapper();
        const stationList = yield pegelOnlineApiWrapper.getStationList();
        const stationDetails = yield pegelOnlineApiWrapper.getStationDetails(stationList[0].uuid);
        expect(pegelOnlineApiWrapper.apiClient.defaults.httpsAgent.keepAlive).toBeTruthy();
        expect(stationDetails.uuid).toBe(stationList[0].uuid);
    }));
    it('should not use keepAlive', () => __awaiter(void 0, void 0, void 0, function* () {
        const pegelOnlineApiWrapper = new src_1.PegelOnlineApiWrapper({
            keepAlive: false
        });
        expect(pegelOnlineApiWrapper.apiClient.defaults.httpsAgent.keepAlive).toBeFalsy();
    }));
    it('should use a non default timeout', function () {
        const pegelOnlineApiWrapper = new src_1.PegelOnlineApiWrapper({
            timeout: 100
        });
        expect(pegelOnlineApiWrapper.apiClient.defaults.timeout).toBe(100);
    });
    it('should a non default user agent', function () {
        const pegelOnlineApiWrapper = new src_1.PegelOnlineApiWrapper({
            userAgent: 'test'
        });
        expect(pegelOnlineApiWrapper.apiClient.defaults.headers['User-Agent']).toBe('test');
    });
    it('should return stations', () => __awaiter(void 0, void 0, void 0, function* () {
        const pegelOnlineApiWrapper = new src_1.PegelOnlineApiWrapper();
        const stations = yield pegelOnlineApiWrapper.getStationList();
        expect(stations.length).toBeGreaterThan(0);
    }));
    it('should return a station details of Helgoland', () => __awaiter(void 0, void 0, void 0, function* () {
        const pegelOnlineApiWrapper = new src_1.PegelOnlineApiWrapper();
        const station = yield pegelOnlineApiWrapper.getStationDetails('c0ec139b-13b4-4f86-bee3-06665ad81a40');
        expect(station.uuid).toBe('c0ec139b-13b4-4f86-bee3-06665ad81a40');
        expect(station.shortname).toBe('HELGOLAND BINNENHAFEN');
        expect(station.longname).toBe('HELGOLAND BINNENHAFEN');
        expect(station.latitude).toBe(54.17889396322482);
        expect(station.longitude).toBe(7.889904217347014);
    }));
    it('should return a station details of Ahlden', () => __awaiter(void 0, void 0, void 0, function* () {
        const pegelOnlineApiWrapper = new src_1.PegelOnlineApiWrapper();
        const station = yield pegelOnlineApiWrapper.getStationDetails('522286e2-b2b3-4d0d-9a11-01b3ea418c76');
        expect(station.uuid).toBe('522286e2-b2b3-4d0d-9a11-01b3ea418c76');
        expect(station.shortname).toBe('AHLDEN');
        expect(station.longname).toBe('AHLDEN');
        expect(station.latitude).toBe(52.76243127485539);
        expect(station.longitude).toBe(9.57088073000537);
    }));
    it('should return not return a Station', () => __awaiter(void 0, void 0, void 0, function* () {
        const pegelOnlineApiWrapper = new src_1.PegelOnlineApiWrapper();
        yield expect(pegelOnlineApiWrapper.getStationDetails('not-existing-uuid')).rejects.toThrow();
    }));
    it('should return station with more details', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const pegelOnlineApiWrapper = new src_1.PegelOnlineApiWrapper();
            const station = yield pegelOnlineApiWrapper.getStationDetailsWithCurrentMeasurementAndTimeSeries('c0ec139b-13b4-4f86-bee3-06665ad81a40');
            expect(station.uuid).toBe('c0ec139b-13b4-4f86-bee3-06665ad81a40');
            expect(station.shortname).toBe('HELGOLAND BINNENHAFEN');
            expect(station.timeseries.length).toBeGreaterThan(0);
            expect(station.timeseries[0].shortname).toBe('W');
            expect(station.timeseries[0].unit).toBe('cm');
            expect(station.timeseries[1].shortname).toBe('WT');
        });
    });
    it('should return the current measurements from a given station', () => __awaiter(void 0, void 0, void 0, function* () {
        const pegelOnlineApiWrapper = new src_1.PegelOnlineApiWrapper();
        const measurements = yield pegelOnlineApiWrapper.getCurrentMeasurement('c0ec139b-13b4-4f86-bee3-06665ad81a40');
        expect(measurements.length).toBeGreaterThan(0);
        expect(measurements[0].value).toBeGreaterThan(0);
    }));
    it('should not return the current measurements from a given station', () => __awaiter(void 0, void 0, void 0, function* () {
        const pegelOnlineApiWrapper = new src_1.PegelOnlineApiWrapper();
        yield expect(pegelOnlineApiWrapper.getCurrentMeasurement('not-existing-uuid')).rejects.toThrow();
    }));
    it('should return the historic measurements from a given station', () => __awaiter(void 0, void 0, void 0, function* () {
        const pegelOnlineApiWrapper = new src_1.PegelOnlineApiWrapper();
        const measurements = yield pegelOnlineApiWrapper.getHistoricMeasurements('c0ec139b-13b4-4f86-bee3-06665ad81a40', 'P14D');
        expect(measurements.length).toBeGreaterThan(0);
        expect(measurements[0].value).toBeGreaterThan(0);
    }));
    it('should not return the historic measurements from a given station', () => __awaiter(void 0, void 0, void 0, function* () {
        const pegelOnlineApiWrapper = new src_1.PegelOnlineApiWrapper();
        yield expect(pegelOnlineApiWrapper.getHistoricMeasurements('not-existing-uuid', 'P4D')).rejects.toThrow();
    }));
});
//# sourceMappingURL=pegelonline.spec.js.map