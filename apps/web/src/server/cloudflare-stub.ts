export const env =
  typeof globalThis !== "undefined" && (globalThis as any).__CF_ENV__
    ? (globalThis as any).__CF_ENV__
    : process.env;

export function waitUntil(promise: Promise<unknown>): void {
  promise.catch?.((err) => console.error("waitUntil error:", err));
}

export class WorkerEntrypoint {}
export class DurableObject {}
export class WorkflowEntrypoint {}

export default { env, waitUntil, WorkerEntrypoint, DurableObject, WorkflowEntrypoint };
