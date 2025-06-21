import {t} from "i18next";
import {useMusicStore} from "../store/MusicStore"
import {Avatar, Box, Input, Link, Skeleton, Stack, ToggleButton, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import {getPlaylistDetail} from "../api/playlist/playListApis.ts";
import type {PlaylistDetail} from "../api/playlist/PlayListDetailResponse.ts";
import type {Song} from "../api/track/SongDetailResponse.ts";
import {getSongDetail} from "../api/track/songApis.ts";
import {fromMsToTime} from "../utils/MusicDataUtil.ts";
import {useInView} from "react-intersection-observer";
import {Menu, PlayArrow, Search} from "@mui/icons-material";
import RoundedIconButton from "../components/RoundedIconButton.tsx";
import {useNavigate} from "react-router-dom";

export function PlaylistView() {
    const currentPlaylistId = useMusicStore((state) => state.currentPlaylistId)
    const [currentPlaylistDetail, setCurrentPlaylistDetail] = useState<PlaylistDetail | null>(null);
    useEffect(() => {
        getPlaylistDetail(currentPlaylistId).then((res) => {
            setCurrentPlaylistDetail(res.playlist)
        })
    }, [currentPlaylistId]);
    return <>
        <Box p={2} sx={{display: 'flex', flexDirection: 'column'}}>
            <TopPlaylistInfo playlist={currentPlaylistDetail}/>
            <SeriesList seriesIds={currentPlaylistDetail?.trackIds.map(item => item.id) || []}/>
        </Box>
    </>
}


function TopPlaylistInfo({playlist}: { playlist: PlaylistDetail | null }) {
    return <>
        <Box sx={{display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', mb: 2}}>
            <Avatar src={playlist?.coverImgUrl} sx={{width: '15rem', height: '15rem', mr: 2}} variant={"rounded"}/>
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
                <Box>
                    <Typography variant="h5" fontWeight="bold">
                        {playlist?.name}
                    </Typography>
                    <Typography variant="body2" mt={1}>
                        {playlist?.description}
                    </Typography>
                </Box>

                <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                    <Link href="#" variant="body2" color={"inherit"}
                          underline={"hover"}>{playlist?.creator.nickname}</Link>
                    <Typography variant="body2" ml={1}>{playlist?.trackCount + t('song-count')}</Typography>
                </Box>
            </Box>
        </Box>
    </>
}


const SeriesList = ({seriesIds}: { seriesIds: number[] }) => {
    const setCurrentMusicData = useMusicStore((state) => state.setCurrentMusicData)
    const start = useMusicStore((state) => state.start)
    const currentMusicData = useMusicStore((state) => state.currentMusicData)
    const setCurrentMusicIds = useMusicStore((state) => state.setCurrentMusicIds)
    const [, setVisibleIds] = useState<number[]>([]);
    const [dataList, setDataList] = useState<Song[]>([]);

    const [loading, setLoading] = useState<boolean>(true);
    const [searchText, setSearchText] = useState<string>("");

    const navigate = useNavigate();
    useEffect(() => {
        if (seriesIds.length === 0) return;

        setCurrentMusicIds(seriesIds);
        fetchDataByIds(seriesIds).then(data => {
            setDataList(data);
            setVisibleIds(seriesIds);
            setLoading(false);
        });

        return () => {
            setDataList([])
            setVisibleIds([])
            setLoading(true)
        }
    }, [seriesIds]);


    const fetchDataByIds = async (ids: number[]): Promise<Song[]> => {
        return getSongDetail(ids).then(res => res.songs);
    };

    return (
        <Box sx={{p: 1}}>
            <Box sx={{display: 'flex', flexDirection: 'row', gap: 2, mb: 2, alignItems: 'center'}}>
                <RoundedIconButton icon={<PlayArrow/>} onClick={() => {
                    setCurrentMusicData(dataList[0])
                    start()
                }}/>
                <RoundedIconButton icon={<Menu/>}/>
                <Input startAdornment={<Search fontSize="small"/>}
                       placeholder={t('search')}
                       onChange={(e) => {
                           setSearchText(e.target.value)
                       }}
                />
            </Box>

            <Stack direction={"column"} spacing={2}>
                {
                    loading ? <>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(item => (
                            <Skeleton key={item} variant="rectangular" width={"100%"} height={"3rem"}/>
                        ))}
                    </> : <>
                        {dataList.map(item =>
                                (searchText === "" || item.name.toLowerCase().includes(searchText.toLowerCase()) || item.ar.some(artist => artist.name.toLowerCase().includes(searchText.toLowerCase()))) && (
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
                                                      setCurrentMusicData(item)
                                                      start()
                                                  }}
                                    >
                                        <LazyAvatar src={item.al.picUrl}/>
                                        <Box sx={{flex: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
                                            <Typography variant="body2" fontWeight="bold" noWrap textTransform="capitalize">
                                                {item.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" noWrap
                                                        textTransform="capitalize">
                                                {item.ar.map((artist, index) => (
                                                    <span key={artist.id || artist.name}>
                                                    <Link
                                                        underline="hover"
                                                        color="textSecondary"
                                                        variant="caption"
                                                        onClick={() => {
                                                            navigate('/artist/' + artist.id)
                                                        }}
                                                    >
                                                        {artist.name}
                                                    </Link>
                                                        {index < item.ar.length - 1 && ' / '}
                                                    </span>
                                                ))}
                                            </Typography>
                                        </Box>
                                        <Box sx={{alignItems: 'flex-start', justifyContent: 'flex-start', flex: 1.5}}>
                                            <Typography variant="body2" color="textPrimary" noWrap
                                                        textTransform="capitalize">
                                                {item.al.name}
                                            </Typography>
                                        </Box>
                                        <Box sx={{textAlign: 'right', width: '100%', alignItems: 'center', flex: 1}}>
                                            <Typography variant="body2" color="textPrimary" noWrap>
                                                {fromMsToTime(item.dt)}
                                            </Typography>
                                        </Box>
                                    </ToggleButton>
                                )
                        )}
                    </>
                }
            </Stack>
        </Box>
    )
        ;
};

export const LazyAvatar = ({src}: { src: string }) => {
    const {ref, inView} = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    return (
        <div ref={ref}>
            {inView ? (
                <Avatar
                    src={src}
                    sx={{width: '3rem', height: '3rem', mr: 2}}
                    variant="rounded"
                />
            ) : (
                <Avatar
                    sx={{width: '3rem', height: '3rem', mr: 2}}
                    variant="rounded"
                />
            )}
        </div>
    );
};