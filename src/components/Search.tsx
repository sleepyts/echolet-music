import { Close, SearchRounded } from "@mui/icons-material";
import { Box, Collapse, Input } from "@mui/material";
import { useState } from "react";
import RoundedIconButton from "./RoundedIconButton.tsx";

interface SearchProps {
  setInput: (input: string) => void;
  handleSearch?: () => void;

  changeImediatly?: boolean;
}

export function Search({
  setInput,
  handleSearch = () => {},
  changeImediatly = false,
}: SearchProps) {
  const [expanded, setExpanded] = useState(false);
  const [text, setText] = useState("");
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const val = e.currentTarget.value;
      setInput(val);
      handleSearch();
    }
  };

  let timer: NodeJS.Timeout | null = null;
  const updateInput = (text: string) => {
    if (!changeImediatly) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        const val = text;
        setInput(val);
        // handleSearch();
      }, 500);
    } else {
      setInput(text);
    }
  };
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <RoundedIconButton
        onClick={() => setExpanded(!expanded)}
        icon={expanded ? <Close /> : <SearchRounded />}
      ></RoundedIconButton>

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
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              updateInput(e.target.value);
            }}
            onKeyDown={onKeyDown}
          />
        </Box>
      </Collapse>
    </Box>
  );
}
