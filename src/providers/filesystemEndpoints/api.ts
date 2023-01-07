//TODO: Implement error handling

import { host } from "@thijmen-os/common";

interface ApiOptions {
  baseURL: string;
}
class Api {
  private readonly _baseURL: string;

  constructor(props: ApiOptions) {
    this._baseURL = props.baseURL;
  }

  public async get(url: string) {
    const response = await fetch(this._baseURL + url);

    return await response.json();
  }

  public async post(url: string, data: object) {
    const response = await fetch(this._baseURL + url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return response.json();
  }
}

const api = new Api({ baseURL: host });

export default api;
