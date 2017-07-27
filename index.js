require('dotenv').config()
const Express = require("express");
const WebClient = require("@slack/client").WebClient;
const BodyParser = require("body-parser");

// Don't forget to fill the .env file with the real Slack API token
const token = process.env.SLACK_API_TOKEN;

const app = Express();
app.use(BodyParser.urlencoded({
  extended: true
}));

// Use the official Slack node SDK
const slackClient = new WebClient(token);

app.get("/", function(request, response) {
  if (!token) {
    response.send("API token is not set in the .env file");
    return;
  }

  response.sendFile(__dirname + "/html/index.html");
});

// Hook to receive form submission
app.post("/send", function(request, response) {
  slackClient.chat.postMessage("#general", request.body.message, function(err, res){
    if (err) {
      console.log("Error:", err);
      response.send("Failed to send message");
    } else {
      console.log("Message sent:", res);
      response.send("Successfully sent message");
    }
  });
});

app.listen(3000, function() {
  console.log("App listening on port 3000!");
});
