export const buildRoutePath = (path) => {
  const routeParameterRegex = /:([a-zA-Z]+)/g
  const pathWithParams = path.replace(routeParameterRegex, '(?<$1>[a-z0-9\-_]+)')
  
  const pathRegex = new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`,)
  return pathRegex
}