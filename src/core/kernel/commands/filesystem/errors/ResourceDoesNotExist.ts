import Exit from "@providers/error/systemErrors/Exit";

class ResourceDoesNotExist extends Exit {
  constructor() {
    super(6, "Resource_Does_Not_Exist");
  }
}

export default ResourceDoesNotExist;
