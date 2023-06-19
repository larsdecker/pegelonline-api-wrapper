import { PegelOnlineApiClient } from '../src';

describe('PegelOnlineTest', () => {
  it('should use keepAlive', async () => {
    const pegelOnlineApiClient = new PegelOnlineApiClient({
      keepAlive: true
    });

    const pegelOnlineApiClientTestDefault = new PegelOnlineApiClient();

    expect(
      pegelOnlineApiClient.apiClient.defaults.httpsAgent.keepAlive
    ).toBeTruthy();
    expect(
      pegelOnlineApiClientTestDefault.apiClient.defaults.httpsAgent.keepAlive
    ).toBeTruthy();
  });

  it('should use keepAlive for several request', async () => {
    const pegelOnlineApiClient = new PegelOnlineApiClient();

    const stationList = await pegelOnlineApiClient.getStationList();
    const stationDetails = await pegelOnlineApiClient.getStationDetails(
      stationList[0].uuid
    );

    // Test if the agent with keepAlive is used for several requests
    expect(
      pegelOnlineApiClient.apiClient.defaults.httpsAgent.keepAlive
    ).toBeTruthy();
    expect(stationDetails.uuid).toBe(stationList[0].uuid);
  });

  it('should not use keepAlive', async () => {
    const pegelOnlineApiClient = new PegelOnlineApiClient({
      keepAlive: false
    });

    expect(
      pegelOnlineApiClient.apiClient.defaults.httpsAgent.keepAlive
    ).toBeFalsy();
  });

  it('should use a non default timeout', function () {
    const pegelOnlineApiClient = new PegelOnlineApiClient({
      timeout: 100
    });

    expect(pegelOnlineApiClient.apiClient.defaults.timeout).toBe(100);
  });

  it('should a non default user agent', function () {
    const pegelOnlineApiClient = new PegelOnlineApiClient({
      userAgent: 'test'
    });

    expect(pegelOnlineApiClient.apiClient.defaults.headers['User-Agent']).toBe(
      'test'
    );
  });

  it('should return stations', async () => {
    const pegelOnlineApiClient = new PegelOnlineApiClient();
    const stations = await pegelOnlineApiClient.getStationList();

    expect(stations.length).toBeGreaterThan(0);
  });

  it('should return a station details of Helgoland', async () => {
    const pegelOnlineApiClient = new PegelOnlineApiClient();
    const station = await pegelOnlineApiClient.getStationDetails(
      'c0ec139b-13b4-4f86-bee3-06665ad81a40'
    );

    expect(station.uuid).toBe('c0ec139b-13b4-4f86-bee3-06665ad81a40');
    expect(station.shortname).toBe('HELGOLAND BINNENHAFEN');
    expect(station.longname).toBe('HELGOLAND BINNENHAFEN');

    expect(station.latitude).toBe(54.17889396322482);
    expect(station.longitude).toBe(7.889904217347014);
  });

  it('should return a station details of Ahlden', async () => {
    const pegelOnlineApiClient = new PegelOnlineApiClient();
    const station = await pegelOnlineApiClient.getStationDetails(
      '522286e2-b2b3-4d0d-9a11-01b3ea418c76'
    );

    expect(station.uuid).toBe('522286e2-b2b3-4d0d-9a11-01b3ea418c76');
    expect(station.shortname).toBe('AHLDEN');
    expect(station.longname).toBe('AHLDEN');

    expect(station.latitude).toBe(52.76243127485539);
    expect(station.longitude).toBe(9.57088073000537);
  });

  it('should return not return a Station', async () => {
    const pegelOnlineApiClient = new PegelOnlineApiClient();

    // expect to throw an error
    await expect(
      pegelOnlineApiClient.getStationDetails('not-existing-uuid')
    ).rejects.toThrow();
  });

  it('should return station with more details', async function () {
    const pegelOnlineApiClient = new PegelOnlineApiClient();

    const station =
      await pegelOnlineApiClient.getStationDetailsWithCurrentMeasurementAndTimeSeries(
        'c0ec139b-13b4-4f86-bee3-06665ad81a40'
      );

    expect(station.uuid).toBe('c0ec139b-13b4-4f86-bee3-06665ad81a40');
    expect(station.shortname).toBe('HELGOLAND BINNENHAFEN');

    expect(station.timeseries.length).toBeGreaterThan(0);
    expect(station.timeseries[0].shortname).toBe('W');
    expect(station.timeseries[0].unit).toBe('cm');

    expect(station.timeseries[1].shortname).toBe('WT');
  });

  it('should return the current measurements from a given station', async () => {
    const pegelOnlineApiClient = new PegelOnlineApiClient();

    const measurements = await pegelOnlineApiClient.getCurrentMeasurement(
      'c0ec139b-13b4-4f86-bee3-06665ad81a40'
    );
    expect(measurements.length).toBeGreaterThan(0);
    expect(measurements[0].value).toBeGreaterThan(0);
  });

  it('should not return the current measurements from a given station', async () => {
    const pegelOnlineApiClient = new PegelOnlineApiClient();
    await expect(
      pegelOnlineApiClient.getCurrentMeasurement('not-existing-uuid')
    ).rejects.toThrow();
  });

  it('should return the historic measurements from a given station', async () => {
    const pegelOnlineApiClient = new PegelOnlineApiClient();
    const measurements = await pegelOnlineApiClient.getHistoricMeasurements(
      'c0ec139b-13b4-4f86-bee3-06665ad81a40',
      'P14D'
    );
    expect(measurements.length).toBeGreaterThan(0);
    expect(measurements[0].value).toBeGreaterThan(0);
  });

  it('should not return the historic measurements from a given station', async () => {
    const pegelOnlineApiClient = new PegelOnlineApiClient();
    await expect(
      pegelOnlineApiClient.getHistoricMeasurements('not-existing-uuid', 'P4D')
    ).rejects.toThrow();
  });
});
