export const httpResponse = (res) => {
    return ({
        statusCode = 500,
        body = null
    }) => res.writeHead(statusCode).end(body ? JSON.stringify(body) : undefined)
}