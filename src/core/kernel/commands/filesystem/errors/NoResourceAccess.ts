import Exit from "@providers/error/systemErrors/Exit";

class NoResourceAccess extends Exit {
  constructor() {
    super(5, "No_Access_To_Requested_Resource");
  }
}

export default NoResourceAccess;
