import { MediaType } from "./media.ts";
import { PlaceType } from "./place.ts";
import { PollType } from "./poll.ts";
import { UserType } from "./user.ts";

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
    includes: {
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
        coordinates: any[] | undefined;
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

export interface Fields {
    all?: boolean;
    expansions?: boolean;
    media?: boolean;
    place?: boolean;
    poll?: boolean;
    tweet?: boolean;
    user?: boolean;
}