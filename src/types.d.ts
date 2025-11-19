declare module 'got' {
  interface GotFn {
    (url: string, options?: any): Promise<{ body: string }>
    stream(url: string, optoins?: any): any
  }
  const got: GotFn
  export = got
}
