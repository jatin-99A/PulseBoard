import Redis from "ioredis";
import env from "../../config/env.js";

function createRedisConnection() {
  // @ts-ignore
  return new Redis({
    host: env.REDIS_HOST,
    port: Number(env.REDIS_PORT),
    password: env.REDIS_PASSWORD,
  });
}

// Connections
const publisher = createRedisConnection();
const subscriber = createRedisConnection();
const cache = createRedisConnection();

// get / set
export const setValue = async (key: string, value: any, ttl?: number) => {
  if (ttl) {
    return await cache.set(key, JSON.stringify(value), "EX", ttl);
  }
  return await cache.set(key, JSON.stringify(value));
};

export const getValue = async (key: string) => {
  const data = await cache.get(key);
  return data ? JSON.parse(data) : null;
};

// publish / subscribe
export const publish = async (channel: string, message: any) => {
  return await publisher.publish(channel, JSON.stringify(message));
};

export const subscribe = (channel: string, callback: (msg: any) => void) => {
  subscriber.subscribe(channel);
  // @ts-ignore
  subscriber.on("message", (ch, message) => {
    if (ch === channel) {
      callback(JSON.parse(message));
    }
  });
};

export { publisher, subscriber, cache };