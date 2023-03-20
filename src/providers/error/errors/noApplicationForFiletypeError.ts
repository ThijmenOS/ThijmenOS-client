import NoAppForFiletype from "@providers/dialog/noAppForFiletype";

class NoAppForFiletypeError extends Error {
  constructor(message: string) {
    super(message);

    this.name = "NoAppForFiletypeError";

    new NoAppForFiletype();
  }
}

export default NoAppForFiletypeError;
