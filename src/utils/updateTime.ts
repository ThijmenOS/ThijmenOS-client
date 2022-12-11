export default function UpdateTime(): string {
  const currentDate = new Date();
  const currentTime = currentDate.getHours() + ":" + currentDate.getMinutes();

  return currentDate.toDateString() + " " + currentTime;
}
