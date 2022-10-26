import { ApplicationMetaData } from "./ApplicationTypes";

export enum MimeTypes {
  txt = "txt",
  thijm = "thijm",
}

export type SystemSettings = { sounds: any; notifications: any; storage: any };
export type PersonalisationSettings = { background: string };
export type AppSettings = {
  installedApps: Array<ApplicationMetaData>;
  defaultApps: { [key in MimeTypes]: ApplicationMetaData };
};
export type AccountSettings = any;

export type OSSettings = {
  system: SystemSettings;
  personalisation: PersonalisationSettings;
  apps: AppSettings;
  accounts: AccountSettings;
};
