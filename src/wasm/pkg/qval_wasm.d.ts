/* tslint:disable */
/* eslint-disable */
/**
* @param {string} secrete
* @param {string} section
* @param {string} key
* @returns {Promise<any>}
*/
export function gen_hash(secrete: string, section: string, key: string): Promise<any>;
/**
*/
export class Hash {
  free(): void;
/**
* @param {string | undefined} [hash]
* @param {string | undefined} [error]
* @returns {Hash}
*/
  static new(hash?: string, error?: string): Hash;
/**
* @returns {string | undefined}
*/
  hash(): string | undefined;
/**
* @returns {string | undefined}
*/
  error(): string | undefined;
}
