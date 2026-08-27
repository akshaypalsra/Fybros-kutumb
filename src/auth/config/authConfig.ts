import { CONSTANTS } from "@/constants/Constants";
import { WebStorageStateStore } from "oidc-client-ts";
import { type AuthProviderProps } from "react-oidc-context";

export const oidcSettings = {
    authority: CONSTANTS.SSO_WEB_URL,
    client_id: CONSTANTS.SSO_WEB_CLIENT_ID,
    client_secret: CONSTANTS.SSO_WEB_CLIENT_SECRET,
    redirect_uri: window.location.origin + "/callback",
    post_logout_redirect_uri: window.location.origin + "/login",
    response_type: "code",
    scope: "openid profile email admin:read admin:write offline_access",
    automaticSilentRenew: false,
    userStore: new WebStorageStateStore({ store: window.localStorage })
};

export const authConfig: AuthProviderProps = {
    ...oidcSettings,
    onSigninCallback: () => {
        window.history.replaceState({}, document.title, window.location.pathname)
    },
}


export const oidcSettingsDesktop = {
    authority: CONSTANTS.SSO_WEB_URL,
    client_id: CONSTANTS.SSO_DESKTOP_CLIENT_ID,
    response_type: "code",
    scope: "openid profile email offline_access",
} as const;