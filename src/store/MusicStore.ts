import {create} from "zustand";

import {getLyric, getMusicData, getSongDetail} from "../api/track/songApis.ts";
import type {Song} from "../api/track/SongDetailResponse.ts";
import {persist, type PersistOptions} from "zustand/middleware";
import type {LyricLine} from "../api/track/SongLyricResponse.ts";
import {parseLrc} from "../utils/MusicDataUtil.ts";

export const GlobalAudio = new Audio();


export enum PlayMode {
    REPEATONE,
    REPEAT,
    SHUFFLE,
}

interface MusicState {

    currentPlaylistId: number;

    currentMusicData: Song | undefined;

    currentMusicIds: number[] | undefined;

    lyric: LyricLine[] | undefined;

    tlyric: LyricLine[] | undefined;

    romalyric: LyricLine[] | undefined;


    currentLyricIndex: number | undefined;


}


interface MusicAction {
    setCurrentMusicData: (currentMusicData: Song) => void;

    setCurrentPlaylistId: (id: number) => void;

    setCurrentMusicIds: (ids: number[]) => void;

    getLyric: () => void;
}

interface AudioState {
    currentTime: number;
    duration: number;
    paused: boolean;
    volume: number;
    playMode: PlayMode;
}

interface AudioAction {

    readyForNext: () => void;

    pauseOrPlay: () => void;

    start: () => void;

    seek: (time: number) => void;

    playNext: () => void;

    playPrev: () => void;

    generateNextId: (next: boolean) => Promise<void>;

    whenRefreshed: () => void;

    onTimeUpdate: () => void

    onEnd: () => void;

    changePlayMode: () => void;

    changeVolume: (volume: number) => void;
}

async function getMusicUrl(id: number) {
    const musicData = await getMusicData([id]);
    return musicData.data[0].url;
}

/**
 * 切换播放模式
 * @param mode 当前播放模式
 */
function nextPlayMode(mode: PlayMode) {
    switch (mode) {
        case PlayMode.REPEATONE:
            return PlayMode.REPEAT;
        case PlayMode.REPEAT:
            return PlayMode.SHUFFLE;
        case PlayMode.SHUFFLE:
            return PlayMode.REPEATONE;
    }
}

/**
 * 根据当前播放时间从 {time, text} 数据结构中获取当前歌词索引
 * @param lyric
 * @param currentTime
 */
function getRencentLyricIndex(lyric: LyricLine[], currentTime: number): number {
    return lyric.findIndex((line, i) => {
        return currentTime <= line.time && (i === 0 || currentTime >= lyric[i - 1].time);
    }) - 1;

}

