export interface PollType {
    id: string;
    options: {
        position: number;
        label: string;
        votes: number;
    }[];
    duration_minutes: number;
    end_datetime: string;
    voting_status: string;
}

export enum PollFieldEnum {
    duration_minutes = "duration_minutes", 
    end_datetime = "end_datetime", 
    id = "id", 
    options = "options", 
    voting_status = "voting_status"
}