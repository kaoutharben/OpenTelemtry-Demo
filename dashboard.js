const { NodeTracerProvider } = require("@opentelemetry/node");
const { SimpleSpanProcessor } = require("@opentelemetry/tracing");
const { ZipkinExporter } = require("@opentelemetry/exporter-zipkin");
const zipkinExporter = new ZipkinExporter({
  url: "http://localhost:9411/api/v2/spans",
  serviceName: "dashboard-service",
});
//Instantiate a trace provider
const provider = new NodeTracerProvider();
//Instantiate an exporter
const zipkinProcessor = new SimpleSpanProcessor(zipkinExporter);
//exporting traces in the console

// Configure span processor to send spans to the exporter
provider.addSpanProcessor(zipkinProcessor);

provider.register();

const express = require("express");
const app = express();
const port = 3001;

const getUrlContents = (url, fetch) => {
  return new Promise((resolve, reject) => {
    fetch(url, resolve, reject)
      .then((res) => res.text())
      .then((body) => resolve(body));
  });
};

app.get("/dashboard", async (req, res) => {
  //fetch data running from second service
  const movies = await getUrlContents(
    "http://localhost:3000/movies",
    require("node-fetch")
  );
  res.type("json");
  res.send(JSON.stringify({ dashboard: movies }));
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
