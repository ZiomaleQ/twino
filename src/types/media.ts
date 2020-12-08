export interface MediaType {
    media_key: string;
    type: string;
    duration_ms?: number;
    height?: number;
    preview_image_url?: string;
    public_metrics?: any;
    width?: number;
}

export enum MediaFieldEnum {
    duration_ms = "duration_ms", 
    height = "height", 
    media_key = "media_key", 
    preview_image_url = "preview_image_url", 
    type = "type", 
    url = "url", 
    width = "width", 
    public_metrics = "public_metrics"
}