import { MediaFieldEnum, MediaType } from "./media.ts";
import { PlaceFieldEnum, PlaceType } from "./place.ts";
import { PollFieldEnum, PollType } from "./poll.ts";
import { UserFieldEnum, UserType } from "./user.ts";

export interface TweetType {
    id: string;
    text: string;
    author_id?: string;
    conversation_id?: string;
    in_reply_to_user_id?: string;
    referenced_tweets?: ReferencedTweetType[];
    attachments?: AttachmentType;
    geo?: GeoType;
    context_annotations?: any;
    entities?: EntitiesType;
    witheld?: WitheldType;
    public_metrics?: PublicMetricsType;
    possibly_sensitive?: boolean;
    lang?: string;
    source?: string;
    includes?: {
        tweets?: TweetType[];
        users?: UserType[];
        places?: PlaceType[];
        media?: MediaType[];
        polls?: PollType[];
    }
}

export interface ReferencedTweetType {
    type: TweetTypeType;
    id: string;
}

export enum TweetTypeType { retweeted, quoted, replied_to }

export interface AttachmentType {
    media_keys?: any[];
    poll_ids?: any[];
}

export interface GeoType {
    coordinates: {
        coordinates?: any[];
        type?: string;
    }
    place_id: string;
}

export interface ContextAnnotationType {
    domain?: { id: string; name: string; description?: string; }
    entity?: { id: string, name: string; description?: string; }
}

export interface EntitiesType {
    annotations?: {
        start: number,
        end: number,
        probability: number,
        type: string,
        normalized_text: string
    }[]
    urls?: {
        start: number;
        end: number;
        url: string;
        expanded_url: string;
        display_url: string;
        unwounded_url: string;
    }[]
    hashtags?: {
        start: number;
        end: number;
        tag: string;
    }[]
    mentions?: {
        start: number;
        end: number;
        username: string;
    }[]
    cashtags?: {
        start: number;
        end: number;
        tag: string;
    }[]
}

export interface WitheldType {
    copyright: boolean;
    country_codes: string[];
    scope: WitheldScope;
}

export enum WitheldScope { tweet, user }

export interface PublicMetricsType {
    retweet_count: number;
    reply_count: number;
    like_count: number;
    quote_count: number;
}

export enum TweetFieldEnum {
    attachments = "attachments", 
    author_id = "author_id", 
    context_annotations = "context_annotations", 
    conversation_id = "conversation_id", 
    created_at = "created_at", 
    entities = "entities", 
    geo = "geo", 
    id = "id", 
    in_reply_to_user_id = "in_reply_to_user_id", 
    lang = "lang", 
    public_metrics = "public_metrics", 
    possibly_sensitive = "possibly_sensitive", 
    referenced_tweets = "referenced_tweets", 
    reply_settings = "reply_settings", 
    source = "source", 
    text = "text", 
    withheld = "withheld"
}

export enum ExpansionFieldEnum {
    attachments_poll_ids = "attachments.poll_ids", 
    attachments_media_keys = "attachments.media_keys", 
    author_id = "author_id", 
    entities_mentions_username = "entities.mentions.username", 
    geo_place_id = "geo.place_id", 
    in_reply_to_user_id = "in_reply_to_user_id", 
    referenced_tweets_id = "referenced_tweets.id", 
    referenced_tweets_id_author_id = "referenced_tweets.id.author_id"
}

export interface Fields {
    all?: boolean;
    expansions?: boolean | ExpansionFieldEnum[];
    media?: boolean | MediaFieldEnum[];
    place?: boolean | PlaceFieldEnum[];
    poll?: boolean | PollFieldEnum[];
    tweet?: boolean | TweetFieldEnum[];
    user?: boolean | UserFieldEnum[];
}