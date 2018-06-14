export default function imports(...modules){
  // console.log("import modules")
  // console.log(modules)
  return Promise.all(
    modules.concat.apply([], modules)
    .map(async m => {
      let module = await m
      if (module.default) return module.default
      else return {...module}
    })
  )
}
