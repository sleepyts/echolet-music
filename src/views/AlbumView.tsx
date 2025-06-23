import {useNavigate, useParams} from "react-router-dom";
import type {AlbumDetail, AlbumSong} from "../api/album/AlbumDetailModel.ts";
import {useEffect, useState} from "react";
import {getAlbumDetail} from "../api/album/albumApis.ts";
import {Avatar, Box, Link, Stack, ToggleButton, Typography} from "@mui/material";
import RoundedIconButton from "../components/RoundedIconButton.tsx";
import {FavoriteBorder, PlayArrow} from "@mui/icons-material";
import {t} from "i18next";
import {formatTotalDuration, fromMsToTime, fromTimestampToTime, fromTimestampToYear} from "../utils/MusicDataUtil.ts";
import {useMusicStore} from "../store/MusicStore.ts";
import {getSongDetail} from "../api/track/songApis.ts";
import {CustomDialog} from "../components/CustomDialog.tsx";

export function AlbumView() {
    const albumId = useParams().id;
    const [album, setAlbum] = useState<AlbumDetail>();
    const [albumSongs, setAlbumSongs] = useState<AlbumSong[]>([]);
    useEffect(() => {
        if (!albumId) {
            return;
        }
        getAlbumDetail(Number(albumId)).then(res => {
            setAlbum(res.album)
            setAlbumSongs(res.songs)

        })
        return () => {
            setAlbum(undefined);
        }
    }, [albumId]);
    return <>
        <AlbumTopInfo album={album} albumSongs={albumSongs}/>
        <AlbumSongs album={album} albumSongs={albumSongs}/>
    </>
}

function AlbumSongs({album, albumSongs}: { album: AlbumDetail | undefined, albumSongs: AlbumSong[] }) {
    const currentMusicData = useMusicStore((state) => state.currentMusicData);
    const setCurrentMusicData = useMusicStore((state) => state.setCurrentMusicData);
    const start = useMusicStore((state) => state.start);
    const setCurrentMusicIds = useMusicStore((state) => state.setCurrentMusicIds)
    return <>
        <Box sx={{p: 1}}>
            <Stack direction={"column"} spacing={2}>

                {
                    albumSongs.map((item, index) =>
                        (
                            <ToggleButton value={item.id}
                                          key={item.id}
                                          sx={
                                              [
                                                  {
                                                      border: 'none',
                                                      justifyContent: "start",
                                                      display: "flex",
                                                  },
                                              ]
                                          }
                                          size={"small"}
                                          selected={currentMusicData?.id === item.id}
                                          onDoubleClick={async () => {
                                              getSongDetail([item.id]).then(res => {
                                                  setCurrentMusicData(res.songs[0])
                                                  start()
                                                  setCurrentMusicIds(albumSongs.map(song => song.id))

                                              })
                                          }}
                            >
                                <Box sx={{
                                    flex: 2,
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}>
                                    <Typography pl={1} pr={1} lineHeight={1}>{index + 1}</Typography>
                                    <Typography fontWeight="bold" color={"textPrimary"}
                                                noWrap
                                                textTransform="capitalize">
                                        {item.name}
                                    </Typography>
                                </Box>
                                <Box sx={{textAlign: 'right', width: '100%', alignItems: 'center', flex: 1}}>
                                    <Typography variant="body2" color="textPrimary" noWrap>
                                        {fromMsToTime(item.dt)}
                                    </Typography>
                                </Box>
                            </ToggleButton>
                        )
                    )
                }
            </Stack>
            <Typography variant="caption" color="textSecondary">
                {t('published-at')} {fromTimestampToTime(album?.publishTime as number)}
            </Typography>
        </Box>
    </>
}

function AlbumTopInfo({album, albumSongs}: { album: AlbumDetail | undefined, albumSongs: AlbumSong[] }) {
    const setCurrentMusicData = useMusicStore((state) => state.setCurrentMusicData);
    const setCurrentMusicIds = useMusicStore((state) => state.setCurrentMusicIds)
    const start = useMusicStore((state) => state.start);

    const navigate = useNavigate();
    const [openDescription, setOpenDescription] = useState<boolean>(false);
    return <>
        <Box sx={{display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', mb: 2}}>
            <Avatar src={album?.picUrl}
                    sx={{
                        width: '15rem',
                        height: '15rem',
                        mr: 4,
                        boxShadow: '3px 3px 4px 0px rgba(0,0,0,0.3)'
                    }}
                    variant={"rounded"}/>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    width: '100%',
                    height: '15rem',
                }}
            >
                <Typography variant="h3" fontWeight="bold">
                    {album?.name}
                </Typography>

                <Box>

                    <Typography variant="body2" color="textPrimary" display={"flex"} gap={0.5} alignItems={"center"}>
                        {albumSongs?.length >= 8 ? t('album') : albumSongs?.length >= 2 ? t('ep') : t('single')}
                        <Typography color={"inherit"} variant={"caption"}>{"by"}</Typography>
                        <Typography variant="body2" color="text.secondary" noWrap
                                    textTransform="capitalize">
                            <Link
                                underline="hover"
                                color="textPrimary"
                                fontWeight="bold"
                                variant="caption"
                                onClick={() => {
                                    navigate('/artist/' + album?.artist.id)
                                }}
                                sx={{
                                    '&:hover': {
                                        cursor: 'pointer',
                                    }
                                }}
                            >
                                {album?.artist.name}
                            </Link>
                        </Typography>
                    </Typography>
                    <Typography color="textSecondary" variant={"caption"}>
                        {fromTimestampToYear(album?.publishTime as number)}{" - "}
                        {albumSongs?.length}{t('song-count')}{" - "}
                        {formatTotalDuration(albumSongs.map(song => song.dt))}
                    </Typography>
                </Box>

                <Typography variant="caption" mt={1} color={"textSecondary"}
                            sx={{
                                display: '-webkit-box',
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                WebkitLineClamp: 2,
                                '&:hover': {
                                    cursor: 'pointer',
                                    opacity: '0.8',
                                    transition: 'all 0.1s ease',
                                }
                            }}
                            onClick={() => {
                                setOpenDescription(true)
                            }}
                >
                    {album?.description}
                </Typography>
                <CustomDialog open={openDescription} setOpen={setOpenDescription} title={t('album-desc')}
                              content={album?.description || ""}/>
                <Box sx={{
                    position: "sticky",
                    top: '5rem',
                    zIndex: 1,
                    backgroundColor: "background.paper",
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 2,
                    alignItems: 'center'
                }}>
                    <RoundedIconButton icon={<PlayArrow/>} showBorder={true} onClick={() => {
                        getSongDetail([albumSongs[0]?.id]).then((res) => {
                            setCurrentMusicData(res.songs[0])
                            start()
                            setCurrentMusicIds(albumSongs.map(song => song.id))
                        })
                    }}/>
                    <RoundedIconButton icon={<FavoriteBorder/>} showBorder={true}/>
                </Box>
            </Box>
        </Box>
    </>
}