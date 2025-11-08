// src/msalConfig.ts
import { PublicClientApplication } from "@azure/msal-browser";

const CLIENT_ID = import.meta.env.VITE_MS_CLIENT_ID;

export const msalConfig = {
  auth: {
    clientId: CLIENT_ID, // zamijeni s pravim Client ID
    authority: "https://login.microsoftonline.com/common", // ili tenant-specific URL
    redirectUri: "http://localhost:5173", // URI koji si registrirao u Azure
  },
  cache: {
    cacheLocation: "sessionStorage", // ili "localStorage"
    storeAuthStateInCookie: false,
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);
