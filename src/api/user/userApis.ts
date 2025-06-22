import http from "../http.ts";
import type {UserAccountResponse} from "./UserAccountResponse.ts";
import type {QrStatusResponse} from "./QrStatusResponse.ts";

/**
 * 获取当前登陆的用户信息 如果未登录 profile为null
 * @param timestamp
 */
export async function getAccountInfo(timestamp: number = Date.now()): Promise<UserAccountResponse> {
    return http.get("/user/account", {
        params: {timestamp}
    })
}

/**
 * 获取登陆二维码的key
 * @param timestamp
 * @return unikey 二维码的key
 */
export async function generateLoginQrKey(timestamp: number = Date.now()): Promise<string> {
    const res = await http.get("/login/qr/key", {
        params: {timestamp}
    });
    return res.data.unikey as string;
}

/**
 * 获取登陆二维码的图片
 * @param key 二维码的key
 * @param qrimg 是否返回Base64 默认true
 * @return qrimg 二维码的图片base64
 */
export async function getQrImage(key: string, qrimg: boolean = true): Promise<string> {
    const res = await http.get("/login/qr/create", {
        params: {key, qrimg}
    });
    return res.data.qrimg as string;
}

/**
 * 获取登陆二维码的状态
 * @param key 二维码的key
 * @param timestamp
 * @param noCookie
 */
export async function getQrStatus(key: string, timestamp: number = Date.now(), noCookie: boolean = true): Promise<QrStatusResponse> {
    return http.get("/login/qr/check", {
        params: {key, timestamp, noCookie}
    });
}