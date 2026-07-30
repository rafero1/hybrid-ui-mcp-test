export const TaskProgress = {
  NotStarted: 0,
  Started: 1,
  Done: 2,
  Cancelled: 3,
  Error: 4,
} as const;

export type TaskProgress = (typeof TaskProgress)[keyof typeof TaskProgress];
