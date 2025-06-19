export interface MusicDataResponse {
    data: MusicData[];
    code: number;
}

interface MusicData {
    id: number;
    url: string;
    br: number;
    size: number;
    md5: string;
    code: number;
    expi: number;
    type: string;
    gain: number;
    peak: number;
    closedGain: number;
    closedPeak: number;
    fee: number;
    uf: string | null;
    payed: number;
    flag: number;
    canExtend: boolean;
    freeTrialInfo: FreeTrialInfo | null;
    level: string;
    encodeType: string;
    channelLayout: string | null;
    freeTrialPrivilege: FreeTrialPrivilege;
    freeTimeTrialPrivilege: FreeTimeTrialPrivilege;
    urlSource: number;
    rightSource: number;
    podcastCtrp: string | null;
    effectTypes: string | null;
    time: number;
    message: string | null;
    levelConfuse: string | null;
    musicId: string;
    accompany: string | null;
    sr: number;
    auEff: string | null;
}

interface FreeTrialInfo {
    // Add fields here if needed, as the example data doesn't have values
}

interface FreeTrialPrivilege {
    resConsumable: boolean;
    userConsumable: boolean;
    listenType: string | null;
    cannotListenReason: string | null;
    playReason: string | null;
    freeLimitTagType: string | null;
}

interface FreeTimeTrialPrivilege {
    resConsumable: boolean;
    userConsumable: boolean;
    type: number;
    remainTime: number;
}
