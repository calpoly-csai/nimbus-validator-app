import axios from "axios";
import config from "./config";

axios.defaults.baseURL = config.serverURL; // the prefix of the URL
