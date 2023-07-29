const pollingTime = 1000 * 60 * 5; // Every 5 minutes

export const poll = async (fn: () => Promise<any>) => {
    await fn();
    setTimeout(() => poll(fn), pollingTime);
}