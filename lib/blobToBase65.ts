//callback - where we want to get result
const blobToBase64 = (blob: Blob, callback: (base64data: string)=>{}) => {
    const reader = new FileReader();
    reader.onload = function () {
        const result = (reader.result as string)
        const base64data = result?.split(",")[1];
        callback(base64data);
    };
    reader.readAsDataURL(blob);
};
  
export { blobToBase64 };