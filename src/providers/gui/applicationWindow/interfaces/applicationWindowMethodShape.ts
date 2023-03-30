export default interface ApplicationWindowMethodShape {
  InitBehaviour(): void;
  Freese(): void;
  Destroy(): void;
  Unfreese(): void;
  Render(content: string): void;
}