type ParamsObject = {
  [key: string]: string;
};

interface JsOsCommunicationMessage {
  origin: string;
  method: string;
  params: ParamsObject | string;
}
