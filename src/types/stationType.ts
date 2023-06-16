export type StationType = {
  uuid: string;
  number: string;
  shortname: string;
  longname: string;
  km: number;
  agency: string;
  longitude: number;
  latitude: number;
  water: {
    shortname: string;
    longname: string;
  };
};
