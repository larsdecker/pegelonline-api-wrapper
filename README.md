# pegelonline-api-client
A wrapper for the Pegelonline API. The API Endpoint is free of charge and can be used without registration. The API provided data about water levels, water temperatures and discharge rates of rivers in Germany. The data is provided by the Federal Waterways and Shipping Administration (WSV).

The wrapper is written in Typescript and can be used in Node.js and in the browser. 

## Installation
```
npm install pegelonline-api-client
```

## Usage


### Node.js
```javascript
const PegelonlineApi = require('pegelonline-api-client').PegelOnlineApiClient;
const api = new PegelOnlineApiClient();

const station = await api.getStationDetails('c0ec139b-13b4-4f86-bee3-06665ad81a40');

```
### Browser
```javascript
import { PegelOnlineApiClient } from 'pegelonline-api-client';
const api = new PegelOnlineApiClient();

const station = await api.getStationDetails('c0ec139b-13b4-4f86-bee3-06665ad81a40');

```
