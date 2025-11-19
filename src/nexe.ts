import { EOL } from 'os'
import { compose } from 'app-builder'
import { NexeCompiler, NexeError } from './compiler.js'
import { normalizeOptions, NexeOptions, NexePatch } from './options.js'
import resource from './steps/resource.js'
import clean from './steps/clean.js'
import cli from './steps/cli.js'
import bundle from './steps/bundle.js'
import download from './steps/download.js'
import shim from './steps/shim.js'
import artifacts from './steps/artifacts.js'
import patches from './patches/index.js'

async function compile(
  compilerOptions?: Partial<NexeOptions>,
  callback?: (err: Error | null) => void
) {
  let error: Error | null = null,
    options: NexeOptions | null = null,
    compiler: NexeCompiler | null = null

  try {
    options = normalizeOptions(compilerOptions)
    compiler = new NexeCompiler(options)
    await compose(
      clean,
      resource,
      cli,
      bundle,
      shim,
      download,
      options.build ? [artifacts, ...patches, ...(options.patches as NexePatch[])] : [],
      options.plugins as NexePatch[]
    )(compiler)
  } catch (e: any) {
    error = e
  }

  if (error) {
    compiler && compiler.quit(error)
    if (callback) return callback(error)
    return Promise.reject(error)
  }

  if (callback) callback(null)
}

export { compile, NexeCompiler }
export { argv, version, NexeOptions, help } from './options.js'
export { NexeTarget, getTarget } from './target.js'
