import React from "react";

interface Props {
  codigo: string;
  nombre: string;
  creditos: number;
  area: string;
  descripcion: string;
  prerrequisitos: string[];
  onClose: () => void;
}

const DetalleAsignatura: React.FC<Props> = ({ codigo, nombre, creditos, area, descripcion, prerrequisitos, onClose }) => (
  <div style={{ background: "#fff", border: "2px solid #333", borderRadius: 12, padding: 24, maxWidth: 400 }}>
    <button onClick={onClose} style={{ float: "right" }}>Cerrar</button>
    <h2>{nombre}</h2>
    <div><strong>Código:</strong> {codigo}</div>
    <div><strong>Créditos:</strong> {creditos}</div>
    <div><strong>Área:</strong> {area}</div>
    <div><strong>Descripción:</strong> {descripcion}</div>
    <div><strong>Prerrequisitos:</strong> {prerrequisitos.length > 0 ? prerrequisitos.join(", ") : "Ninguno"}</div>
  </div>
);

export default DetalleAsignatura; 