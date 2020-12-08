export interface PlaceType {
    full_name: string;
    id: string;
    contained_within: [];
    country: string;
    country_code: string;
    geo: {
        type: string;
        bbox: number[];
        properties: any;
    };
    name: string;
    place_type: string;
}

export enum PlaceFieldEnum {
    contained_within = "contained_within", 
    country = "country", 
    country_code = "country_code", 
    full_name = "full_name", 
    geo = "geo", 
    id = "id", 
    name = "name", 
    place_type = "place_type"
}