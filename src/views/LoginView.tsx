import {Box} from "@mui/material";
import {t} from "i18next";
import {useEffect, useState} from "react";
import {generateLoginQrKey, getAccountInfo, getQrImage, getQrStatus} from "../api/user/userApis.ts";
import {useUserStore} from "../store/UserStore.ts";
import {useNavigate} from "react-router-dom";

export function LoginView() {
    const [, setQrKey] = useState("");
    const [qrImgBase64, setQrImgBase64] = useState("");
    const [qrStatus, setQrStatus] = useState(t("loading-qr-code"));

    const login = useUserStore(state => state.login)

    const navigate = useNavigate();
    useEffect(() => {
        let intervalId: number = 123;

        const startPolling = (key: string) => {
            intervalId = setInterval(async () => {
                const status = await getQrStatus(key); // 你自己的API

                if (status.code === 800) {
                    setQrStatus(t('qr-expired'));
                    clearInterval(intervalId);
                } else if (status.code === 803) {
                    setQrStatus(t('scan-success'));

                    getAccountInfo().then(accountInfo => {
                        login(accountInfo.profile, () => {
                            const cookie = status.cookie.replaceAll(' HTTPOnly', '');
                            const cookies = cookie.split(';;');
                            cookies.map(cookie => {
                                document.cookie = cookie;
                                const cookieKeyValue = cookie.split(';')[0].split('=');
                                localStorage.setItem(`cookie-${cookieKeyValue[0]}`, cookieKeyValue[1]);
                            });
                        });
                        navigate("/");
                        clearInterval(intervalId);
                    });

                } else if (status.code === 802) {
                    setQrStatus(t('waiting-for-confirm'));
                } else if (status.code === 801) {
                    setQrStatus(t('waiting-for-scan'));
                }
            }, 2000); // 每2秒轮询二维码状态
        };
        generateLoginQrKey().then((key) => {
            setQrKey(key);
            getQrImage(key).then((img) => {
                setQrImgBase64(img);
                setQrStatus(t('waiting-for-scan'));
                startPolling(key);
            });
        });

        return () => {
            clearInterval(intervalId);
        };
    }, []);
    return <>
        <Box
            position="fixed"
            top={0}
            left={0}
            width="100vw"
            height="100vh"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
        >
            <h1>{t('use-netease-scan-login')}</h1>
            <p>{qrStatus}</p>
            <img src={qrImgBase64} alt="qr-code"/>
        </Box>
    </>
}