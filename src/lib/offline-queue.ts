export function getOfflineQueueCount(): Promise<number> {
  return new Promise((resolve) => {
    if (!("serviceWorker" in navigator) || !navigator.serviceWorker.controller) {
      resolve(0);
      return;
    }
    const channel = new MessageChannel();
    channel.port1.onmessage = (event) => {
      if (event.data?.type === "QUEUE_UPDATED") {
        resolve(event.data.count ?? 0);
      }
    };
    navigator.serviceWorker.controller.postMessage({ action: "GET_QUEUE_COUNT" }, [channel.port2]);
    setTimeout(() => resolve(0), 3000);
  });
}

export function retryOfflineQueue(): Promise<{ replayed: number; failed: number }> {
  return new Promise((resolve) => {
    if (!("serviceWorker" in navigator) || !navigator.serviceWorker.controller) {
      resolve({ replayed: 0, failed: 0 });
      return;
    }
    const channel = new MessageChannel();
    channel.port1.onmessage = (event) => {
      if (event.data?.type === "QUEUE_REPLAYED") {
        resolve({ replayed: event.data.replayed ?? 0, failed: event.data.failed ?? 0 });
      }
    };
    navigator.serviceWorker.controller.postMessage({ action: "RETRY_QUEUE" }, [channel.port2]);
    setTimeout(() => resolve({ replayed: 0, failed: 0 }), 3000);
  });
}
