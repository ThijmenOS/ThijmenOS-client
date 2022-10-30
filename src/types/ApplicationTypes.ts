export enum ApplicationMetaDataFields {
  title = "title",
  iconLocation = "iconLocation",
  exeLocation = "exeLocation",
  mimeTypes = "mimeTypes",
}

export type ApplicationMetaData = {
  title: string;
  iconLocation: string;
  exeLocation: string;
  mimeTypes: Array<string>;
};

export type ApplicationMetaDataObject = {
  [key in ApplicationMetaDataFields]: any;
};
