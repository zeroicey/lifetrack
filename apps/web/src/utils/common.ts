import SparkMD5 from "spark-md5";

export const calculateMD5 = async (file: File) => {
    return new Promise<string>((resolve, reject) => {
        const spark = new SparkMD5.ArrayBuffer();
        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target && e.target.result) {
                spark.append(e.target.result as ArrayBuffer);
                resolve(spark.end());
            } else {
                reject(new Error("Failed to read file"));
            }
        };
        reader.onerror = () => {
            reject(new Error("Read error"));
        };
        reader.readAsArrayBuffer(file);
    });
};
