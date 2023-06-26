/**
 * JSONP parameter declaration.
 */
interface IJsonpParam {
  /**
   * Callback query name.
   * This param is used to define the query name of the callback function.
   *
   * @example
   * // The request url will be "/some-url?myCallback=jsonp_func&myCustomUrlParam=veryNice"
   * jsonp('/some-url', {
   *   callbackQuery: 'myCallback',
   *   callbackName: 'jsonp_func',
   *   myCustomUrlParam: 'veryNice'
   * })
   *
   * @default callback
   */
  callbackQuery?: string;

  /**
   * Callback function name.
   * This param is used to define the jsonp function name.
   *
   * @example
   * // The request url will be "/some-url?myCallback=jsonp_func&myCustomUrlParam=veryNice"
   * jsonp('/some-url', {
   *   callbackQuery: 'myCallback',
   *   callbackName: 'jsonp_func',
   *   myCustomUrlParam: 'veryNice'
   * })
   *
   * @default jsonp_ + randomStr()
   */
  callbackName?: string;

  /**
   * Custom data.
   */
  [key: string]: any;
}

/**
 *  Jsonp api
 */

import { flatten, formatParams, randomStr } from "./util";

const DEFAULT_TIMEOUT: number = 5000;

/**
 * JSONP function.
 *
 * @param { string } url Target URL address.
 * @param { IJsonpParam } param Querying params object.
 * @param { number } _timeout Timeout setting (ms).
 *
 * @example
 * jsonp('/url', {
 *   callbackQuery: ''
 *   callbackName: '',
 *   name: 'LancerComet',
 *   age: 26
 * }, 10000)
 */
export function jsonp<T = any>(
  url: string,
  param: IJsonpParam = {},
  _timeout?: number
): Promise<T> {
  if (typeof url !== "string") {
    throw new Error('[jsonp] Type of param "url" is not string.');
  }

  if (typeof param !== "object" || !param) {
    throw new Error("[jsonp] Invalid params, should be an object.");
  }

  let timeout = typeof _timeout === "number" ? _timeout : DEFAULT_TIMEOUT;

  return new Promise<T>((resolve, reject) => {
    const callbackQuery =
      typeof param.callbackQuery === "string"
        ? param.callbackQuery
        : "callback";

    const callbackName =
      typeof param.callbackName === "string"
        ? param.callbackName
        : "jsonp_" + randomStr();

    param[callbackQuery] = callbackName;

    // Remove callbackQuery and callbackName.
    delete param.callbackQuery;
    delete param.callbackName;

    // Convert params to querying str.
    let queryStrs: string[][] = [];
    Object.keys(param).forEach((queryKey) => {
      queryStrs = queryStrs.concat(formatParams(queryKey, param[queryKey]));
    });

    const queryStr = flatten(queryStrs).join("&");

    const onError = () => {
      removeErrorListener();
      clearTimeout(timeoutTimer);
      reject({
        status: 400,
        statusText: "Bad Request",
      });
    };

    const removeErrorListener = () => {
      paddingScript.removeEventListener("error", onError);
    };

    const removeScript = () => {
      document.body.removeChild(paddingScript);
      delete (window as any)[callbackName];
    };

    // Timeout timer.
    let timeoutTimer: number;

    // Setup timeout.
    if (timeout > -1) {
      timeoutTimer = setTimeout(() => {
        removeErrorListener();
        removeScript();
        reject({
          statusText: "Request Timeout",
          status: 408,
        });
      }, timeout);
    }

    // Create global function.
    (window as any)[callbackName] = (json: T) => {
      clearTimeout(timeoutTimer);
      removeErrorListener();
      removeScript();
      resolve(json);
    };

    // Create script element.
    const paddingScript = document.createElement("script");

    // Add error listener.
    paddingScript.addEventListener("error", onError);

    // Append to head element.
    paddingScript.src = url + (/\?/.test(url) ? "&" : "?") + queryStr;
    document.body.appendChild(paddingScript);
  });
}
