'use client';
import React, { useState, useEffect } from "react";
import MallaGrid from "../components/MallaGrid";

export default function MallaPageClient() {
  const [malla, setMalla] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aprobadas, setAprobadas] = useState<string[]>([]);

  useEffect(() => {
    fetch("/data/malla.json")
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo cargar la malla curricular");
        return res.json();
      })
      .then((data) => {
        setMalla(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Función recursiva para obtener todas las asignaturas que dependen de una dada
  const getDependientes = (codigo: string, mallaData: any, yaMarcadas = new Set<string>()) => {
    let dependientes: string[] = [];
    for (const año of mallaData.años) {
      for (const sem of año.semestres) {
        for (const asig of sem.asignaturas) {
          if (asig.prerrequisitos.includes(codigo) && !yaMarcadas.has(asig.codigo)) {
            dependientes.push(asig.codigo);
            yaMarcadas.add(asig.codigo);
            dependientes = dependientes.concat(getDependientes(asig.codigo, mallaData, yaMarcadas));
          }
        }
      }
    }
    return dependientes;
  };

  // Al hacer click en una asignatura, la marco como aprobada si sus prerrequisitos están aprobados
  const handleAsignaturaClick = (asig: any) => {
    if (aprobadas.includes(asig.codigo)) {
      // Si la desmarco, también desmarco todas las que dependan de ella
      if (malla) {
        const dependientes = getDependientes(asig.codigo, malla);
        setAprobadas(aprobadas.filter((c) => c !== asig.codigo && !dependientes.includes(c)));
      }
    } else {
      // Solo la apruebo si todos sus prerrequisitos están aprobados
      const puedeAprobar = asig.prerrequisitos.every((pr: string) => aprobadas.includes(pr));
      if (puedeAprobar) {
        setAprobadas([...aprobadas, asig.codigo]);
      }
    }
  };

  // Función para saber si una asignatura está desbloqueada (todos sus prerrequisitos aprobados)
  const isDesbloqueada = (asig: any) => {
    return asig.prerrequisitos.length === 0 || asig.prerrequisitos.every((pr: string) => aprobadas.includes(pr));
  };

  // Nueva función: aprobar o desaprobar todas las asignaturas de un semestre
  const handleTacharSemestre = (asignaturas: any[]) => {
    // Solo se pueden aprobar las desbloqueadas
    const desbloqueadas = asignaturas.filter(isDesbloqueada);
    const codigosDesbloqueados = desbloqueadas.map((a) => a.codigo);
    const todasAprobadas = codigosDesbloqueados.every((codigo) => aprobadas.includes(codigo));
    if (todasAprobadas) {
      // Si ya estaban todas aprobadas, las desmarco (y sus dependientes)
      if (malla) {
        let codigosADesmarcar = new Set<string>();
        for (const codigo of codigosDesbloqueados) {
          const dependientes = getDependientes(codigo, malla);
          codigosADesmarcar.add(codigo);
          dependientes.forEach((dep) => codigosADesmarcar.add(dep));
        }
        setAprobadas(aprobadas.filter((c) => !codigosADesmarcar.has(c)));
      }
    } else {
      // Apruebo todas las desbloqueadas
      setAprobadas([
        ...aprobadas,
        ...codigosDesbloqueados.filter((codigo) => !aprobadas.includes(codigo))
      ]);
    }
  };

  if (loading) return <div>Cargando malla curricular...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;
  if (!malla) return null;

  return (
    <div style={{ padding: 32 }}>
      <MallaGrid
        malla={malla}
        onAsignaturaClick={handleAsignaturaClick}
        aprobadas={aprobadas}
        isDesbloqueada={isDesbloqueada}
        onTacharSemestre={handleTacharSemestre}
      />
    </div>
  );
} 