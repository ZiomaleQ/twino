import { UserType } from "./user.ts";

export interface TweetType {
    created_at: string;
    id: number;
    id_str: string;
    text: string;
    source: string;
    user: UserType;
    place?: PlaceType;
    entities: EntitiesType;
    extended_entities: ExtendedEntitiesType;
}

export interface PlaceType {

}

export interface EntitiesType {
    hashtags?: string[];
    urls?: UrlType[];
}

export interface UrlType {
    url: string;
    unwound: {
        url: string;
        tittle: string;
    }
}

export interface ExtendedEntitiesType {

}

export interface RetweetType {
    tweet: {
        text: string;
        user: UserType
        retweeted_status: TweetType;
        entities: EntitiesType;
        extended_entities: ExtendedEntitiesType;
    }
}

export interface QouteType {

}