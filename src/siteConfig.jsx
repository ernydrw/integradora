export const siteConfig = {
  project: {
    title: "Kaffa Coffee Shop",
    subtitle: "Portafolio de Evidencias e Incremento del Sistema",
  },

  // 1. PORTAFOLIO DE ACTIVIDADES (Coloca tus PDFs en public/pdfs/)
  pdfCategories: [
    { id: "todas", label: "Todas" },
    { id: "unidad3", label: "Unidad 3" },
    { id: "unidad4", label: "Unidad 4" }
  ],

  activities: [
    {
      id: 1,
      unidad: "unidad3",
      tag: "Unidad 3",
      titulo: "Actividad 1. Primera fase de desarrollo, revisión y ajuste de los Sprints",
      pdfUrl: "/pdfs/u3-actividad-1-primera-fase-sprints.pdf"
    },
    {
      id: 2,
      unidad: "unidad3",
      tag: "Unidad 3",
      titulo: "Actividad 2. Segunda fase de desarrollo, revisión y ajuste de los Sprints y el backlog",
      pdfUrl: "/pdfs/u3-actividad-2-segunda-fase-sprints-backlog.pdf"
    },
    {
      id: 3,
      unidad: "unidad3",
      tag: "Unidad 3",
      titulo: "Actividad 3. Tercera fase de desarrollo, revisión y ajuste de los Sprints y el backlog",
      pdfUrl: "/pdfs/u3-actividad-3-tercera-fase-sprints-backlog.pdf"
    },
    {
      id: 4,
      unidad: "unidad3",
      tag: "Unidad 3",
      titulo: "Actividad integradora. Producto final U3",
      pdfUrl: "/pdfs/u3-actividad-integradora-producto-final.pdf"
    },
    {
      id: 5,
      unidad: "unidad4",
      tag: "Unidad 4",
      titulo: "Actividad 1. Reunión de revisión inicial",
      pdfUrl: "/pdfs/u4-actividad-1-reunion-revision-inicial.pdf"
    },
    {
      id: 6,
      unidad: "unidad4",
      tag: "Unidad 4",
      titulo: "Actividad 2. Reunión para revisión de modificaciones",
      pdfUrl: "/pdfs/u4-actividad-2-reunion-revision-modificaciones.pdf"
    }
  ],

  // 2. INCREMENTO DEL SISTEMA (VERCEL)
  vercelUrl: "https://kaffa-coffee-shop.vercel.app/",
  drivelUrl: "https://drive.google.com/file/d/1L1SeH4BapyT2HrINRyqj8kwHpO3dYo-9/view?usp=drive_link",

  // 3 y 4. REPOSITORIOS GITHUB (FRONTEND Y BACKEND)
  repositories: [
    {
      id: "frontend",
      label: "Frontend (Web)",
      owner: "fernandacabrerag1994",
      repo: "kaffa-coffee-shop",
      branch: "main"
    },
    {
      id: "backend",
      label: "Backend (API)",
      owner: "fernandacabrerag1994",
      repo: "kaffa-backend",
      branch: "main"
    }
  ]
};
