import ApplicationManager from "@core/applicationManager/applicationManager";

import Settings from "@core/settings/settings";
import CreateWindow from "@core/applicationWindow/createApplicationWindow";
import GenerateUUID from "@utils/generateUUID";

jest.mock("@core/settings/settings");
jest.mock("@core/applicationWindow/createApplicationWindow");

it("FindCorrespondingAppWithWindowHash throws app not found error", () => {
  const sut = new ApplicationManager(new Settings(), new CreateWindow());
  sut.openApps = [];

  expect(() =>
    sut.FindCorrespondingAppWithWindowHash(GenerateUUID())
  ).toThrowError("the app could not be found!");
});
