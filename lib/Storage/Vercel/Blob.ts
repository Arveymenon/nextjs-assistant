const uploadFile = async (path: string, file: File) => {
    
    const formData = new FormData();
    formData.append('file', file)
    formData.append('filename', path)

    return await fetch('/api/fileUploader', {
        method: "POST",
        body: formData,
    }).then(async res=>{
        return (await res.json()).url
    })
}

export default uploadFile