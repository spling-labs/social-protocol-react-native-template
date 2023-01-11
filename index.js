/**
 * @format
 */
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import { Buffer } from "buffer";
global.Buffer = Buffer;
const process = require("process");
global.process = process;
import "fast-text-encoding";

AppRegistry.registerComponent(appName, () => App);
