export default interface ApplicationWindowMethodShape {
  Destroy(): void;
  InitBehaviour(): void;
  Freese(): void;
  Unfreese(): void;
  Render(content: string): void;
}
