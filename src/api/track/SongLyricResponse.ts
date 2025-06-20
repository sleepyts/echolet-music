export interface LyricData {
    sgc: boolean;
    sfy: boolean;
    qfy: boolean;
    code: number;

    // 原始歌词
    lrc: LyricBlock;
    klyric: LyricBlock;
    // 翻译歌词 对应中文
    tlyric: LyricBlock;
    // 罗马音歌词
    romalrc: LyricBlock;
}

export interface LyricBlock {
    version: number;
    lyric: string;
}

export interface LyricLine {
    time: number;     // 秒数
    text: string;
}