/**
 * Previously simulated an artificial loading delay to show skeletons.
 * Disabled — data is local and instantly available, so the fake delay
 * was just slowing perceived performance. Always returns false now.
 *
 * Kept as a no-op so existing call sites compile without changes.
 */
export function useFakeLoading(_durationMs = 0) {
  return false;
}
