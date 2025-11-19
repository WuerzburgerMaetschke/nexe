import { normalizeOptions } from '../src/options'
import { expect } from 'chai'
import * as path from 'path'

const ext = process.platform === 'win32' ? '.exe' : ''

describe('options', () => {
  describe('cwd', () => {
    it('should use process.cwd() if nothing is provided', async () => {
      const options = await normalizeOptions()
      expect(options.cwd).to.equal(process.cwd())
    })
    it('should use the main module in a package directory (if not in a TTY)', async () => {
      const options = await normalizeOptions()
      if (!process.stdin.isTTY) {
        expect(options.input).to.equal('[stdin]')
      } else {
        expect(options.input).to.equal(path.resolve('./index.js'))
      }
    })
    it('should resolve relative paths for input', async () => {
      const options = await normalizeOptions({ input: 'test/fixture/entry.js' })
      expect(options.input).to.equal(path.resolve('./test/fixture/entry.js'))
    })
    it('should accept a module entry as input', async () => {
      const options = await normalizeOptions({ input: 'test/fixture' })
      expect(options.input).to.equal(path.resolve('./test/fixture/entry.js'))
    })
    it('should resolve pathed options against cwd', async () => {
      const cwd = path.join(process.cwd(), 'test/fixture')
      const options = await normalizeOptions({
        cwd,
        input: 'entry',
        output: 'abc',
        temp: './d'
      })
      expect(options.temp).to.equal(path.resolve(cwd, './d'))
      expect(options.input).to.equal(path.resolve(cwd, 'entry.js'))
      expect(options.output).to.equal(path.resolve(cwd, `abc${ext}`))
    })
  })

  describe('remote', () => {
    it('should use default remote', async () => {
      const options = await normalizeOptions({})
      expect(options.remote).to.equal('https://github.com/nexe/nexe/releases/download/v3.3.3/')
    })
    it('should append trailing slash to third-party remote if necessary', async () => {
      const options = await normalizeOptions({
        remote: 'https://sitejs.org/nexe'
      })
      expect(options.remote).to.equal('https://sitejs.org/nexe/')
    })
    it('should not append trailing slash to third-party remote that already has one', async () => {
      const options = await normalizeOptions({
        remote: 'https://sitejs.org/nexe/'
      })
      expect(options.remote).to.equal('https://sitejs.org/nexe/')
    })
  })

  describe('output', () => {
    it('should work', async () => {
      const options = await normalizeOptions({
        output: './some-output'
      })
      expect(options.output).to.equal(path.resolve(`./some-output${ext}`))
    })
    it('should default to the input file name if not index', async () => {
      const options = await normalizeOptions({
        input: './test/fixture'
      })
      expect(options.output).to.equal(path.resolve(`./entry${ext}`))
    })
    it('should default to the folder/project name if filename is index', async () => {
      const options = await normalizeOptions({ cwd: './test/fixture2' })
      expect(options.output).to.equal(path.resolve(`./test/fixture2/fixture2${ext}`))
    })
  })
})
