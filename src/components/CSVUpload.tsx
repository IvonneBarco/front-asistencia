import React, { useRef, useState } from 'react';
import { Card, Button, Badge } from './ui';
import type { CSVImportResponse } from '../types';
import './CSVUpload.css';

interface CSVUploadProps {
  onUpload: (file: File) => void;
  isLoading?: boolean;
  result?: CSVImportResponse | null;
}

export const CSVUpload: React.FC<CSVUploadProps> = ({
  onUpload,
  isLoading,
  result,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith('.csv')) {
      setSelectedFile(file);
    } else {
      alert('Por favor selecciona un archivo CSV válido');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.name.endsWith('.csv')) {
      setSelectedFile(file);
    } else {
      alert('Por favor selecciona un archivo CSV válido');
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="csv-upload">
      <div
        className={`csv-upload__dropzone ${dragActive ? 'csv-upload__dropzone--active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="csv-upload__input"
          id="csv-file-input"
        />
        
        {!selectedFile ? (
          <label htmlFor="csv-file-input" className="csv-upload__label">
            <div className="csv-upload__icon">📄</div>
            <p className="csv-upload__text">
              Arrastra un archivo CSV aquí o{' '}
              <span className="csv-upload__link">haz clic para seleccionar</span>
            </p>
            <p className="csv-upload__hint">
              Formato: name, identification, role
            </p>
          </label>
        ) : (
          <div className="csv-upload__selected">
            <div className="csv-upload__file-info">
              <span className="csv-upload__file-icon">📄</span>
              <div>
                <p className="csv-upload__file-name">{selectedFile.name}</p>
                <p className="csv-upload__file-size">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <div className="csv-upload__actions">
              <Button
                variant="primary"
                onClick={handleUpload}
                isLoading={isLoading}
                disabled={isLoading}
              >
                Importar
              </Button>
              <Button
                variant="ghost"
                onClick={handleReset}
                disabled={isLoading}
              >
                Cambiar archivo
              </Button>
            </div>
          </div>
        )}
      </div>

      {result && (
        <Card variant="outlined" padding="md" className="csv-upload__result">
          <h4 className="csv-upload__result-title">Resultado de Importación</h4>
          
          <div className="csv-upload__stats">
            <div className="csv-upload__stat">
              <Badge variant="success" size="lg">
                {result.created.length}
              </Badge>
              <span className="csv-upload__stat-label">Creados</span>
            </div>
            
            {result.updated.length > 0 && (
              <div className="csv-upload__stat">
                <Badge variant="default" size="lg">
                  {result.updated.length}
                </Badge>
                <span className="csv-upload__stat-label">Actualizados</span>
              </div>
            )}
            
            {result.errors.length > 0 && (
              <div className="csv-upload__stat">
                <Badge variant="error" size="lg">
                  {result.errors.length}
                </Badge>
                <span className="csv-upload__stat-label">Errores</span>
              </div>
            )}
          </div>

          {result.created.length > 0 && (
            <div className="csv-upload__details">
              <h5 className="csv-upload__details-title">✅ Usuarios creados:</h5>
              <ul className="csv-upload__list">
                {result.created.map((user, index) => (
                  <li key={index} className="csv-upload__list-item">
                    {user.name} ({user.identification})
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.errors.length > 0 && (
            <div className="csv-upload__details">
              <h5 className="csv-upload__details-title csv-upload__details-title--error">
                ❌ Errores:
              </h5>
              <ul className="csv-upload__list">
                {result.errors.map((error, index) => (
                  <li key={index} className="csv-upload__list-item csv-upload__list-item--error">
                    {error.name} ({error.identification}): {error.error}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};
