const dev = {
  serverURL: "http://0.0.0.0:8080",
};

const prod = {
  serverURL: "https://nimbus.api.calpolycsai.com",
};

const config = process.env.REACT_APP_STAGE === "prod" ? prod : dev;

export default {
  ...config,
};
