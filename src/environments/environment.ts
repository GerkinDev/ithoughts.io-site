import { IIthoughtsEnvironment } from "./environment.common";

export const environment: IIthoughtsEnvironment = {
    production: false,
    app: {
        port: 0,
        url: '',
        recaptchaKey: '',
    },
    api: {
        port: 0,
        url: '',
    },
    showroom:{
        libs: [],
        sites: [],
    }
};