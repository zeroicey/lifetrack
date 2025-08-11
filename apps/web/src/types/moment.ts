export type Moment = {
    id: number;
    content: string;
    updated_at: string;
    created_at: string;
};

export type MomentCreate = {
    content: string;
};
