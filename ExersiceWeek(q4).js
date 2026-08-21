function createMemoizedFetch() {
  const cache = new Map();

  return async function memoizedFetch(url) {
    // Reuse the original promise when this URL has already been requested.
    if (cache.has(url)) {
      return cache.get(url);
    }

    // Cache the promise immediately so simultaneous calls share one request.
    const promise = fetch(url)
    .then(response => response.text());
    cache.set(url, promise);
    return promise;
  };
}

const memoizedFetch = createMemoizedFetch();

async function main() {
  const first = await memoizedFetch("https://example.com");
  const second = await memoizedFetch("https://example.com");
  console.log(first === second);
}

main();
