import "jqueryui";

export function InitMovement(
  dataId: string,
  options?: JQueryUI.DraggableOptions
): void {
  jQuery(`[data-id="${dataId}"]`).draggable({
    containment: "parent",
    ...options,
  });
}
