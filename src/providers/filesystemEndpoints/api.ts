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

  public async Get<T = unknown>(
    url: string
  ): Promise<{ data: T; status: number }> {
    const response = await fetch(this._baseURL + url);

    return await response.json();
  }

  public async Post(url: string, data: object) {
    const response = await fetch(this._baseURL + url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return response.json();
  }

  public async Delete(url: string, data?: object) {
    const response = await fetch(this._baseURL + url, {
      method: "DELETE",
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
