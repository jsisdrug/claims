import Axios from "axios";
import { URL } from "../constant";
import mockSendFilePath from "../fixtures/mockSendFilePath.json";
import mockRuleBased from "../fixtures/mockRuleBased.json";
import mockCaseInfo from "../fixtures/mockCaseInfo.json";

const AxiosInstance = Axios.create();

const BASE_PATH = window.config.basePath;
const shouldMockResponse = window.location.href.indexOf("mock") !== -1;

/**
 * Used to start the server, the client should display splash page until then.
 * @returns Promise<void>
 */
export const getAppStatus = () => {
  const url = BASE_PATH + URL.startApp;
  return shouldMockResponse ? mockRespond() : AxiosInstance.get(url);
};

/**
 * @returns Promise<gridInfo> returns the list of case ids.
 */
export const sendFilePath = (filepath) => {
  const url = BASE_PATH + URL.sendFilePath;
  const request = { UserInput: filepath };
  return shouldMockResponse
    ? mockRespond("sendFilePath")
    : AxiosInstance.post(url, request);
};

/**
 * @returns Promise<RuleBasedCaseList> Returns rule based case list.
 */
export const getRuleBasedCases = () => {
  const url = BASE_PATH + URL.getRuleBased;
  return shouldMockResponse
    ? mockRespond("getRuleBased")
    : AxiosInstance.get(url);
};

/**
 * @param {string} id case identifier
 * @returns Promise<caseInfo> Details of the case
 */
export const getCaseInfo = (ids) => {
  const url = BASE_PATH + URL.getCaseInfo;
  const request = { UserInput: ids };
  return shouldMockResponse
    ? mockRespond("getCaseInfo")
    : AxiosInstance.post(url, request);
};

/**
 * @param {Array<object>} payload identifier along with status and comment of each case
 * @returns Promise<null>
 */
export const sendCaseResult = (payload) => {
  const url = BASE_PATH + URL.sendCaseResult;
  const request = { UserInput: payload };
  return shouldMockResponse
    ? mockRespond("sendCaseResult")
    : AxiosInstance.post(url, request);
};

/**
 * @param {Array<object>} payload identifier along with status and comment of each case
 * @returns Promise<null>
 */
export const patchCaseInfo = (payload) => {
  const url = BASE_PATH + URL.patchCaseInfo;
  const request = { UserInput: payload };
  return shouldMockResponse
    ? mockRespond("patchCaseInfo")
    : AxiosInstance.post(url, request);
};

/**
 * Used to mock the response with promises
 * @param {string} api
 * @returns {Promise}
 */
function mockRespond(api) {
  switch (api) {
    case "sendFilePath":
      return delayResp(mockSendFilePath);
    case "getRuleBased":
      return delayResp(mockRuleBased);
    case "getCaseInfo":
      return delayResp(mockCaseInfo);
    default:
      return delayResp();
  }
}

/**
 * Used to simulate response delay
 * @param {any} resp
 * @returns {Promise}
 */
function delayResp(resp) {
  const randomNumber = Math.floor(Math.random() * 1000);
  return new Promise((resolve) =>
    window.setTimeout(() => resolve(resp), randomNumber)
  );
}
