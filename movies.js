// const { NodeTracerProvider } = require('@opentelemetry/node');
// const { ConsoleSpanExporter, SimpleSpanProcessor } = require('@opentelemetry/tracing');
// //Instantiate a trace provider
// const provider = new NodeTracerProvider();
// //Instantiate an exporter
// const consoleExporter = new ConsoleSpanExporter();
// //exporting traces in the console
// const spanProcessor = new SimpleSpanProcessor(consoleExporter);
// // Configure span processor to send spans to the exporter
// provider.addSpanProcessor(spanProcessor);

// provider.register()
const { NodeTracerProvider } = require("@opentelemetry/node");
const { SimpleSpanProcessor } = require("@opentelemetry/tracing");
const { ZipkinExporter } = require("@opentelemetry/exporter-zipkin");
const zipkinExporter = new ZipkinExporter({
  url: "http://localhost:9411/api/v2/spans",
  serviceName: "movies-service",
});
//Instantiate a trace provider
const provider = new NodeTracerProvider();
//Instantiate an exporter
const zipkinProcessor = new SimpleSpanProcessor(zipkinExporter);
//exporting traces in the console

// Configure span processor to send spans to the exporter
provider.addSpanProcessor(zipkinProcessor);

provider.register();


const express = require('express')
const { countAllRequests } = require("./monitoring");
const app = express()
const port = 3000

app.use(countAllRequests());

app.get('/movies', async function (req, res) {
  res.type('json')
  var delay = Math.floor( ( Math.random() * 2000 ) + 100);

  setTimeout((() => {
    res.send(({movies: [
      { name: 'Jaws', genre: 'Thriller'}, 
      { name: 'Annie', genre: 'Family'},
      { name: 'Jurassic Park', genre: 'Action'},
    ]}))
  }), delay)

})

app.listen( port, () => { console.log(`Listening at http://localhost:${port}`)})