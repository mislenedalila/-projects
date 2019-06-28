"use strict";

const dialogFlow = require("dialogflow");
const structjson = require("./structjson");
const config = require("../config/keys");

const projectID = config.googleProjectID;

const credentials = {
  client_email: config.googleClientEmail,
  private_key: config.googlePrivateKey
};

const sessionClient = new dialogFlow.SessionsClient({
  projectID,
  credentials
});

const sessionPath = sessionClient.sessionPath(
  config.googleProjectID,
  config.dialogFlowSessionID
);

module.exports = {
  handleAction: function(responses) {
    return responses;
  },
  eventQuery: async function(event, parameters = {}) {
    let self = module.exports;
    const request = {
      session: sessionPath,
      queryInput: {
        event: {
          name: event,
          parameters: structjson.jsonToStructProto(parameters),
          languageCode: config.dialogFlowSessionLanguageCode
        }
      }
    };
    let responses = await sessionClient.detectIntent(request);
    responses = await self.handleAction(responses);
    return responses;
  }
};
