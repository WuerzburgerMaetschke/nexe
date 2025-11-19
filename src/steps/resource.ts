import { each } from '../util.js'
import { globby } from 'globby'
import { resolve } from 'path'
import { NexeCompiler } from '../compiler.js'

export default async function resource(compiler: NexeCompiler, next: () => Promise<any>) {
  const { cwd, resources } = compiler.options
  if (!resources.length) {
    return next()
  }
  const step = compiler.log.step('Bundling Resources...')
  let count = 0

  // workaround for https://github.com/sindresorhus/globby/issues/127
  // and https://github.com/mrmlnc/fast-glob#pattern-syntax
  const resourcesWithForwardSlashes = resources.map((r) => r.replace(/\\/g, '/'))

  await each(globby(resourcesWithForwardSlashes, { cwd, onlyFiles: true }), async (file: string) => {
    count++
    step.log(`Including file: ${file}`)
    await compiler.addResource(resolve(cwd, file))
  })
  step.log(`Included ${count} file(s)`)
  return next()
}
