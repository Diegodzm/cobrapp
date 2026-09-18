'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { uploadPdfTemplate } from '@/app/actions/auth'

interface FieldCoord {
  x: number;
  y: number;
}

export default function UserConfigPage() {
  const [companyName, setCompanyName] = useState('')
  const [documentName, setDocumentName] = useState('')
  const [pdfUrl, setPdfUrl] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  const showToast = (text: string, type: 'success' | 'error') => {
    setToastMessage({ text, type })
    setTimeout(() => {
      setToastMessage(null)
    }, 4000)
  }
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPdfLoading, setIsPdfLoading] = useState(false)

  const [fixedFields, setFixedFields] = useState<Record<string, FieldCoord>>({
    client: { x: 50, y: 120 },
    date: { x: 450, y: 80 },
  })

  const [tableContainer, setTableContainer] = useState({
    start_x: 50,
    start_y: 280,
    row_height: 25,
    max_rows: 15,
  })

  const [activeTarget, setActiveTarget] = useState<string | null>(null)
  const [draggingTarget, setDraggingTarget] = useState<string | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    const formData = new FormData()
    formData.append('file', file)
    formData.append('companyName', companyName)
    formData.append('documentName', documentName)

    setIsUploading(true)
    const result = await uploadPdfTemplate(formData)
    setIsUploading(false)

    if (result.success && result.publicUrl) {
      setPdfUrl(result.publicUrl)
      setIsPdfLoading(true)
      showToast('¡Plantilla PDF subida con éxito!', 'success')
    } else {
      showToast(`Error al subir: ${result.error}`, 'error')
    }
  }

  // Clic rápido tradicional (modo secundario)
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!activeTarget || draggingTarget) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = Math.round(e.clientX - rect.left)
    const y = Math.round(e.clientY - rect.top)

    if (activeTarget.startsWith('fixed_')) {
      const fieldKey = activeTarget.replace('fixed_', '')
      setFixedFields(prev => ({
        ...prev,
        [fieldKey]: { x, y }
      }))
    } else if (activeTarget === 'table_start') {
      setTableContainer(prev => ({ ...prev, start_x: x, start_y: y }))
    }

    setActiveTarget(null)
  }

  // Lógica de Arrastre Fluido (Drag and Drop con límites en hoja A4)
  const handleMouseDown = (e: React.MouseEvent, targetKey: string) => {
    e.stopPropagation()
    setDraggingTarget(targetKey)
  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!draggingTarget || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    let x = Math.round(e.clientX - rect.left)
    let y = Math.round(e.clientY - rect.top)

    // Restricciones estrictas dentro de las medidas reales de una hoja A4 (595 x 842 píxeles)
    x = Math.max(10, Math.min(x, 585))
    y = Math.max(10, Math.min(y, 832))

    if (draggingTarget.startsWith('fixed_')) {
      const fieldKey = draggingTarget.replace('fixed_', '')
      setFixedFields(prev => ({
        ...prev,
        [fieldKey]: { x, y }
      }))
    } else if (draggingTarget === 'table_start') {
      setTableContainer(prev => ({ ...prev, start_x: x, start_y: y }))
    }
  }, [draggingTarget])

  const handleMouseUp = useCallback(() => {
    setDraggingTarget(null)
  }, [])

  useEffect(() => {
    if (draggingTarget) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [draggingTarget, handleMouseMove, handleMouseUp])

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 py-10 px-4 selection:bg-lime-500 selection:text-slate-950 relative">
      
      {/* Sistema de Toast flotante */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 animate-bounce">
          <div className={`px-5 py-3 rounded-2xl shadow-2xl border flex items-center gap-3 text-xs font-bold tracking-wider uppercase backdrop-blur-md ${
            toastMessage.type === 'success' 
              ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-300 shadow-emerald-900/20' 
              : 'bg-red-950/90 border-red-500/50 text-red-300 shadow-red-900/20'
          }`}>
            <span>{toastMessage.type === 'success' ? '✓' : '✕'}</span>
            {toastMessage.text}
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto bg-[#111827] rounded-2xl shadow-2xl p-8 space-y-8 border border-slate-800">
        
        {/* Encabezado */}
        <div className="border-b border-slate-800 pb-5">
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            Configuración de <span className="text-lime-400">Plantilla PDF</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Establece los datos de tu empresa, sube la plantilla base y calibra las coordenadas de los campos.
          </p>
        </div>

        {/* Sección 1: Datos de Empresa y Documento */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Nombre de Empresa
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Ej: Mi Taller SpA"
              className="w-full px-4 py-2.5 bg-[#0b0f19] border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:ring-2 focus:ring-lime-400 focus:outline-none transition text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Nombre del Documento / Plantilla
            </label>
            <input
              type="text"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              placeholder="Ej: Presupuesto Estándar A4"
              className="w-full px-4 py-2.5 bg-[#0b0f19] border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:ring-2 focus:ring-lime-400 focus:outline-none transition text-sm"
            />
          </div>
        </div>

        {/* Sección 2: Subida de PDF al Bucket */}
        <div className="p-6 border-2 border-dashed border-slate-800 rounded-2xl bg-[#0b0f19]/50 space-y-3">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
            Plantilla PDF Base (Bucket: Presupuestos)
          </label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="block w-full text-sm text-slate-400 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-xs file:font-bold file:uppercase file:bg-lime-400 file:text-slate-950 hover:file:bg-lime-500 cursor-pointer transition"
          />
          {isUploading && <p className="text-xs text-lime-400 font-medium animate-pulse">Subiendo PDF a Supabase Storage...</p>}
          {pdfUrl && <p className="text-xs text-emerald-400 font-medium truncate">✓ Cargado: {pdfUrl}</p>}
        </div>

        {/* Sección 3: Calibración de Coordenadas */}
        <div className="space-y-6 pt-4 border-t border-slate-800">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">Coordenadas y Posicionamiento</h2>
              <p className="text-xs text-slate-400">Ajusta manualmente los valores o arrastra las etiquetas en el previsualizador.</p>
            </div>
            <button
              onClick={() => {
                setIsModalOpen(true)
                if (pdfUrl) setIsPdfLoading(true)
              }}
              className="px-5 py-2.5 bg-lime-400 hover:bg-lime-500 text-slate-950 rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-lime-400/10"
            >
              Abrir Previsualizador Interactivo
            </button>
          </div>

          {/* Ajuste Manual por Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#0b0f19] p-6 rounded-2xl border border-slate-800">
            <div>
              <h3 className="font-semibold text-slate-300 mb-4 text-xs uppercase tracking-wider">Campos Fijos (X, Y)</h3>
              <div className="space-y-3">
                {Object.keys(fixedFields).map((key) => (
                  <div key={key} className="flex items-center justify-between gap-3 bg-[#111827] p-3 rounded-xl border border-slate-800">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300 w-20">{key}</span>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-slate-500">X:</span>
                        <input
                          type="number"
                          value={fixedFields[key].x}
                          onChange={(e) => setFixedFields({ ...fixedFields, [key]: { ...fixedFields[key], x: Number(e.target.value) } })}
                          className="w-16 px-2 py-1 bg-[#0b0f19] border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-lime-400"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-slate-500">Y:</span>
                        <input
                          type="number"
                          value={fixedFields[key].y}
                          onChange={(e) => setFixedFields({ ...fixedFields, [key]: { ...fixedFields[key], y: Number(e.target.value) } })}
                          className="w-16 px-2 py-1 bg-[#0b0f19] border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-lime-400"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-300 mb-4 text-xs uppercase tracking-wider">Bloque Secuencial de Ítems (Tabla)</h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-[#111827] p-3 rounded-xl border border-slate-800">
                  <label className="text-slate-400 block mb-1 font-semibold">Inicio X:</label>
                  <input
                    type="number"
                    value={tableContainer.start_x}
                    onChange={(e) => setTableContainer({ ...tableContainer, start_x: Number(e.target.value) })}
                    className="w-full px-2 py-1 bg-[#0b0f19] border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-lime-400"
                  />
                </div>
                <div className="bg-[#111827] p-3 rounded-xl border border-slate-800">
                  <label className="text-slate-400 block mb-1 font-semibold">Inicio Y:</label>
                  <input
                    type="number"
                    value={tableContainer.start_y}
                    onChange={(e) => setTableContainer({ ...tableContainer, start_y: Number(e.target.value) })}
                    className="w-full px-2 py-1 bg-[#0b0f19] border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-lime-400"
                  />
                </div>
                <div className="bg-[#111827] p-3 rounded-xl border border-slate-800">
                  <label className="text-slate-400 block mb-1 font-semibold">Alto Fila (px):</label>
                  <input
                    type="number"
                    value={tableContainer.row_height}
                    onChange={(e) => setTableContainer({ ...tableContainer, row_height: Number(e.target.value) })}
                    className="w-full px-2 py-1 bg-[#0b0f19] border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-lime-400"
                  />
                </div>
                <div className="bg-[#111827] p-3 rounded-xl border border-slate-800">
                  <label className="text-slate-400 block mb-1 font-semibold">Máx. Filas:</label>
                  <input
                    type="number"
                    value={tableContainer.max_rows}
                    onChange={(e) => setTableContainer({ ...tableContainer, max_rows: Number(e.target.value) })}
                    className="w-full px-2 py-1 bg-[#0b0f19] border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-lime-400"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Interactivo de Posicionamiento */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 overflow-y-auto backdrop-blur-sm">
            <div className="bg-[#111827] border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
              <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-[#0b0f19]">
                <h3 className="font-bold text-white text-sm uppercase tracking-wider">Mapeo Visual de Coordenadas</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-xl font-bold text-slate-400 hover:text-white">&times;</button>
              </div>

              <div className="p-3 bg-lime-950/30 border-b border-lime-900/50 text-xs text-lime-300 flex justify-between items-center px-6">
                <span>
                  💡 **Arrastra** las etiquetas libremente por el documento o haz clic en un botón superior para posicionar por coordenadas.
                </span>
                {activeTarget && (
                  <button onClick={() => setActiveTarget(null)} className="text-red-400 font-semibold underline">Cancelar</button>
                )}
              </div>

              <div className="p-3 flex flex-wrap gap-2 border-b border-slate-800 bg-[#0b0f19]/50 px-6">
                {Object.keys(fixedFields).map(k => (
                  <button
                    key={k}
                    onClick={() => setActiveTarget(`fixed_${k}`)}
                    className={`px-3 py-1.5 text-xs rounded-xl font-bold transition border ${
                      activeTarget === `fixed_${k}` ? 'bg-lime-400 text-slate-950 border-lime-400 shadow-lg shadow-lime-400/20' : 'bg-[#111827] text-slate-300 border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    Ubicar {k}
                  </button>
                ))}
                <button
                  onClick={() => setActiveTarget('table_start')}
                  className={`px-3 py-1.5 text-xs rounded-xl font-bold transition border ${
                    activeTarget === 'table_start' ? 'bg-emerald-500 text-slate-950 border-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-[#111827] text-slate-300 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  Ubicar Inicio Tabla
                </button>
              </div>

              {/* Contenedor del Canvas / Lienzo PDF */}
              <div className="flex-1 overflow-auto p-6 bg-[#070a12] flex justify-center">
                <div
                  ref={canvasRef}
                  onClick={handleCanvasClick}
                  className="relative w-[595px] h-[842px] bg-white text-slate-900 shadow-2xl cursor-crosshair border border-slate-700 select-none overflow-hidden"
                >
                  {/* Pantalla de Carga (Loading) */}
                  {pdfUrl && isPdfLoading && (
                    <div className="absolute inset-0 z-40 bg-slate-950/90 backdrop-blur-xs flex flex-col items-center justify-center gap-3 text-slate-200">
                      <div className="w-8 h-8 border-4 border-lime-400 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-lime-400 animate-pulse">Renderizando plantilla PDF...</p>
                    </div>
                  )}

                  {/* Visor iframe */}
                  {pdfUrl ? (
                    <iframe
                      src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                      onLoad={() => {
                        setTimeout(() => setIsPdfLoading(false), 800)
                      }}
                      className="absolute inset-0 w-full h-full pointer-events-none border-0 select-none"
                      title="Vista previa del PDF"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm font-semibold pointer-events-none p-6 text-center">
                      [ Sube una plantilla PDF en el formulario anterior para visualizarla de fondo aquí ]
                    </div>
                  )}

                  {/* Capa Interactiva de Etiquetas Arrastrables */}
                  {Object.keys(fixedFields).map(k => (
                    <div
                      key={k}
                      onMouseDown={(e) => handleMouseDown(e, `fixed_${k}`)}
                      className="absolute z-50 px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold rounded-md shadow-xl cursor-grab active:cursor-grabbing transform -translate-x-1/2 -translate-y-1/2 transition-shadow select-none border border-blue-400/40"
                      style={{ left: `${fixedFields[k].x}px`, top: `${fixedFields[k].y}px` }}
                      title="Haz clic sostenido para arrastrar"
                    >
                      {k}: ({fixedFields[k].x}, {fixedFields[k].y})
                    </div>
                  ))}

                  <div
                    onMouseDown={(e) => handleMouseDown(e, 'table_start')}
                    className="absolute z-50 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold rounded-md shadow-xl cursor-grab active:cursor-grabbing transform -translate-x-1/2 -translate-y-1/2 transition-shadow select-none border border-emerald-400/40"
                    style={{ left: `${tableContainer.start_x}px`, top: `${tableContainer.start_y}px` }}
                    title="Haz clic sostenido para arrastrar"
                  >
                    📦 Tabla: ({tableContainer.start_x}, {tableContainer.start_y})
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-800 bg-[#0b0f19] flex justify-end">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-lime-400 hover:bg-lime-500 text-slate-950 text-xs uppercase tracking-wider rounded-xl font-bold transition"
                >
                  Guardar Coordenadas
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}