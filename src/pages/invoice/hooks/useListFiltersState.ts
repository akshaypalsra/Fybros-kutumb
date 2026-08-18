import { useState } from "react";

export function useListFiltersState() {
    const [search, setSearch] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [selectedVerticals, setSelectedVerticals] = useState<string[]>([]);
    const reset = () => {
        setSearch("");
        setDateFrom("");
        setDateTo("");
        setSelectedVerticals([]);
    };
    return {
        search,
        setSearch,
        dateFrom,
        setDateFrom,
        dateTo,
        setDateTo,
        selectedVerticals,
        setSelectedVerticals,
        reset,
    };
}