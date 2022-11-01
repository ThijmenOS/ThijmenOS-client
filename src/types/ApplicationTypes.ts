export enum ApplicationMetaDataFields {
  applicationIdentifier = "applicationIdentifier",
  title = "title",
  iconLocation = "iconLocation",
  exeLocation = "exeLocation",
  mimeTypes = "mimeTypes",
}

export type ApplicationMetaData = {
  applicationIdentifier: string;
  title: string;
  iconLocation: string;
  exeLocation: string;
  mimeTypes: Array<string>;
};

export type ApplicationMetaDataObject = {
  [key in ApplicationMetaDataFields]: any;
};
