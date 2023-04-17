import Exit from "@providers/error/systemErrors/Exit";

class ResourceDoesNotExist extends Exit {
  constructor(resource: string) {
    super(
      6,
      "Resource_Does_Not_Exist",
      `the requested resource: ${resource}. does not exist`
    );
  }
}

export default ResourceDoesNotExist;
