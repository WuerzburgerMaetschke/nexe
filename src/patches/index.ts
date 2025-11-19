import gyp from './gyp.js'
import bootNexe from './third-party-main.js'
import buildFixes from './build-fixes.js'
import cli from './disable-node-cli.js'
import flags from './flags.js'
import ico from './ico.js'
import rc from './node-rc.js'
import snapshot from './snapshot.js'

const patches = [gyp, bootNexe, buildFixes, cli, flags, ico, rc, snapshot]

export default patches
