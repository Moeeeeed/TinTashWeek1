const { Observable } = require("rxjs");
const { EventEmitter } = require("events");

const temperature = new EventEmitter();
const pressure = new EventEmitter();
const humidity = new EventEmitter();

function createDashboardObservable(temperature, pressure, humidity) {
  return new Observable(subscriber => {
    const latest = { temperature: null, pressure: null, humidity: null };
    const lastUpdated = { temperature: 0, pressure: 0, humidity: 0 };
    let lastEmitTime = 0;
    let pendingEmit = null;

    function allReceivedOnce() {
      return latest.temperature !== null && latest.pressure !== null && latest.humidity !== null;
    }

    function buildDisplayObject() {
      const now = Date.now();
      return {
        temperature: now - lastUpdated.temperature > 1000 ? "N/A" : latest.temperature,
        pressure: now - lastUpdated.pressure > 1000 ? "N/A" : latest.pressure,
        humidity: now - lastUpdated.humidity > 1000 ? "N/A" : latest.humidity
      };
    }

    function emitDisplayObject() {
      if (!allReceivedOnce()) return;

      const now = Date.now();
      const elapsed = now - lastEmitTime;

      if (elapsed >= 100) {
        lastEmitTime = now;
        subscriber.next(buildDisplayObject());
      } else if (!pendingEmit) {
        pendingEmit = setTimeout(() => {
          pendingEmit = null;
          lastEmitTime = Date.now();
          subscriber.next(buildDisplayObject());
        }, 100 - elapsed);
      }
    }

    function onTemperature(data) {
      latest.temperature = data;
      lastUpdated.temperature = Date.now();
      emitDisplayObject();
    }

    function onPressure(data) {
      latest.pressure = data;
      lastUpdated.pressure = Date.now();
      emitDisplayObject();
    }

    function onHumidity(data) {
      latest.humidity = data;
      lastUpdated.humidity = Date.now();
      emitDisplayObject();
    }

    temperature.on("data", onTemperature);
    pressure.on("data", onPressure);
    humidity.on("data", onHumidity);

    return () => {
      temperature.off("data", onTemperature);
      pressure.off("data", onPressure);
      humidity.off("data", onHumidity);
      clearTimeout(pendingEmit);
    };
  });
}

const dashboard$ = createDashboardObservable(temperature, pressure, humidity);

const subscription = dashboard$.subscribe(display => console.log(display));

temperature.on("data", () => {});
pressure.on("data", () => {});
humidity.on("data", () => {});

function randomInterval(emitter, name) {
  setTimeout(() => {
    emitter.emit("data", (Math.random() * 100).toFixed(1));
    randomInterval(emitter, name);
  }, 100 + Math.random() * 1900);
}

randomInterval(temperature, "temperature");
randomInterval(pressure, "pressure");
randomInterval(humidity, "humidity");