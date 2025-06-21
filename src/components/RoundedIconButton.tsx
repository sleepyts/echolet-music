import {ButtonBase, Typography, useTheme} from "@mui/material";
import type {ReactNode} from "react";
import {getTransformScaleStyles} from "../css/CommonStyle.ts";

interface RoundedIconButtonProps {
    icon?: ReactNode;
    color?: string;
    title?: string;
    text?: string;
    onClick?: () => void,
    showBorder?: boolean;
    backgroundColor?: string;
    p?: number;
    fontSize?: number;
}

export default function RoundedIconButton(
    {
        icon,
        color = "inherit",
        backgroundColor = "transparent",
        text,
        showBorder = false,
        onClick = () => {
        },
        fontSize = 14,
        title,
        p = 0.75,
    }: RoundedIconButtonProps) {

    const theme = useTheme();
    const resolvedBgColor =
        showBorder
            ? theme.palette.action.hover
            : backgroundColor in theme.palette
                ? (theme.palette as any)[backgroundColor as string]?.main
                : backgroundColor;

    const iconColor = color in theme.palette
        ? (theme.palette as any)[color]?.main
        : color;
    return (
        <ButtonBase
            onClick={onClick}
            title={title}
            sx={
                [
                    {
                        borderRadius: 2,
                        padding: p,
                        backgroundColor: resolvedBgColor,
                        color: iconColor,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        "&:hover": {
                            backgroundColor: theme.palette.action.hover,
                        },
                    },
                    getTransformScaleStyles(0.9)

                ]
            }
        >
            {icon}
            {text && (
                <Typography
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: fontSize,
                    }}
                >
                    {text}
                </Typography>
            )}
        </ButtonBase>
    );
}
