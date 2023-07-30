const defaultPollingTime = 1000 * 20; // Every 20 seconds

export const poll = async (
    fn: () => Promise<any>,
    pollingTime: number = defaultPollingTime
) => {
    await fn();
    setTimeout(() => poll(fn, pollingTime), pollingTime);
}