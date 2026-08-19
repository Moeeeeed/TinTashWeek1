function fetchUrlsCallback(urls, callback) {
  const results = [];
  let index = 0;

  function next() {
    if (index === urls.length) {
      callback(results);
      return;
    }
    const url = urls[index];
    fetch(url)
      .then(res => res.text())
      .then(data => {
        results.push({ url, data });
        index++;
        next();
      })
      .catch(err => {
        results.push({ url, error: err.message });
        index++;
        next();
      });
  }

  next();
}

function fetchUrlsPromiseSerial(urls) {
  const results = [];

  return urls
    .reduce((chain, url) => {
      return chain.then(() => {
        return fetch(url)
          .then(res => res.text())
          .then(data => results.push({ url, data }))
          .catch(err => results.push({ url, error: err.message }));
      });
    }, Promise.resolve())
    .then(() => results);
}

function fetchUrlsParallel(urls) {
  const promises = urls.map(url =>
    fetch(url)
      .then(res => res.text())
      .then(data => ({ url, data }))
      .catch(err => ({ url, error: err.message }))
  );

  return Promise.all(promises);
}

async function fetchUrlsAsyncAwait(urls) {
  const results = [];

  for (const url of urls) {
    try {
      const res = await fetch(url);
      const data = await res.text();
      results.push({ url, data });
    } catch (err) {
      results.push({ url, error: err.message });
    }
  }

  return results;
}

async function fetchUrlsAsyncAwaitParallel(urls) {
  const promises = urls.map(async url => {
    try {
      const res = await fetch(url);
      const data = await res.text();
      return { url, data };
    } catch (err) {
      return { url, error: err.message };
    }
  });

  return Promise.all(promises);
}

async function comparePerformance(urls) {
  let start = Date.now();
  await fetchUrlsPromiseSerial(urls);
  console.log("Serial:", Date.now() - start, "ms");

  start = Date.now();
  await fetchUrlsParallel(urls);
  console.log("Parallel:", Date.now() - start, "ms");
}

const urls = ["https://example.com", "https://wikipedia.org", "https://github.com"];
comparePerformance(urls);