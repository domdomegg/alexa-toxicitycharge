# Alexa London Toxicity Charge Checker
Ask Alexa to check if you need to pay TfL's latest Emissions Surcharge. Built using node.js and the [Transport for London Unified API](https://api.tfl.gov.uk/swagger/ui/index.html?url=/swagger/docs/v1#!/Vehicle/Vehicle_GetVehicle).

## Usage
You can try it out from the [Alexa skills store](https://www.amazon.co.uk/dp/B074ZTFLS9/?tag=ajonestk-21).

If you want to build it yourself:
1. Create AWS lambda function with an Alexa skills kit trigger. You may need to sort out [IAM permissions](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/developing-an-alexa-skill-as-a-lambda-function#define-new-role).
2. Zip `index.js`, `node_modules` and `package.json` and upload it as the code.
3. Create custom Alexa skill. In the configuration tab, set your lambda function's arn.

I'd like to request you don't just upload this as your own skill. It's supposed to be for educational purposes so you can build your own node lambda functions for Alexa with different API driven content.
