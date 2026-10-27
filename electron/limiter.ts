// 同時に発行するファイル操作の上限（大きなフォルダでもメインプロセスを止めず、ハンドルも使い切らない）
export function createLimiter(max: number) {
  let active = 0;
  const waiting: (() => void)[] = [];
  return async function run<T>(fn: () => Promise<T>): Promise<T> {
    if (active >= max) await new Promise<void>((resolve) => waiting.push(resolve));
    else active++;
    try {
      return await fn();
    } finally {
      const next = waiting.shift();
      if (next) next(); // 枠を待機中の処理へ引き渡す
      else active--;
    }
  };
}
export type Limiter = ReturnType<typeof createLimiter>;
