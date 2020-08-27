// this module exists to avoid dynamic imports of commonjs modules

import stringToStream from 'string-to-stream'

export { Readable } from 'readable-stream'
export const toStream = stringToStream
