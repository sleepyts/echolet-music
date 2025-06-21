import {ButtonBase, useTheme} from "@mui/material";
import type {ReactNode} from "react";

interface RoundedIconButtonProps {
    icon: ReactNode;
    color?: string;
    title?: string;
    onClick?: () => void,
    backgroundColor?: string;
}

export default function RoundedIconButton(
    {
        icon,
        color = "inherit",
        backgroundColor = "transparent",
        onClick = () => {
        },
        title
    }: RoundedIconButtonProps) {

    const theme = useTheme();
    const bgColor = backgroundColor in theme.palette
        ? (theme.palette as any)[backgroundColor as string]?.main
        : backgroundColor;
    const iconColor = color in theme.palette
        ? (theme.palette as any)[color]?.main
        : color;

    return (
        <ButtonBase
            onClick={onClick}
            title={title}
            sx={{
                borderRadius: 2,
                p: 0.5,
                backgroundColor: bgColor,
                color: iconColor,
                "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                }
            }}
        >
            {icon}
        </ButtonBase>
    );
}
