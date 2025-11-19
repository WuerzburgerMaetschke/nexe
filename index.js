#!/usr/bin/env node
import { argv, help, version } from './lib/options.js'
import { EOL } from 'os'
import { compile } from './lib/nexe.js'
import { NexeError } from './lib/compiler.js'
import chalk from 'chalk'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const isMainModule = process.argv[1] === __filename

if (isMainModule) {
  //fast path for help/version
  const showHelp = argv.help || argv._.some(x => x === 'help')
  const showVersion = argv.version || argv._.some(x => x === 'version')
  if (showHelp || showVersion) {    
    process.stderr.write(showHelp ? help : version + EOL)
  } else {
    compile(argv).catch((error) => {
      const isSilent = Boolean(argv.silent === true || argv.loglevel === 'silent')
      if (!isSilent) {
        if (error instanceof NexeError) {
          process.stderr.write(EOL + chalk.red('Error: ') + error.message + EOL
            + EOL + 'See nexe -h for usage..' + EOL + EOL
          )
        } else {
          process.stderr.write(error.stack + EOL)
        }
      }

      process.exit(1)
    })
  }
}

export { compile }
export default compile
