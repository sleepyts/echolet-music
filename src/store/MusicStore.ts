import {create} from "zustand";

import {getMusicData, getSongDetail} from "../api/track/songApis.ts";
import type {Song} from "../api/track/SongDetailResponse.ts";
import {persist, type PersistOptions} from "zustand/middleware";

export const GlobalAudio = new Audio();

interface MusicState {

    currentPlaylistId: number;

    currentMusicData: Song | undefined;

    currentMusicIds: number[] | undefined;
}


interface MusicAction {
    setCurrentMusicData: (currentMusicData: Song) => void;

    setCurrentPlaylistId: (id: number) => void;

    setCurrentMusicIds: (ids: number[]) => void;
}

interface AudioState {
    currentTime: number;
    duration: number;
    paused: boolean;
    volume: number;
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
}

async function getMusicUrl(id: number) {
    const musicData = await getMusicData([id]);
    return musicData.data[0].url;
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

            /**
             * 当刷新时 GlobalAudio是一个新的对象，需要重新设置音乐状态
             */
            whenRefreshed: () => {
                getMusicUrl(get().currentMusicData?.id || 0).then((url) => {
                    GlobalAudio.src = url
                    GlobalAudio.load()
                    GlobalAudio.pause()
                    GlobalAudio.currentTime = get().currentTime
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
                    const nextIndex = next
                        ? (currentIndex + 1) % currentMusicIds.length
                        : (currentIndex - 1 + currentMusicIds.length) % currentMusicIds.length;
                    const nextId = currentMusicIds[nextIndex];
                    getSongDetail([nextId]).then((response) => {
                        get().setCurrentMusicData(response.songs[0]);
                        resolve();
                    });
                });
            },
            seek: (time: number) => {
                GlobalAudio.currentTime = time
                GlobalAudio.fastSeek(time)
                set(() => ({
                    currentTime: time,
                }))
            }

        }),
        {
            name: "music-store",
            partialize: (state) => ({
                currentPlaylistId: state.currentPlaylistId,
                currentMusicData: state.currentMusicData,
                currentMusicIds: state.currentMusicIds,
                currentTime: state.currentTime,
                duration: state.duration,
                paused: true,
                volume: state.volume,
            })
        }
    )
)