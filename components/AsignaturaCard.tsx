import React from "react";

interface Props {
  codigo: string;
  nombre: string;
  creditos: number;
  area: string;
  onClick?: () => void;
}

const AsignaturaCard: React.FC<Props> = ({ codigo, nombre, creditos, area, onClick }) => (
  <div
    style={{
      border: "1px solid #bbb",
      borderRadius: 8,
      padding: 10,
      marginBottom: 8,
      background: "#f9f9f9",
      cursor: onClick ? "pointer" : "default"
    }}
    onClick={onClick}
  >
    <div style={{ fontWeight: "bold" }}>{nombre}</div>
    <div style={{ fontSize: 12, color: "#555" }}>{codigo}</div>
    <div style={{ fontSize: 12, color: "#888" }}>{area}</div>
  </div>
);

export default AsignaturaCard; 