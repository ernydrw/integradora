import React, { useState, useEffect } from 'react';
import { siteConfig } from './siteConfig';
import {
  Menu, X, FileText, ExternalLink, Download,
  Folder, FileCode, GitBranch, Eye, Archive,
  ChevronRight, ArrowLeft, Globe
} from 'lucide-react';

export default function App() {
  // =========================================================================
  // 1. ESTADOS (Variables que React vigila para actualizar la pantalla)
  // =========================================================================

  // Controla si el menú de celular está abierto (true) o cerrado (false)
  const [menuAbierto, setMenuAbierto] = useState(false);

  // Guarda qué categoría de PDF estamos filtrando ('todas' por defecto)
  const [unidadActiva, setUnidadActiva] = useState('todas');

  // Guarda el PDF que el usuario quiere ver en grande (null = ventana cerrada)
  // FUNCIONAMIENTO DEL VISOR PDF: Cuando vale null, la ventana modal está oculta.
  // Al hacer clic en "Ver PDF", guardamos aquí el objeto con los datos de ese PDF
  // (título, etiqueta y ruta) para que React dibuje la ventana emergente en pantalla.
  const [pdfSeleccionado, setPdfSeleccionado] = useState(null);

  // Controla qué repositorio vemos: 0 = Frontend, 1 = Backend
  // FUNCIONAMIENTO CON GITHUB: Este número elige cuál repositorio de la lista
  // 'siteConfig.repositories' vamos a consultar en internet.
  const [indiceRepo, setIndiceRepo] = useState(0);

  // Guarda la carpeta actual dentro de GitHub ('' significa la carpeta raíz)
  // FUNCIONAMIENTO CON GITHUB: Cuando entras a una carpeta (ej. "src"), este estado
  // cambia a "src". Si entras a otra dentro ("src/components"), cambia a "src/components".
  // Cada vez que este texto cambia, se vuelve a pedir a GitHub el contenido de esa nueva ruta.
  const [rutaCarpeta, setRutaCarpeta] = useState('');

  // Guarda la lista de archivos y carpetas que nos devuelve GitHub
  // FUNCIONAMIENTO CON GITHUB: Empieza como un arreglo vacío []. Cuando GitHub responde,
  // guardamos aquí todos los objetos (cada uno representa una carpeta o archivo con su nombre,
  // tamaño en bytes, tipo y enlace web).
  const [archivosRepo, setArchivosRepo] = useState([]);

  // Indica si estamos esperando respuesta de internet (true) o ya terminó (false)
  const [cargandoRepo, setCargandoRepo] = useState(true);

  // Guarda un mensaje de error si falla la conexión con GitHub
  const [errorRepo, setErrorRepo] = useState(null);

  // =========================================================================
  // 2. DATOS DEL REPOSITORIO ACTUAL
  // =========================================================================

  // Obtenemos el objeto del repositorio seleccionado desde siteConfig
  const repoActual = siteConfig.repositories[indiceRepo];
  const propietario = repoActual.owner;
  const nombreRepo = repoActual.repo;
  const rama = repoActual.branch;

  // Armamos la dirección web completa del repositorio
  const urlGitHub = `https://github.com/${propietario}/${nombreRepo}`;

  // =========================================================================
  // 3. FILTRADO DE ACTIVIDADES (PDFs)
  // =========================================================================

  let actividadesFiltradas = [];
  if (unidadActiva === 'todas') {
    // Si está en 'todas', mostramos la lista completa
    actividadesFiltradas = siteConfig.activities;
  } else {
    // Si eligió una unidad específica, filtramos solo las que coincidan
    actividadesFiltradas = siteConfig.activities.filter((actividad) => {
      return actividad.unidad === unidadActiva;
    });
  }

  // =========================================================================
  // 4. FUNCIONES DE NAVEGACIÓN (Acciones al hacer clic)
  // =========================================================================

  // Cambia entre Frontend y Backend y reinicia la ruta a la carpeta principal
  function cambiarRepositorio(nuevoIndice) {
    setIndiceRepo(nuevoIndice);
    setRutaCarpeta('');
  }

  // Regresa una carpeta hacia atrás en el explorador de GitHub
  function regresarCarpetaAnterior() {
    if (rutaCarpeta === '') return; // Si ya estamos en el inicio, no hace nada

    // Separamos la ruta por diagonales. Ejemplo: "src/components" -> ["src", "components"]
    const partes = rutaCarpeta.split('/');
    // Quitamos el último elemento ("components")
    partes.pop();
    // Volvemos a unir lo que queda ("src")
    setRutaCarpeta(partes.join('/'));
  }

  // Sube la pantalla suavemente hasta arriba
  function irAlInicio() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // =========================================================================
  // 5. CONEXIÓN CON LA API DE GITHUB (Se ejecuta al cambiar repo o carpeta)
  // =========================================================================

  // CÓMO SE CONECTA A GITHUB PASO A PASO:
  // 1. 'useEffect': Es un vigilante de React. Ejecuta el código de adentro automáticamente
  //    al abrir la página por primera vez y cada vez que cambien las variables del final
  //    ([propietario, nombreRepo, rama, rutaCarpeta]).
  // 2. 'async / await': Como pedir datos por internet tarda unos milisegundos, 'async' indica
  //    que la función es asíncrona (no congela la pantalla) y 'await' le dice al programa:
  //    "espera aquí hasta que GitHub termine de responder antes de pasar a la siguiente línea".
  useEffect(() => {
    async function obtenerArchivosDeGitHub() {
      setCargandoRepo(true); // Activamos aviso de "Cargando..."
      setErrorRepo(null);    // Limpiamos errores anteriores

      try {
        // Construimos la URL de la API de GitHub y pedimos los datos
        // EXPLICACIÓN DE LA API DE GITHUB:
        // GitHub tiene una dirección especial (api.github.com) que no devuelve páginas con botones,
        // sino datos puros en formato JSON sobre cualquier repositorio público.
        // - /repos/{propietario}/{nombreRepo}/contents/{rutaCarpeta}: pide el contenido de esa carpeta.
        // - ?ref={rama}: especifica de qué rama (ej. 'main' o 'master') queremos leer los archivos.
        const urlApi = `https://api.github.com/repos/${propietario}/${nombreRepo}/contents/${rutaCarpeta}?ref=${rama}`;

        // 'fetch' es la función nativa de JavaScript que hace la petición HTTP por internet
        const respuesta = await fetch(urlApi);

        // Si la respuesta no es exitosa (ej. error 404), lanzamos un error manual
        if (!respuesta.ok) {
          throw new Error(`No se pudo cargar "${nombreRepo}". Verifica que sea público y la rama "${rama}" exista.`);
        }

        // Convertimos la respuesta a formato JSON (lista de objetos)
        // GitHub nos entrega un arreglo de objetos, donde cada elemento tiene propiedades como:
        // - name: nombre del archivo ("App.jsx")
        // - type: "dir" si es carpeta, o "file" si es archivo
        // - path: ruta completa ("src/App.jsx")
        // - size: peso en bytes
        // - html_url: enlace directo para abrir ese archivo en la web de GitHub
        const datos = await respuesta.json();

        // Ordenamos la lista: primero las carpetas ('dir') y luego los archivos en orden alfabético
        if (Array.isArray(datos)) {
          datos.sort((a, b) => {
            if (a.type === b.type) {
              // Si ambos son carpetas o ambos son archivos, ordenamos por nombre (A-Z)
              return a.name.localeCompare(b.name);
            }
            if (a.type === 'dir') {
              return -1; // 'a' va primero porque es carpeta
            }
            return 1;    // 'b' va primero
          });
          // Guardamos la lista ya ordenada en el estado 'archivosRepo' para dibujarla en pantalla
          setArchivosRepo(datos);
        } else {
          setArchivosRepo([]);
        }
      } catch (error) {
        // Si algo falló (sin internet o repo privado), guardamos el mensaje
        setErrorRepo(error.message);
      } finally {
        // Pase lo que pase, apagamos el mensaje de "Cargando..."
        setCargandoRepo(false);
      }
    }

    obtenerArchivosDeGitHub();
  }, [propietario, nombreRepo, rama, rutaCarpeta]); // Se repite si cambia alguno de estos 4 valores

  // =========================================================================
  // 6. INTERFAZ VISUAL (Lo que se dibuja en pantalla)
  // =========================================================================
  return (
    <div className="relative w-screen min-h-screen bg-[#111317] text-slate-100 font-sans antialiased selection:bg-[#B8975B] selection:text-black overflow-x-hidden left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">

      {/* BARRA DE NAVEGACIÓN SUPERIOR */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#111317]/90 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* Logo y título del proyecto */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={irAlInicio}>
            <div className="w-9 h-9 rounded-lg bg-[#B8975B] flex items-center justify-center font-black text-black text-sm">
              KC
            </div>
            <div>
              <span className="text-lg font-black text-white">{siteConfig.project.title}</span>
              <span className="block text-[10px] text-slate-400 uppercase tracking-wider">{siteConfig.project.course}</span>
            </div>
          </div>

          {/* Enlaces de navegación para computadora */}
          {/* FUNCIONAMIENTO DE ANCLAS (#): Al usar href="#portafolio", el navegador busca
              la etiqueta <section id="portafolio"> y desliza la pantalla hasta esa sección. */}
          <nav className="hidden md:flex items-center space-x-7 text-xs uppercase tracking-wider font-bold text-slate-300">
            <a href="#portafolio" className="hover:text-[#B8975B] transition-colors">1. Portafolio</a>
            <a href="#incremento" className="hover:text-[#B8975B] transition-colors">2. Incremento</a>
            <a href="#codigo" className="hover:text-[#B8975B] transition-colors">3. Código .ZIP</a>
            <a href="#repositorio" className="hover:text-[#B8975B] transition-colors">4. GitHub</a>
          </nav>

          {/* Botón hamburguesa para celular */}
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            aria-label="Menú"
            className="md:hidden p-2 text-slate-300 hover:text-[#B8975B]"
          >
            {menuAbierto ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Menú desplegable cuando se abre en celular */}
        {menuAbierto && (
          <div className="md:hidden border-b border-slate-800 bg-[#16181e] px-6 py-4 space-y-2">
            <a href="#portafolio" onClick={() => setMenuAbierto(false)} className="block py-2 text-sm text-slate-300">1. Portafolio PDF</a>
            <a href="#incremento" onClick={() => setMenuAbierto(false)} className="block py-2 text-sm text-slate-300">2. Incremento Web</a>
            <a href="#codigo" onClick={() => setMenuAbierto(false)} className="block py-2 text-sm text-slate-300">3. Código .ZIP</a>
            <a href="#repositorio" onClick={() => setMenuAbierto(false)} className="block py-2 text-sm text-slate-300">4. Repositorios GitHub</a>
          </div>
        )}
      </header>

      {/* PORTADA / TÍTULO PRINCIPAL */}
      <section className="py-16 px-6 text-center max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
          {siteConfig.project.title}
        </h1>
        <p className="text-slate-400 text-sm sm:text-base">
          {siteConfig.project.subtitle}
        </p>
      </section>

      {/* SECCIÓN 1: PORTAFOLIO DE ACTIVIDADES (PDFs) */}
      <section id="portafolio" className="py-16 bg-[#F7F5F0] text-slate-900 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#8C6D37]">01 • Documentación</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Portafolio de Actividades</h2>
            </div>

            {/* Botones para filtrar por unidad */}
            <div className="flex flex-wrap gap-2">
              {siteConfig.pdfCategories.map((categoria) => {
                const esActiva = unidadActiva === categoria.id;
                return (
                  <button
                    key={categoria.id}
                    onClick={() => setUnidadActiva(categoria.id)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      esActiva
                        ? 'bg-[#111317] text-[#B8975B]'
                        : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {categoria.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cuadrícula de tarjetas PDF */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {actividadesFiltradas.map((actividad) => (
              <div
                key={actividad.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 flex flex-col justify-between gap-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-[#F7F5F0] text-[#8C6D37] flex-shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C6D37]">
                      {actividad.tag}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 leading-snug mt-0.5">
                      {actividad.titulo}
                    </h3>
                  </div>
                </div>

                {/* Botones de Ver y Descargar */}
                <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                  {/* BOTÓN VER PDF: No descarga nada; solo guarda esta 'actividad' en el estado
                      'pdfSeleccionado'. Al dejar de ser null, se abre la ventana modal de abajo. */}
                  <button
                    onClick={() => setPdfSeleccionado(actividad)}
                    className="flex-1 py-2.5 px-3 rounded-xl font-bold text-xs text-black bg-[#B8975B] hover:bg-[#a3834d] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Ver PDF</span>
                  </button>

                  {/* BOTÓN DESCARGAR PDF: No usa JavaScript, usa HTML puro:
                      1. href={actividad.pdfUrl} indica dónde está guardado el archivo (ej. en la carpeta /public).
                      2. El atributo 'download' le ordena al navegador descargar el archivo a la computadora
                         en lugar de abrirlo en otra pestaña. */}
                  <a
                    href={actividad.pdfUrl}
                    download
                    title="Descargar PDF"
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN 2: VISTA PREVIA DE LA PÁGINA EN VERCEL */}
      <section id="incremento" className="py-16 px-6 border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#B8975B]">02 • Sistema Funcional</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Kaffa Coffee Shop (Vercel)</h2>
            </div>

            {/* ENLACE EXTERNO: target="_blank" abre la web en una pestaña nueva del navegador.
                rel="noopener noreferrer" es una medida de seguridad estándar al abrir enlaces externos. */}
            <a
              href={siteConfig.drivelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex ml-100 items-center justify-center px-5 py-3 text-xs uppercase tracking-wider font-black rounded-xl text-black bg-[#B8975B] hover:bg-[#a3834d] transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Demostración en video
            </a>
            <a
              href={siteConfig.vercelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-5 py-3 text-xs uppercase tracking-wider font-black rounded-xl text-black bg-[#B8975B] hover:bg-[#a3834d] transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Abrir en pestaña nueva
            </a>
          </div>

          {/* Marco (iframe) que muestra la web externa dentro de esta página */}
          {/* CÓMO FUNCIONA LA VISTA PREVIA EXTERNA:
              La etiqueta HTML <iframe> crea una "ventana dentro de otra ventana".
              - src={siteConfig.vercelUrl}: carga la página real alojada en Vercel dentro de este recuadro.
              - loading="lazy": optimiza la página haciendo que el iframe cargue solo cuando el usuario
                baja hasta esta sección, evitando que la página inicial se vuelva lenta. */}
          <div className="rounded-2xl overflow-hidden border border-slate-800 bg-[#16181e]">
            <div className="px-4 py-2.5 bg-[#1c1f26] border-b border-slate-800 flex items-center gap-2 text-xs text-slate-400">
              <Globe className="w-3.5 h-3.5 text-[#B8975B]" />
              <span className="truncate">{siteConfig.vercelUrl}</span>
            </div>
            <div className="w-full h-[520px] bg-white">
              <iframe
                src={siteConfig.vercelUrl}
                title="Kaffa Coffee Shop - Incremento"
                className="w-full h-full border-0"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECCIONES 3 Y 4: DESCARGA ZIP Y EXPLORADOR DE GITHUB */}
      <section id="repositorio" className="py-16 bg-[#16181e] px-6 border-t border-slate-800">
        <div className="max-w-6xl mx-auto space-y-10">

          {/* Sección 3: Botones de descarga .ZIP */}
          <div
            id="codigo"
            className="p-6 rounded-2xl bg-[#111317] border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#B8975B]">03 • Código Fuente</span>
              <h3 className="text-xl font-black text-white mt-0.5">Paquetes Completos del Proyecto (.ZIP)</h3>
            </div>

            <div className="flex flex-wrap gap-3">
              {siteConfig.repositories.map((repo) => {
                // CÓMO SE DESCARGA EL .ZIP: GitHub tiene una ruta pública estándar para comprimir
                // cualquier repositorio público: /archive/refs/heads/[nombre-rama].zip
                // Al poner esa URL en un enlace <a>, GitHub empaqueta y descarga el código automáticamente.
                const urlZip = `https://github.com/${repo.owner}/${repo.repo}/archive/refs/heads/${repo.branch}.zip`;
                return (
                  <a
                    key={repo.id}
                    href={urlZip}
                    className="inline-flex items-center px-4 py-3 text-xs uppercase tracking-wider font-black rounded-xl text-black bg-[#B8975B] hover:bg-[#a3834d] transition-colors"
                  >
                    <Archive className="w-4 h-4 mr-2" />
                    {repo.label} (.ZIP)
                  </a>
                );
              })}
            </div>
          </div>

          {/* Sección 4: Explorador de carpetas y archivos de GitHub */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#B8975B]">04 • Trazabilidad</span>
                <h2 className="text-2xl sm:text-3xl font-black text-white">Repositorios en GitHub</h2>
              </div>

              {/* Pestañas para elegir Frontend o Backend */}
              {/* CÓMO FUNCIONA EL CAMBIO DE REPOSITORIO:
                  Recorremos 'siteConfig.repositories' con .map(). Al hacer clic en un botón,
                  llamamos a 'cambiarRepositorio(indice)', lo que actualiza 'indiceRepo' y reinicia
                  'rutaCarpeta' a ''. Eso dispara automáticamente el useEffect para traer el nuevo repo. */}
              <div className="flex flex-wrap items-center gap-2">
                {siteConfig.repositories.map((repo, indice) => {
                  const estaSeleccionado = indiceRepo === indice;
                  return (
                    <button
                      key={repo.id}
                      onClick={() => cambiarRepositorio(indice)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        estaSeleccionado
                          ? 'bg-[#B8975B] text-black'
                          : 'bg-[#111317] text-slate-300 border border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      {repo.label}
                    </button>
                  );
                })}

                <a
                  href={urlGitHub}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2.5 text-xs font-bold rounded-xl text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
                >
                  <GitBranch className="w-4 h-4 mr-1.5 text-[#B8975B]" />
                  GitHub ↗
                </a>
              </div>
            </div>

            {/* Caja del explorador de archivos */}
            <div className="rounded-2xl bg-[#111317] border border-slate-800 overflow-hidden">

              {/* Barra superior de ruta (Breadcrumbs) */}
              {/* CÓMO FUNCIONA LA BARRA DE RUTA INTERACTIVA:
                  Si 'rutaCarpeta' es "src/components/ui", .split('/') lo convierte en el arreglo
                  ["src", "components", "ui"]. Luego usamos .slice(0, index + 1).join('/') para
                  reconstruir la ruta hasta ese punto si el usuario hace clic en una carpeta intermedia. */}
              <div className="px-5 py-3 bg-[#1c1f26] border-b border-slate-800 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <button onClick={() => setRutaCarpeta('')} className="text-[#B8975B] font-bold hover:underline cursor-pointer">
                    {nombreRepo}
                  </button>

                  {/* Si estamos dentro de subcarpetas, mostramos cada nivel */}
                  {rutaCarpeta !== '' &&
                    rutaCarpeta.split('/').map((carpeta, index, arreglo) => {
                      const rutaAcumulada = arreglo.slice(0, index + 1).join('/');
                      return (
                        <React.Fragment key={rutaAcumulada}>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                          <button onClick={() => setRutaCarpeta(rutaAcumulada)} className="text-slate-300 hover:text-white cursor-pointer">
                            {carpeta}
                          </button>
                        </React.Fragment>
                      );
                    })}
                </div>

                {/* Botón "Atrás" solo aparece si no estamos en la carpeta raíz */}
                {rutaCarpeta !== '' && (
                  <button onClick={regresarCarpetaAnterior} className="flex items-center gap-1 text-slate-300 hover:text-[#B8975B] cursor-pointer">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Atrás</span>
                  </button>
                )}
              </div>

              {/* Lista de carpetas y archivos */}
              {/* CÓMO SE DIBUJA EL CONTENIDO DEL REPOSITORIO:
                  1. Si 'cargandoRepo' es true, muestra el mensaje de espera.
                  2. Si terminó de cargar pero hubo fallo ('errorRepo'), muestra el error.
                  3. Si todo salió bien, recorre 'archivosRepo' con .map() y distingue cada elemento:
                     - Si item.type === 'dir' (es carpeta): dibuja un ícono de carpeta y al darle clic
                       actualiza 'rutaCarpeta' con la ruta de esa carpeta (item.path), lo que vuelve a
                       ejecutar el useEffect para entrar en ella.
                     - Si no es carpeta (es archivo): dibuja un ícono de código y un enlace <a> hacia
                       'item.html_url' para abrir el código fuente directamente en GitHub. */}
              <div className="divide-y divide-slate-800/60">
                {cargandoRepo && (
                  <div className="p-8 text-center text-sm text-slate-400">Cargando archivos de {nombreRepo}...</div>
                )}

                {!cargandoRepo && errorRepo && (
                  <div className="p-8 text-center text-sm text-slate-400">{errorRepo}</div>
                )}

                {!cargandoRepo && !errorRepo && archivosRepo.map((item) => {
                  // GitHub entrega el peso en bytes; dividimos entre 1024 para mostrarlo en Kilobytes (KB)
                  const pesoEnKB = (item.size / 1024).toFixed(1);
                  return (
                    <div key={item.sha} className="px-5 py-3 flex items-center justify-between hover:bg-[#16181e]">
                      {item.type === 'dir' ? (
                        // Si es carpeta, al hacer clic entramos a ella
                        <button
                          onClick={() => setRutaCarpeta(item.path)}
                          className="flex items-center gap-2.5 text-sm font-medium text-white hover:text-[#B8975B] cursor-pointer"
                        >
                          <Folder className="w-4 h-4 text-[#B8975B]" />
                          <span>{item.name}</span>
                        </button>
                      ) : (
                        // Si es archivo, al hacer clic lo abre en GitHub
                        <a
                          href={item.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2.5 text-sm text-slate-300 hover:text-white"
                        >
                          <FileCode className="w-4 h-4 text-slate-500" />
                          <span>{item.name}</span>
                        </a>
                      )}

                      <span className="text-xs text-slate-500 font-mono">
                        {item.type === 'dir' ? 'Carpeta' : `${pesoEnKB} KB`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PIE DE PÁGINA */}
      <footer className="border-t border-slate-800 bg-[#08090b] py-6 px-6 text-center text-xs text-slate-500">
        {siteConfig.project.title} • {siteConfig.project.course}
      </footer>

      {/* VENTANA EMERGENTE (MODAL) PARA VER EL PDF */}
      {/* CÓMO FUNCIONA EL VISOR MODAL:
          1. Renderizado condicional: {pdfSeleccionado !== null && (...)} significa que todo este bloque
             solo existe en la página si hay un PDF seleccionado.
          2. 'fixed inset-0 z-50': fija el contenedor sobre toda la pantalla (top:0, bottom:0, left:0, right:0)
             y lo coloca por encima de todo lo demás (z-index: 50). */}
      {pdfSeleccionado !== null && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#16181e] border border-slate-700 rounded-2xl w-full max-w-5xl h-[88vh] flex flex-col overflow-hidden">

            {/* Encabezado de la ventana modal */}
            <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#B8975B]">{pdfSeleccionado.tag}</span>
                <h3 className="text-base font-bold text-white">{pdfSeleccionado.titulo}</h3>
              </div>
              <div className="flex items-center gap-2">
                {/* Botón de descarga directa dentro del modal usando el mismo atributo HTML 'download' */}
                <a
                  href={pdfSeleccionado.pdfUrl}
                  download
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-[#B8975B] text-black hover:bg-[#a3834d]"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar</span>
                </a>
                {/* Botón X: vuelve a poner 'pdfSeleccionado' en null para cerrar y ocultar esta ventana */}
                <button
                  onClick={() => setPdfSeleccionado(null)}
                  className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Visor del documento PDF */}
            {/* Al pasar la ruta de un archivo .pdf al atributo 'src' de un <iframe>, los navegadores
                modernos activan automáticamente su lector de PDF integrado para mostrar las páginas. */}
            <iframe src={pdfSeleccionado.pdfUrl} title={pdfSeleccionado.titulo} className="w-full flex-1 border-0 bg-slate-900" />
          </div>
        </div>
      )}
    </div>
  );
}
