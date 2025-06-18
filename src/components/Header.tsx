import {Box, Button, Stack} from "@mui/material";

export function Header() {
    return <Box display={"flex"} p={2}>
        <Stack spacing={2} direction={"row"} position={"absolute"} left={'50%'} sx={{transform: 'translateX(-50%)'}}>
            <Button variant={"text"}>Home</Button>
            <Button variant={"text"}>About</Button>
            <Button variant={"text"}>Contact</Button>
        </Stack>

        <Stack spacing={2} direction={"row"} ml={"auto"}>
            <Button variant={"text"}>Login</Button>
            <Button variant={"contained"}>Sign Up</Button>
        </Stack>
    </Box>
}