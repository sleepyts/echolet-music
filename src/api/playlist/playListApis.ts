import type {PlaylistInfoResponse} from "./PlaylistInfoResponse.ts";
import http from "../http.ts";
import type {PlayListDetailResponse} from "./PlayListDetailResponse.ts";

/**
 * 获取用户歌单信息
 * @param uid 用户id
 */
export async function getUserPlaylistInfo(uid: number): Promise<PlaylistInfoResponse> {
    return http.get("/user/playlist", {
        params: {uid: uid},
    })
}


/**
 * 获取歌单详情
 * @param id 歌单id
 * @description 渲染歌单详情页面时调用，可以拿到所有歌曲的id
 */
export async function getPlaylistDetail(id: number): Promise<PlayListDetailResponse> {
    return http.get("/playlist/detail", {
        params: {id: id},
    })
}