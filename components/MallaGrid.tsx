import React from "react";

interface Asignatura {
  codigo: string;
  nombre: string;
  creditos: number;
  prerrequisitos: string[];
  descripcion: string;
  area: string;
}

interface Semestre {
  semestre: number;
  asignaturas: Asignatura[];
  semestreContinuo?: number;
}

interface Malla {
  carrera: string;
  años: { semestres: Semestre[] }[];
}

interface Props {
  malla: Malla;
  onAsignaturaClick?: (asignatura: Asignatura) => void;
  aprobadas?: string[];
  isDesbloqueada?: (asig: Asignatura) => boolean;
  onTacharSemestre?: (asignaturas: Asignatura[]) => void;
  enCurso?: string[];
  onAsignaturaCursoClick?: (asig: Asignatura) => void;
  creditosEnCurso?: number;
}

// Escala de verdes pastel de claro a oscuro (11 tonos)
const verdeScale = [
  "#e6f9e6", // 1 - muy claro
  "#d0f5df", // 2
  "#c2f0cb", // 3
  "#a6eec0", // 4
  "#8ee6b0", // 5
  "#6fdc9c", // 6
  "#4fc97e", // 7
  "#38b36b", // 8
  "#259a57", // 9
  "#1b7a43", // 10
  "#145c32"  // 11 - más oscuro
];

const textColorForBg = (idx: number) => (idx < 6 ? "#205c36" : "#fff");

