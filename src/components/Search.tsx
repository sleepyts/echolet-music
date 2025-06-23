import {Close, SearchRounded} from "@mui/icons-material";
import {Box, Collapse, InputBase, Paper} from "@mui/material";
import {useState} from "react";
import RoundedIconButton from "./RoundedIconButton.tsx";

interface SearchProps {
    input: string;
    setInput: (input: string) => void;
}

export function Search({input, setInput}: SearchProps) {
    const [expanded, setExpanded] = useState(false);

    return (
        <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
            <RoundedIconButton onClick={() => setExpanded(!expanded)} icon={expanded ? <Close/> : <SearchRounded/>}>
            </RoundedIconButton>

            <Collapse in={expanded} orientation="horizontal" timeout="auto">
                <Paper
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        px: 2,
                        py: 0.5,
                        width: 240,
                        transition: "all 0.3s ease",
                    }}
                >
                    <InputBase
                        autoFocus
                        placeholder="搜索内容…"
                        fullWidth
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                </Paper>
            </Collapse>
        </Box>
    );
}
