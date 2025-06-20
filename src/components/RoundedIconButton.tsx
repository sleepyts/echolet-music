import {ButtonBase} from "@mui/material";
import type {ReactNode} from "react";

interface RoundedIconButtonProps {
    icon: ReactNode;
    color?: string;
    title?: string;
    onClick?: () => void;
}

export default function RoundedIconButton(
    {
        icon,
        color = "primary",
        onClick = () => {
        },
        title
    }: RoundedIconButtonProps) {
    return (
        <ButtonBase
            onClick={onClick}
            title={title}
            sx={{
                borderRadius: 2,
                p: 0.5,
            }}
            color={color}
        >
            {icon}
        </ButtonBase>
    );
}