const MallaGrid: React.FC<Props> = ({ malla, onAsignaturaClick, aprobadas = [], isDesbloqueada, onTacharSemestre, enCurso, onAsignaturaCursoClick, creditosEnCurso }) => {
  // Unificar todos los semestres en un solo array plano y numerarlos de forma continua
  const semestres: Semestre[] = malla.años.flatMap((a) => a.semestres);
  // Ordenar por año y semestre original
  const semestresContinuos = semestres.map((sem, idx) => ({ ...sem, semestreContinuo: idx + 1 }));

  return (
    <div
      style={{
        background: "#e6f9e6",
        minHeight: "100vh",
        padding: 32,
        fontFamily: "Segoe UI, Arial, sans-serif"
      }}
    >
      <style>{`
        @media (max-width: 700px) {
          .malla-semestres {
            flex-direction: column !important;
            gap: 18px !important;
            overflow-x: unset !important;
            max-width: 100vw !important;
            padding-bottom: 0 !important;
          }
          .malla-semestre-columna {
            min-width: unset !important;
            max-width: unset !important;
            width: 100% !important;
            margin: 0 auto !important;
          }
        }
      `}</style>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap' }}>
        <h1 style={{ textAlign: "center", color: "#259a57", marginBottom: 0, flex: 1, fontSize: 32 }}>
          {malla.carrera}
        </h1>
        {creditosEnCurso && creditosEnCurso > 0 && (
          <div style={{
            background: '#ffe066',
            color: '#8a6d1b',
            padding: '8px 18px',
            borderRadius: 10,
            fontWeight: 600,
            fontSize: 16,
            marginLeft: 24,
            boxShadow: '0 2px 8px #ffe06655',
            minWidth: 160,
            textAlign: 'right',
            marginTop: 12
          }}>
            Créditos en curso: {creditosEnCurso}
          </div>
        )}
        <style>{`
          @media (max-width: 700px) {
            .titulo-label-stack {
              flex-direction: column !important;
              align-items: center !important;
              gap: 10px !important;
            }
            .titulo-label-stack h1 {
              font-size: 22px !important;
              text-align: center !important;
            }
            .titulo-label-stack .creditos-label {
              font-size: 15px !important;
              min-width: unset !important;
              margin-left: 0 !important;
              text-align: center !important;
            }
          }
        `}</style>
      </div>
      <div
        className="malla-semestres"
        style={{
          display: "flex",
          gap: 24,
          justifyContent: "flex-start",
          alignItems: "flex-start",
          overflowX: "auto",
          paddingBottom: 16,
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "thin",
          maxWidth: "100vw"
        }}
      >
        {semestresContinuos.map((sem, idx) => {
          // Determinar si todas las asignaturas desbloqueadas del semestre están aprobadas
          const desbloqueadas = sem.asignaturas.filter(isDesbloqueada || (() => true));
          const codigosDesbloqueados = desbloqueadas.map((a) => a.codigo);
          const todasAprobadas = codigosDesbloqueados.length > 0 && codigosDesbloqueados.every((codigo) => aprobadas.includes(codigo));
          // Nueva lógica: el botón solo está habilitado si todas las asignaturas del semestre están desbloqueadas
          const todasDesbloqueadas = sem.asignaturas.every(isDesbloqueada || (() => true));
          return (
            <div
              className="malla-semestre-columna"
              key={`semestre-${sem.semestreContinuo}-${idx}`}
              style={{
                background: verdeScale[idx % verdeScale.length],
                borderRadius: 18,
                boxShadow: `0 2px 8px ${verdeScale[Math.min(idx + 2, verdeScale.length - 1)]}55`,
                padding: 18,
                minWidth: 220,
                maxWidth: 260,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flex: "0 0 220px"
              }}
            >
              {onTacharSemestre && (
                <button
                  onClick={() => todasDesbloqueadas && onTacharSemestre(sem.asignaturas)}
                  disabled={!todasDesbloqueadas}
                  style={{
                    marginBottom: 10,
                    background: todasAprobadas && todasDesbloqueadas ? "#38b36b" : "#c2f0cb",
                    color: todasAprobadas && todasDesbloqueadas ? "#fff" : "#205c36",
                    border: "none",
                    borderRadius: 8,
                    padding: "6px 14px",
                    fontWeight: 600,
                    fontSize: 15,
                    cursor: todasDesbloqueadas ? "pointer" : "not-allowed",
                    boxShadow: todasAprobadas && todasDesbloqueadas ? "0 0 0 2px #259a57" : "none",
                    transition: "all 0.2s",
                    opacity: todasDesbloqueadas ? 1 : 0.5
                  }}
                  title={
                    todasDesbloqueadas
                      ? (todasAprobadas ? "Destachar todas las asignaturas del semestre" : "Tachar todas las asignaturas desbloqueadas del semestre")
                      : "No puedes tachar el semestre hasta que todas las asignaturas estén desbloqueadas"
                  }
                >
                  {todasAprobadas ? "Semestre completado" : "Completar semestre"}
                </button>
              )}
              <h2 style={{ color: textColorForBg(idx), marginBottom: 16, fontSize: 22 }}>Semestre {sem.semestreContinuo}</h2>
              <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 14 }}>
                {sem.asignaturas.map((asig) => {
                  const estaAprobada = aprobadas.includes(asig.codigo);
                  const desbloqueada = isDesbloqueada ? isDesbloqueada(asig) : true;
                  const estaEnCurso = enCurso && enCurso.includes(asig.codigo);
                  // Nuevo: ¿todos los prerrequisitos están aprobados o en curso, y al menos uno en curso?
                  const todosPrereqAprobOEnCurso = asig.prerrequisitos.length > 0 && asig.prerrequisitos.every((pr: string) => (aprobadas.includes(pr) || (enCurso && enCurso.includes(pr))));
                  const algunoPrereqEnCurso = asig.prerrequisitos.some((pr: string) => enCurso && enCurso.includes(pr));
                  const mostrarNaranja = todosPrereqAprobOEnCurso && algunoPrereqEnCurso;
                  // Color de texto: si está aprobada, blanco; si no, siempre oscuro
                  const colorTexto = estaAprobada ? "#fff" : "#205c36";

                  // Long press logic
                  let longPressTimer: NodeJS.Timeout | null = null;
                  const longPressDuration = 500; // ms

                  const handleTouchStart = (e: React.TouchEvent) => {
                    if (!onAsignaturaCursoClick) return;
                    // Solo permite long press si está desbloqueada y NO está aprobada y no tiene prereq en curso
                    if (!desbloqueada || estaAprobada || mostrarNaranja) return;
                    longPressTimer = setTimeout(() => {
                      onAsignaturaCursoClick(asig);
                    }, longPressDuration);
                  };
                  const handleTouchEnd = (e: React.TouchEvent) => {
                    if (longPressTimer) {
                      clearTimeout(longPressTimer);
                      longPressTimer = null;
                    }
                  };

                  // Nuevo: si tiene prereq en curso y todos los demás aprobados/en curso, no es cliqueable
                  const esCliqueable = (desbloqueada && !mostrarNaranja && !estaAprobada) || estaAprobada;

                  return (
                    <div
                      key={asig.codigo}
                      style={{
                        border: `1.5px solid ${verdeScale[Math.min(idx + 2, verdeScale.length - 1)]}`,
                        borderRadius: 10,
                        padding: "10px 12px",
                        background: estaAprobada
                          ? "#38b36b"
                          : estaEnCurso
                          ? "#ffe066"
                          : mostrarNaranja
                          ? "#ffd8b0" // naranja claro
                          : desbloqueada
                          ? "#fff"
                          : "#f5f5f5",
                        opacity: esCliqueable ? 1 : 0.7,
                        textDecoration: estaAprobada ? "line-through" : "none",
                        color: desbloqueada ? colorTexto : "#888",
                        fontWeight: 500,
                        fontSize: 16,
                        marginBottom: 2,
                        cursor: esCliqueable ? "pointer" : "not-allowed",
                        boxShadow: estaAprobada ? "0 0 0 2px #259a57" : "none",
                        transition: "all 0.2s"
                      }}
                      onClick={() => esCliqueable && onAsignaturaClick && onAsignaturaClick(asig)}
                      onContextMenu={e => {
                        if (!esCliqueable) return;
                        e.preventDefault();
                        if (onAsignaturaCursoClick) {
                          onAsignaturaCursoClick(asig);
                        }
                      }}
                      onTouchStart={handleTouchStart}
                      onTouchEnd={handleTouchEnd}
                      onTouchCancel={handleTouchEnd}
                    >
                      <div style={{ fontWeight: 600 }}>{asig.nombre}</div>
                      <div style={{ fontSize: 12, color: estaAprobada ? "#fff" : "#259a57", marginTop: 2 }}>{asig.codigo} · {asig.creditos} créditos</div>
                      {/* Aquí podrías mostrar más info */}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{textAlign: "center", color: "#259a57", marginTop: 18, fontSize: 15}}>
        <span>Desliza horizontalmente para ver todos los semestres</span>
      </div>
    </div>
  );
};

export default MallaGrid; 