type FullState = MusicState & MusicAction & AudioAction & AudioState;
type MyPersist = PersistOptions<FullState>;
export const useMusicStore = create<MusicState & MusicAction & AudioAction & AudioState,
    [["zustand/persist", PersistOptions<FullState>]]>(
    persist<FullState, [], [], MyPersist>(
        (set, get) => ({
            currentPlaylistId: 0,
            currentTime: 0,
            currentMusicData: undefined,
            duration: 0,
            paused: true,
            volume: 1,
            currentMusicIds: undefined,
            playMode: PlayMode.REPEAT,
            lyric: undefined,
            tlyric: undefined,
            romalyric: undefined,
            currentLyricIndex: undefined,

            getLyric: () => {

                const currentMusicData = get().currentMusicData;
                if (!currentMusicData) return;
                getLyric(currentMusicData.id).then((lyric) => {
                    const lrc = lyric.lrc;
                    const tlyric = lyric.tlyric;
                    const romalrc = lyric.romalrc;
                    if (lrc && lrc.lyric !== '') {
                        set(() => ({
                            lyric: parseLrc(lrc.lyric)
                        }))
                    }
                    if (tlyric && tlyric.lyric !== '') {
                        set(() => ({
                            tlyric: parseLrc(tlyric.lyric)
                        }))
                    }
                    if (romalrc && romalrc.lyric !== '') {
                        set(() => ({
                            romalyric: parseLrc(romalrc.lyric)
                        }))
                    }

                    console.log(get().romalyric)
                });
            },

            changeVolume: (volume: number) => {
                GlobalAudio.volume = volume
                set(() => ({
                    volume: volume,
                }))
            },
            changePlayMode: () => {
                set(() => ({
                    playMode: nextPlayMode(get().playMode),
                }))
            },
            /**
             * 当刷新时 GlobalAudio是一个新的对象，需要重新设置音乐状态
             */
            whenRefreshed: () => {
                getMusicUrl(get().currentMusicData?.id || 0).then((url) => {
                    GlobalAudio.src = url
                    GlobalAudio.load()
                    GlobalAudio.pause()
                    GlobalAudio.currentTime = get().currentTime
                    GlobalAudio.volume = get().volume
                    get().onTimeUpdate()
                    get().onEnd()
                })

            },
            onEnd: () => {
                GlobalAudio.onended = () => {
                    get().playNext()
                }
            },

            onTimeUpdate: () => {
                GlobalAudio.ontimeupdate = () => {
                    set(() => ({
                        currentTime: GlobalAudio.currentTime,
                    }))
                    const lyric = get().lyric
                    const currentTime = get().currentTime
                    if (lyric != undefined) {
                        const rencentLyricIndex = getRencentLyricIndex(lyric, currentTime);
                        if (rencentLyricIndex >= 0 && rencentLyricIndex != get().currentLyricIndex) {
                            set(() => ({
                                currentLyricIndex: rencentLyricIndex
                            }))
                        }
                    }
                }
            },
            setCurrentMusicData: (newData: Song) => {
                set(() => ({
                    currentMusicData: newData,
                }))
            },

            setCurrentMusicIds: (ids: number[]) => {
                set(() => ({
                    currentMusicIds: ids,
                }))
            },

            setCurrentPlaylistId: (id: number) => set(() => ({
                currentPlaylistId: id,
            })),

            readyForNext: () => {
                GlobalAudio.pause()
                GlobalAudio.currentTime = 0
                GlobalAudio.src = ""
                GlobalAudio.load()
                set(() => ({
                    currentTime: 0,
                    duration: 0,
                    paused: true,
                    lyric: undefined,
                    tlyric: undefined,
                    romalyric: undefined,
                    currentLyricIndex: undefined,

                }))
            },
            pauseOrPlay: () => {
                if (GlobalAudio.paused) {
                    GlobalAudio.play().then(() => {
                        set(() => ({
                            paused: false,
                        }))
                    })
                } else {
                    GlobalAudio.pause()
                    set(() => ({
                        paused: true,
                    }))
                }
            },

            start: () => {
                const currentMusicData = get().currentMusicData;
                if (!currentMusicData) return;
                get().readyForNext()
                getMusicUrl(currentMusicData.id).then((url) => {
                    GlobalAudio.src = url
                    GlobalAudio.load()
                    GlobalAudio.play().then(() => {
                        get().getLyric()
                        set(() => ({
                            currentTime: GlobalAudio.currentTime,
                            duration: GlobalAudio.duration,
                            paused: false,
                        }))
                        get().onTimeUpdate()
                        get().onEnd()
                    })
                })
            },
            playNext: () => {
                get().generateNextId(true).then(() => {
                    get().start()
                })
            },
            playPrev: () => {
                get().generateNextId(false).then(() => {
                    get().start()
                })
            },
            generateNextId: (next: boolean) => {
                return new Promise<void>((resolve) => {
                    const currentMusicIds = get().currentMusicIds!;
                    const currentIndex = currentMusicIds.indexOf(get().currentMusicData?.id || 0)
                    let nextIndex = 0
                    switch (get().playMode) {
                        case PlayMode.REPEAT:
                            nextIndex = next
                                ? (currentIndex + 1) % currentMusicIds.length
                                : (currentIndex - 1 + currentMusicIds.length) % currentMusicIds.length;
                            break;
                        case PlayMode.REPEATONE:
                            nextIndex = currentIndex;
                            break;
                        case PlayMode.SHUFFLE:
                            nextIndex = Math.floor(Math.random() * currentMusicIds.length);
                            break;
                    }

                    const nextId = currentMusicIds[nextIndex];
                    getSongDetail([nextId]).then((response) => {
                        get().setCurrentMusicData(response.songs[0]);
                        resolve();
                    });
                });
            },
            seek: (time: number) => {
                GlobalAudio.currentTime = time
            }

        }),
        {
            name: "music-store",
            partialize: (state) => ({
                currentPlaylistId: state.currentPlaylistId,
                currentMusicData: state.currentMusicData,
                currentMusicIds: state.currentMusicIds,
                duration: state.duration,
                paused: true,
                volume: state.volume,
                playMode: state.playMode,
                lyric: state.lyric,
                tlyric: state.tlyric,
                romalyric: state.romalyric,
                currentLyricIndex: state.currentLyricIndex,
            })
        }
    )
)