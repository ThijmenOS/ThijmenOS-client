enum MimeTypes {
  txt,
}

export enum Properties {
  title = "title",
  iconLocation = "iconLocation",
  exeLocation = "exeLocation",
  mimeTypes = "mimeTypes",
}

export interface Props {
  title: string;
  iconLocation: string;
  exeLocation: string;
  mimeTypes: Array<string>;
}

export type PropertiesObject = { [key in Properties]: any };
