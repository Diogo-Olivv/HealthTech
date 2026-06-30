import styles from "./FileUpload.module.css";
import { useState } from "react";

export default function FileUpload() {
    const [file, setFile] = useState<File | null>(null);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };
    const handleUpload = () => {
        if (file) {
            console.log("Upload do arquivo:", file);
        }
    };
    return (
        <div className={styles.card} role="status" aria-live="polite">
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
}