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