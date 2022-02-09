const {
  MeterProvider,
  ConsoleMetricExporter,
} = require("@opentelemetry/metrics");

const meter = new MeterProvider({
  exporter: new ConsoleMetricExporter(),
  interval: 1000,
}).getMeter("demo-meter");

const requestCount = meter.createCounter("requests", {
  description: "Count all incoming requests",
});
const upDownCounter = meter.createUpDownCounter('test_up_down_counter', {
    description: 'Example of a UpDownCounter'
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
