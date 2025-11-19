import * as wcp from 'webpack-config-prefabs'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default wcp.nodeLibrary({ filename: __filename }, {
  enableTypescript: true,
  entry: './src/fs/patch.ts',
  minimize: false,
  outputFilepath: './lib/fs/patch.bundle.js',
});
