export type RecordItem = {
    id: number;
    name: string;
    category: string;
    status: "Active" | "Draft" | "Paused";
    updated: string;
};

export type Theme = "system" | "light" | "dark";
