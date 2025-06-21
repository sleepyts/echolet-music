import {useParams} from "react-router-dom";
import type {ArtistData} from "../api/artist/ArtistDetailModel.ts";
import {useEffect, useState} from "react";
import {getArtistDetail, getArtistHotSongs} from "../api/artist/artistApis.ts";
import {Avatar, Box, Divider, Grid, Stack, ToggleButton, Typography} from "@mui/material";
import RoundedIconButton from "../components/RoundedIconButton.tsx";
import {ExpandLess, ExpandMore, FavoriteBorder, PlayArrow} from "@mui/icons-material";
import {t} from "i18next";
import type {Song} from "../api/track/SongDetailResponse.ts";
import {LazyAvatar} from "./PlaylistView.tsx";
import {useMusicStore} from "../store/MusicStore.ts";
import {getSongDetail} from "../api/track/songApis.ts";

export function ArtistView() {
    const artistId = useParams().id;
    const [artistDetail, setArtistDetail] = useState<ArtistData>();

    useEffect(() => {
        if (!artistId) {
            return;
        }

        getArtistDetail(Number(artistId)).then(res => {
            setArtistDetail(res.data)
        })

        return () => {
            setArtistDetail(undefined);
        }
    }, [artistId]);
    return <>
        <Box p={2} sx={{display: "flex", flexDirection: "column"}}>
            <ArtistInfo artistDetail={artistDetail}/>
            <Divider/>
            <ArtistHotSong artistId={Number(artistId)}/>
        </Box>
    </>
}


export function ArtistInfo({artistDetail}: { artistDetail: ArtistData | undefined }) {
    if (!artistDetail) return null;
    return <>
        <Box sx={{display: "flex", justifyContent: "flex-start", flexDirection: "row", mb: 2}}>
            <Avatar src={artistDetail.artist.avatar}
                    sx={{width: '15rem', height: '15rem', boxShadow: '0px 0px 10px rgba(0,0,0,0.2)'}}/>
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "flex-start",
                ml: 3
            }}>
                <Typography variant="h3"
                            color="textPrimary"
                            fontWeight={"bold"}
                >{artistDetail.artist.name}</Typography>
                <Typography variant="subtitle2" color="textSecondary">{artistDetail.artist.musicSize} {t('song-count')}
                    · {artistDetail.artist.albumSize} {t('album-count')} · {artistDetail.artist.mvSize} {t('mv-count')}</Typography>
                <Typography variant="body2" color="text.secondary">{artistDetail.artist.briefDesc}</Typography>
                <Stack direction="row" spacing={2}>
                    <RoundedIconButton showBorder={true} icon={<PlayArrow/>} onClick={()=>{
                    }}/>
                    <RoundedIconButton showBorder={true} icon={<FavoriteBorder/>}/>
                </Stack>

            </Box>
        </Box>
    </>
}

function ArtistHotSong({artistId}: { artistId: number | undefined }) {
    const [hotSongs, setHotSongs] = useState<Song[]>([]);
    const [expanded, setExpanded] = useState(false);

    const currentMusicData = useMusicStore(state => state.currentMusicData)
    const setCurrentMusicData = useMusicStore(state => state.setCurrentMusicData)
    const setCurrentMusicIds = useMusicStore(state => state.setCurrentMusicIds)
    const start = useMusicStore(state => state.start)
    useEffect(() => {
        getArtistHotSongs(typeof artistId === "number" ? artistId : 0).then(res => {
            if (!res) {
                return;
            }
            const numbers = res.map(song => song.id);
            setCurrentMusicIds(numbers)
            getSongDetail(numbers).then(res => {
                setHotSongs(res.songs)
            })
        });
    }, [artistId]);

    // 决定展示多少首歌
    const displayedSongs = expanded ? hotSongs : hotSongs.slice(0, 10);

    return <>
        <Box sx={{display: "flex", justifyContent: "flex-start", alignItems: "center", mt: 2}}>
            <Typography variant="h5"
                        color="textPrimary"
                        fontWeight={"bold"}
            >
                {t('hot-songs')}
            </Typography>
            {hotSongs.length > 8 && (
                <RoundedIconButton
                    icon={expanded ? <ExpandLess/> : <ExpandMore/>}
                    onClick={() => setExpanded(!expanded)}
                >
                </RoundedIconButton>
            )}

        </Box>


        <Grid container spacing={2} sx={{mt: 2,}}>
            {displayedSongs.map(song => (
                <Grid item key={song.id} sx={{width: "17%"}}>
                    <ToggleButton
                        value={song.id}
                        title={song.name}
                        sx={{
                            border: "none",
                            width: "100%",
                            height: "4rem",
                        }}
                        selected={currentMusicData?.id === song.id}
                        onDoubleClick={async () => {
                            setCurrentMusicData(song)
                            start()
                        }}
                    >
                        <LazyAvatar src={song.al.picUrl}/>
                        <Box sx={{
                            width: "100%",
                        }}>


                            <Typography
                                className="scroll-text"
                                fontSize="0.8rem"
                                fontWeight="bold"
                                color="textPrimary"
                                textTransform="capitalize"
                                align="left"
                                sx={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    width: "10rem",
                                }}
                            >
                                {song.name}
                            </Typography>

                            <Typography fontSize={"0.7rem"}
                                        color="text.secondary"
                                        align={"left"}
                                        title={song.ar.map(artist => artist.name).join("/")}
                                        sx={{
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            width: "10rem",
                                        }}
                                        textTransform="capitalize">
                                {song.ar.map(artist => artist.name).join("/")}
                            </Typography>
                        </Box>
                    </ToggleButton>
                </Grid>
            ))}
        </Grid>


    </>
}
