import interact from "interactjs";

export function InitMovement(dataId: string | number): void {
  const element: HTMLElement | null = document.querySelector(
    `[data-id="${dataId}"]`
  );

  if (!element) return;

  interact(element).draggable({
    enabled: true,
    inertia: false,
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: "parent",
      }),
    ],
    onmove: (event) => {
      const target = event.target;
      const dataX = target.getAttribute("data-x");
      const dataY = target.getAttribute("data-y");

      const initialX = parseFloat(dataX) || 0;
      const initialY = parseFloat(dataY) || 0;

      const deltaX = event.dx;
      const deltaY = event.dy;

      const newX = initialX + deltaX;
      const newY = initialY + deltaY;

      target.style.transform = `translate(${newX}px, ${newY}px)`;

      target.setAttribute("data-x", newX);
      target.setAttribute("data-y", newY);
    },
  });
}
