export interface UserType {
    id: number;
    id_str?: string;
    name: string;
    screen_name?: string;
    username: string;
    created_at?: string;
    location?: string;
    url?: string;
    description?: string;
    entities?: any;
    pinned_tweet_id?: string;
    profile_image_url?: string;
    protected?: boolean;
    public_metrics?: {
        followers_count: number;
        following_count: number;
        tweet_count: number;
        listed_count: number;
    };
    verified?: boolean;
}

export enum UserFieldEnum {
    created_at = "created_at", 
    description = "description", 
    entities = "entities", 
    id = "id", 
    location = "location", 
    name = "name", 
    pinned_tweet_id = "pinned_tweet_id", 
    profile_image_url = "profile_image_url", 
    protected = "protected", 
    public_metrics = "public_metrics", 
    url = "url", 
    username = "username", 
    verified = "verified", 
    withheld = "withheld"
}