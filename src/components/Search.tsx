import {Close, SearchRounded} from "@mui/icons-material";
import {Box, Collapse, Input} from "@mui/material";
import {useState} from "react";
import RoundedIconButton from "./RoundedIconButton.tsx";

interface SearchProps {
    input: string;
    setInput: (input: string) => void;
    handleSearch?: () => void;
    changeWhenInput?: boolean;
}

export function Search({
                           input,
                           setInput, handleSearch = () => {
    },
                           changeWhenInput = true,
                       }: SearchProps) {
    const [expanded, setExpanded] = useState(false);
    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            const val = e.currentTarget.value;
            setInput(val);
            handleSearch();
        }
    };
    return (
        <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
            <RoundedIconButton onClick={() => setExpanded(!expanded)} icon={expanded ? <Close/> : <SearchRounded/>}>
            </RoundedIconButton>

            <Collapse in={expanded} orientation="horizontal" timeout="auto">
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        px: 2,
                        py: 0.5,
                        width: 240,
                        transition: "all 0.3s ease",
                    }}
                >
                    <Input
                        autoFocus
                        placeholder="搜索内容…"
                        fullWidth
                        value={input}
                        onChange={(e) => {
                            if (changeWhenInput) {
                                setInput(e.target.value)
                            }
                        }}
                        onKeyDown={onKeyDown}
                    />
                </Box>
            </Collapse>
        </Box>
    );
}
