import SparkMD5 from "spark-md5";

export const calculateMD5 = async (file: File) => {
    return new Promise((resolve, reject) => {
        const spark = new SparkMD5.ArrayBuffer();
        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target) {
                resolve(spark.end());
            }
        };
        reader.onerror = () => {
            reject(new Error("Read error"));
        };
        reader.readAsArrayBuffer(file);
    });
};
