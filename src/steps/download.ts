import fetch from 'node-fetch'
import * as tar from 'tar'
import { createWriteStream } from 'fs'
import { pipeline } from 'stream'
import { promisify } from 'util'
import { pathExistsAsync } from '../util'
import { LogStep } from '../logger'
import { NexeCompiler, NexeError } from '../compiler'
import { dirname, join } from 'path'

const pipelineAsync = promisify(pipeline)

async function fetchNodeSourceAsync(dest: string, url: string, step: LogStep, options = {}) {
  const setText = (p: number) => step.modify(`Downloading Node: ${p.toFixed()}%...`)

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to download: ${response.statusText}`)
  }

  const total = parseInt(response.headers.get('content-length') || '0', 10)
  let current = 0

  // Create a transform stream to track progress
  const { Transform } = require('stream')
  const progressStream = new Transform({
    transform(chunk: any, encoding: any, callback: any) {
      current += chunk.length
      if (total > 0) {
        setText((current / total) * 100)
      }
      callback(null, chunk)
    },
  })

  step.log('Extracting Node...')

  // Extract tar.gz directly from the stream
  await pipelineAsync(
    response.body,
    progressStream,
    tar.extract({
      cwd: dest,
      strip: 1,
    })
  )

  step.log(`Node source extracted to: ${dest}`)
}

async function fetchPrebuiltBinary(compiler: NexeCompiler, step: any) {
  const { target, remoteAsset } = compiler,
    filename = compiler.getNodeExecutableLocation(target)

  try {
    const response = await fetch(remoteAsset)

    if (!response.ok) {
      if (response.status === 404) {
        throw new NexeError(`${remoteAsset} is not available, create it using the --build flag`)
      }
      throw new Error(`Failed to download: ${response.statusText}`)
    }

    const total = parseInt(response.headers.get('content-length') || '0', 10)
    let current = 0

    // Create a transform stream to track progress
    const { Transform } = require('stream')
    const progressStream = new Transform({
      transform(chunk: any, encoding: any, callback: any) {
        current += chunk.length
        if (total > 0) {
          step!.modify(`Downloading...${((current / total) * 100).toFixed()}%`)
        }
        callback(null, chunk)
      },
    })

    const fileStream = createWriteStream(filename)
    await pipelineAsync(response.body, progressStream, fileStream)
  } catch (e: any) {
    if (e instanceof NexeError) {
      throw e
    }
    throw new NexeError('Error downloading prebuilt binary: ' + e)
  }
}

/**
 * Downloads the node source to the configured temporary directory
 * @param {*} compiler
 * @param {*} next
 */
export default async function downloadNode(compiler: NexeCompiler, next: () => Promise<void>) {
  const { src, log, target } = compiler,
    { version } = target,
    { sourceUrl, downloadOptions, build } = compiler.options,
    url = sourceUrl || `https://nodejs.org/dist/v${version}/node-v${version}.tar.gz`,
    step = log.step(
      `Downloading ${build ? '' : 'pre-built '}Node.js${build ? ` source from: ${url}` : ''}`
    ),
    exeLocation = compiler.getNodeExecutableLocation(build ? undefined : target),
    downloadExists = await pathExistsAsync(build ? src : exeLocation)

  if (downloadExists) {
    step.log('Already downloaded...')
    return next()
  }

  if (build) {
    await fetchNodeSourceAsync(src, url, step, downloadOptions)
  } else {
    await fetchPrebuiltBinary(compiler, step)
  }

  return next()
}
