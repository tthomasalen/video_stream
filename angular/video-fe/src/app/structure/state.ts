

export interface Login {
name: string;
token: string;
premium: boolean;
expiry: number;
error: boolean;
email: string;
}


export interface Reel {
    id: string;
    title: string;
    description: string;
}