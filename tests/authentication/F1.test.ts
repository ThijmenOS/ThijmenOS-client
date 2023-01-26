/* eslint-disable @typescript-eslint/ban-ts-comment */
import "reflect-metadata";
import Authentication from "@providers/authentication/authentication";
import {
  AuthenticationMethods,
  singinAction,
  UserClass,
} from "@providers/authentication/user";

import Memory from "@core/memory/memory";
jest.mock("@core/memory/memory");

describe("authentication", () => {
  const sut = new Authentication(new Memory());
  const defaultUser = new UserClass({
    userId: "1",
    username: "user-1",
    password: "Welkom01",
    pincode: "12345",
    email: "testUser@thijmenbrand.nl",
  });

  beforeEach(() => {
    jest
      .spyOn(sut, "CheckForsingleUserAccount")
      .mockImplementation(async () => defaultUser);
    jest.spyOn(sut, "UserValidated").mockImplementation();
    jest.spyOn(sut, "LookupUser").mockImplementation(() => defaultUser);
  });

  it("TC-1", () => {
    const testCredentials = new singinAction({
      authenticationInput: "Welkom01",
      username: "user-1",
      method: AuthenticationMethods.Password,
    });

    const result = sut.ValidateCredentials(defaultUser, testCredentials);
    expect(result).toBeTruthy();
  });

  it("TC-2", () => {
    const testCredentials = new singinAction({
      authenticationInput: "12345",
      username: "user-1",
      method: AuthenticationMethods.Pincode,
    });

    const result = sut.ValidateCredentials(defaultUser, testCredentials);
    expect(result).toBeTruthy();
  });

  it("TC-3", async () => {
    const testCredentials = new singinAction({
      authenticationInput: "Welkom01",
      method: AuthenticationMethods.Password,
    });

    const result = await sut.ValidateLogin(testCredentials);
    expect(result).toBeTruthy();
  });

  it("TC-4", async () => {
    const testCredentials = new singinAction({
      authenticationInput: "12345",
      method: AuthenticationMethods.Pincode,
    });

    const result = await sut.ValidateLogin(testCredentials);
    expect(result).toBeTruthy();
  });

  it("TC-5", async () => {
    //@ts-ignore
    const testCredentials = new singinAction({
      username: "user-1",
      method: AuthenticationMethods.Pincode,
    });

    const result = await sut.ValidateLogin(testCredentials);
    expect(result).toBeFalsy();
  });

  it("TC-6", async () => {
    const testCredentials = new singinAction({
      authenticationInput: "Welkom01",
      method: AuthenticationMethods.Pincode,
    });

    const result = await sut.ValidateLogin({
      //@ts-ignore
      username: null,
      ...testCredentials,
    });
    expect(result).toBeFalsy();
  });

  it("TC-7", async () => {
    const testCredentials = new singinAction({
      authenticationInput: "Welkom01",
      method: AuthenticationMethods.Pincode,
    });

    const result = await sut.ValidateLogin({
      //@ts-ignore
      username: undefined,
      ...testCredentials,
    });
    expect(result).toBeFalsy();
  });

  it("TC-8", async () => {
    const testCredentials = new singinAction({
      //@ts-ignore
      authenticationInput: null,
      method: AuthenticationMethods.Pincode,
    });

    const result = await sut.ValidateLogin(testCredentials);
    expect(result).toBeFalsy();
  });

  it("TC-9", async () => {
    const testCredentials = new singinAction({
      //@ts-ignore
      authenticationInput: undefined,
      method: AuthenticationMethods.Pincode,
    });

    const result = await sut.ValidateLogin(testCredentials);
    expect(result).toBeFalsy();
  });
});
