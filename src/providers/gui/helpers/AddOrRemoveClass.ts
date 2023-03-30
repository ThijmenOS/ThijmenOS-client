import { ClassOperation } from "@thijmen-os/common";

export function AddOrRemoveClass(
  targetElement: Array<HTMLElement>,
  classes: Array<string>,
  operation: ClassOperation
): void {
  if (Array.isArray(targetElement)) {
    targetElement.forEach((el) =>
      operation === ClassOperation.ADD
        ? el.classList.add(...classes)
        : el.classList.remove(...classes)
    );
    return;
  }
}
