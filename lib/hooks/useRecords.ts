"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { RecordItem } from "@/lib/types";

export const initialRecords: RecordItem[] = [
    {
        id: 1,
        name: "Customer onboarding",
        category: "Operations",
        status: "Active",
        updated: "2 min ago",
    },
    {
        id: 2,
        name: "Q3 launch checklist",
        category: "Marketing",
        status: "Active",
        updated: "1 hour ago",
    },
    {
        id: 3,
        name: "Vendor security review",
        category: "Compliance",
        status: "Draft",
        updated: "Yesterday",
    },
    {
        id: 4,
        name: "Support escalation flow",
        category: "Operations",
        status: "Paused",
        updated: "Aug 18, 2026",
    },
];

export function useRecords() {
    const [records, setRecords] = useState(initialRecords);
    const [query, setQuery] = useState("");
    const [editing, setEditing] = useState<RecordItem | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const filtered = useMemo(
        () =>
            records.filter((item) =>
                `${item.name} ${item.category} ${item.status}`
                    .toLowerCase()
                    .includes(query.toLowerCase()),
            ),
        [records, query],
    );

    const save = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const next: RecordItem = {
            id: editing?.id ?? Date.now(),
            name: String(data.get("name")),
            category: String(data.get("category")),
            status: (String(data.get("status")) ||
                "Draft") as RecordItem["status"],
            updated: "Just now",
        };

        setRecords((current) =>
            editing
                ? current.map((item) => (item.id === editing.id ? next : item))
                : [next, ...current],
        );
        setDialogOpen(false);
        setEditing(null);
        toast.success(editing ? "Record updated" : "Record created");
    };

    const remove = (id: number) => {
        setRecords((current) => current.filter((item) => item.id !== id));
        toast.success("Record deleted");
    };

    return {
        records,
        filtered,
        query,
        setQuery,
        editing,
        setEditing,
        dialogOpen,
        setDialogOpen,
        save,
        remove,
    };
}
