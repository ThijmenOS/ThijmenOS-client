interface DesktopMethods {
  LoadDesktop(): Promise<void>;
  RefreshDesktop(): Promise<void>;
  SetBackground(path: string): void;
}

export default DesktopMethods;
