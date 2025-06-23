import type {Song} from "../track/SongDetailResponse.ts";

export interface ArtistSongsResponse {
    songs: Song[],
    more: boolean,
    total: number,
    count: number,
}