/* tslint:disable */
/* eslint-disable */
/**
* @returns {number}
*/
export function get_image_ptr(): number;
/**
* @param {number} show_x
* @param {number} show_y
* @param {number} square_size
*/
export function generate_mandelbrot(show_x: number, show_y: number, square_size: number): void;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly get_image_ptr: () => number;
  readonly generate_mandelbrot: (a: number, b: number, c: number) => void;
}

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
