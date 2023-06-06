declare module '*.css' {
  // eslint-disable-next-line @typescript-eslint/interface-name-prefix
  interface IClassNames {
    [className: string]: string
  }
  const classNames: IClassNames
  export = classNames
}

interface Window {
  vtexjs: VTEXJS
  $: any // JQuery types
}
