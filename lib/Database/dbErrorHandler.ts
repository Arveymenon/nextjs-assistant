const errorHandler = (err: any) => {
    debugger;
    console.error(err)
    throw new Error(err)
}

export default errorHandler