import Exit from "@providers/error/systemErrors/Exit";

class NoResourceAccess extends Exit {
  constructor(resource: string) {
    super(
      5,
      "No_Access_To_Requested_Resource",
      `You have no access to the reqeusted resource: ${resource}`
    );
  }
}

export default NoResourceAccess;
