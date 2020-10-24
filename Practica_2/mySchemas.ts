export interface myCharacters{
    //_id:        {$iod: string};
    id:         number;
    status:     string;
    species:    string;
    type:       string;
    gender:     string;
    origin:     number;
    location:   number;
    image:      number;
    episodes:   number[] | string[];
}
  
export interface myLocations {
    //_id:       { $oid: string };
    id:        number;
    name:      string;
    type:      string;
    dimension: string;
    residents: number[];
}
  
export interface myEpisodes{
  //_id:        { $oid: string };
  id:         number;
  name:       string;
  air_date:   string;
  episode:    string;
  characters: number[];
}
  
export interface IData {
  info: {
    next?: string;
  }
  results: Array<{[key:string]: string | number | string[] | {[key:string]:string}}>
}