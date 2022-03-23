const logEntries: any[] = [];

let timeout: number;
let enabled = false;

export function enableLog() {
  enabled = true;
}

export function log(
  obj: { toString: () => string },
  event: string,
  ...args: any[]
) {
  if (!enabled) {
    return;
  }
  clearTimeout(timeout);
  logEntries.push([obj.toString(), event, ...args]);
  timeout = setTimeout(() => dump(), 1000) as unknown as number;
}

export function dump() {
  if (!enabled) {
    return;
  }
  console.table(logEntries);
  logEntries.length = 0;
}
