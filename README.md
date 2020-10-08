# Nimbus Validator App

A web app that allows CSAI club members to review and quality control phrase data that Nimbus, the club's AI chatbot, uses to answer questions.

**[Check out the live site](https://reverent-davinci-cfec49.netlify.app)**

## About This App

This app exists to clean data crowd sourced by the [CSAI Recorder](https://www.csai.app/) (check it out [on Github](https://github.com/calpoly-csai/csai-recorder)). Once cleaned, the data is made available to the live Nimbus model (interact with Nimbus at [Nimbus Chat](https://nimbus.calpolycsai.com/)). Specifically, `QuestionAnswerPairs` are fetched from the club's SQL database via the [Nimbus API](https://github.com/calpoly-csai/api), edited by the user, and the revisions are sent back to the database.<br />
**Note:** You must create an account to validate data. Reach out to anyone on the CSAI team for the entry code to create an account. This ensures that only club members are allowed to validate data.

![demo gif](https://media.giphy.com/media/6Zc3pEySruneZ6XY4I/giphy.gif)

## Develop Locally

1. In your terminal, clone the repo and navigate to it:

   ```
   git clone https://github.com/calpoly-csai/nimbus-validator-app.git
   cd nimbus-validator-app
   ```

2. With the latest version of [Node.js](https://nodejs.org/en/) installed, download the dependencies with:

   ```
   npm install
   ```

3. In the project directory, you can run the app with:

   a. **Development Mode**

   ```
   npm start
   ```

   View the app in your browser at whichever port is displayed in your terminal window (typically [http://localhost:3000](http://localhost:3000)).<br />
   Development mode will attempt to hit the Nimbus API at [http://0.0.0.0:8080/](http://0.0.0.0:8080/). This will alter a dummy database called `testing`, not the data fed to the Nimbus model.<br />
   In order to set up a development server for the API, head over to the [Nimbus API repo](https://github.com/calpoly-csai/api) and follow the README setup instructions.

   b. **Production Mode** (use caution)

   ```
   npm run-script start:prod
   ```

   **Imporant!** Only run this command if you know what you're doing! This will allow the user to edit the database fed to the live Nimbus model. Erronous validations could compromise the club's chatbot.<br />
   View the app in your browser just like development mode ([http://localhost:3000](http://localhost:3000)).<br />
   Production mode attempts to hit the real Nimbus API at https://nimbus.api.calpolycsai.com/.<br />

<br />
Thanks for your interest, happy hacking!
