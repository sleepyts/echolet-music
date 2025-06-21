import type {LyricLine} from "../api/track/SongLyricResponse.ts";

export function fromMsToTime(ms: number): string {
    ms = Math.floor(ms);
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const paddedSeconds = seconds.toString().padStart(2, '0');

    return `${minutes}:${paddedSeconds}`;
}

export function fromSstoTime(ss: number): string {

    ss = Math.floor(ss);
    const minutes = Math.floor(ss / 60);
    const seconds = ss % 60;

    const paddedSeconds = seconds.toString().padStart(2, '0');

    return `${minutes}:${paddedSeconds}`;
}

export function fromTimestampToYear(timestamp: number): string {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
        return "Invalid date";
    }
    return date.getFullYear().toString();
}

/**
 * 歌词转换函数
 * "[00:00.000] 作词 : 张国祥 => { time: 歌词时间，单位秒，text: 歌词内容}
 * [00:01.000] 作曲 : 汤小康 => {time: 1.00, text: "作曲 : 汤小康"}
 * [00:04.050] => {time: 4.05, text: "作曲 : 汤小康"}
 * [00:12.570]难以忘记初次见你  => {time: 12.57, text: "难以忘记初次见你"}
 * @param raw
 */
export function parseLrc(raw: string): LyricLine[] {
    const timeTagRegex = /\[(\d{2}):(\d{2})(?:\.(\d{2,3}))?]/g;
    const lines = raw.split('\n');
    const result: LyricLine[] = [];

    for (const line of lines) {
        const matches = [...line.matchAll(timeTagRegex)];
        const text = line.replace(timeTagRegex, '').trim();

        // ❗过滤掉没有文字的行
        if (!text || matches.length === 0) continue;

        for (const match of matches) {
            const minutes = parseInt(match[1], 10);
            const seconds = parseInt(match[2], 10);
            const millis = match[3] ? parseInt(match[3].padEnd(3, '0')) : 0;
            const time = minutes * 60 + seconds + millis / 1000;

            result.push({
                time,
                text,
            });
        }
    }

    return result.sort((a, b) => a.time - b.time);
}