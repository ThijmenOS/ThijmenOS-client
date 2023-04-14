/* <Class Documentation>

  <Class Description>
    This utility class handles everything that has something to do with rendering to the DOM. 

  <Method Descriptions>
    CreateElementFromString(): This method takes a string and converts it to an html element to be displayed or to add attributes to
    GetElementByClass(): This method takes a class selector and returns the element that has that class. It also returns it as the desired html element type
    AddElement(): This method adds an element to a desired html dom element
    AddOrRemoveClass(): This method can add or remove any number of classes from elements
    WaitForElem(): This method returns a promis that waits for an element to exist on the DOM.
      |_ this is used by the SendMessageToApp() method to make sure the application is registered on the DOM
    InitMovement(): This method makes a element draggable.

*/

import { AddElement } from "./AddElement";
import { AddOrRemoveClass } from "./AddOrRemoveClass";
import { ClearElement } from "./ClearElement";
import { CreateElementFromString } from "./CreateElementFromString";
import { GetElementByClass } from "./GetElementByClass";
import { InitMovement } from "./InitMovement";
import { WaitForElm } from "./WaitForElement";
import { mainAppContainer } from "./graphics";

export {
  AddElement,
  AddOrRemoveClass,
  ClearElement,
  CreateElementFromString,
  GetElementByClass,
  InitMovement,
  mainAppContainer,
  WaitForElm,
};
