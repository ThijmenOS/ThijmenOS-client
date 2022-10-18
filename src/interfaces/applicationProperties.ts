enum MimeTypes {
  txt,
}

export enum Properties {
  title = "title",
  iconLocation = "iconLocation",
  exeLocation = "exeLocation",
  mimeTypes = "mimeTypes",
}

export type PropertiesObject = { [key in Properties]: any };
