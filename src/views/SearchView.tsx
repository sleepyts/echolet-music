import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import type {SearchArtist} from "../api/search/SearchModel.ts";
import {searchArtists} from "../api/search/searchApis.ts";
import {Box, Link, Stack, Typography} from "@mui/material";
import {t} from "i18next";
import {LazyAvatar} from "./PlaylistView.tsx";
import RoundedIconButton from "../components/RoundedIconButton.tsx";
import {ReadMore} from "@mui/icons-material";

export function SearchView() {
    const searchInput = useParams().text || '';
    return <>
        <SearchArtistView searchInput={searchInput}/>
    </>
}

function SearchArtistView({searchInput}: { searchInput: string }) {
    const [searchedArtists, setSearchedArtists] = useState<SearchArtist[]>([]);
    const navigate = useNavigate();
    useEffect(() => {
        searchArtists(searchInput || '', 6, 0).then(res => {
            setSearchedArtists(res.result.artists);
        });
    }, [searchInput]);
    return <>
        <Box>
            <Box display={"flex"} flexDirection={"row"} alignItems={"center"} mb={2}>
                <Typography variant="h5" fontWeight={"bold"} mr={2}>{t('artist')}</Typography>
                <RoundedIconButton
                    title={t('show-all')}
                    icon={<ReadMore/>}
                />
            </Box>

            <Stack direction={"row"} spacing={2}>
                {
                    searchedArtists && searchedArtists.length > 0 && searchedArtists.map(artist => (
                        <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>

                            <Box
                                sx={{
                                    boxShadow: 3,
                                    borderRadius: '50%',
                                    transition: 'box-shadow 0.2s ease-in-out',
                                    '&:hover': {
                                        cursor: 'pointer',
                                        boxShadow: 6,
                                    },
                                }}
                                onClick={() => {
                                    navigate(`/artist/${artist.id}`)
                                }}
                            >
                                <LazyAvatar src={artist.picUrl || ""} size={"15rem"} circled={true}/>
                            </Box>
                            <Typography variant="subtitle2" fontWeight="bold" noWrap mt={2}>
                                <Link
                                    underline="hover"
                                    color="textPrimary"
                                    sx={{'&:hover': {cursor: 'pointer'}}}
                                    onClick={() => {
                                        navigate(`/artist/${artist.id}`)
                                    }}
                                >
                                    {artist.name}
                                </Link>
                            </Typography>
                        </Box>


                    ))
                }
            </Stack>
        </Box>
    </>
}
