require("dotenv").config({ path: __dirname + "/.env" });
const { MeterProvider } = require("@opentelemetry/sdk-metrics-base");
const {
  CollectorMetricExporter,
} = require("@opentelemetry/exporter-collector");

const collectorOptions = {
  url: `http://${process.env.COLLECTOR_ENDPOINT}:55681/v1/metrics`, // url is optional and can be omitted - default is http://localhost:55681/v1/metrics
  concurrencyLimit: 1, // an optional limit on pending requests
};

const exporter = new CollectorMetricExporter(collectorOptions);

const meter = new MeterProvider({
  exporter,
  interval: 1000,
}).getMeter("counter-meterics");

const counter = meter.createCounter("metric_name_test");
counter.add(15, { key: "value" });

const requestCount = meter.createCounter("requests_count", {
  description: "Count all incoming requests",
});

const boundInstruments = new Map();

module.exports.countAllRequests = () => {
  return (req, res, next) => {
    if (!boundInstruments.has(req.path)) {
      const labels = { route: req.path };
      const boundCounter = requestCount.bind(labels);
      boundInstruments.set(req.path, boundCounter);
    }

    boundInstruments.get(req.path).add(1);
    next();
  };
};
