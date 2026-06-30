import styles from "./FileUpload.module.css";
import { useState } from "react";

export default function FileUpload() {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);



    // função para limitar arquivos de até 10MB
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            if (selectedFile.size > 10 * 1024 * 1024) {
                setError("O arquivo deve ter no máximo 10 MB.");
                setFile(null);
            } else {
                setError(null);
                setFile(selectedFile);
            }
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
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {file && (
                <p>
                    Arquivo selecionado: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                </p>
            )}
            <button onClick={handleUpload} disabled={!file}>
                Upload
            </button>
        </div>
    );
}