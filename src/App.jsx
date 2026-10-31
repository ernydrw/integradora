import React, { useState } from 'react';
import { siteConfig } from './siteConfig';
import {
  Menu, X, Sparkles, PhoneCall, Calendar, Send,
  HelpCircle, TrendingUp, Search, Eye, DollarSign,
  Mail, ArrowRight, ChevronDown, Check, ShieldCheck, Activity, Star
} from 'lucide-react';

const InstagramIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const IconMap = ({ name, className }) => {
  const icons = {
    TrendingUp, Search, Eye, DollarSign, ShieldCheck, Activity
  };
  const IconComponent = icons[name] || HelpCircle;
  return <IconComponent className={className} />;
};

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('todos');
  const [openFaq, setOpenFaq] = useState(null);

  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    mensaje: ''
  });

  const filteredServicios = activeCategory === 'todos'
    ? siteConfig.services
    : siteConfig.services.filter(item => item.categoria === activeCategory);

  const getWhatsAppLink = (customText) => {
    const text = customText || `¡Hola B2 Creative! Me gustaría agendar una sesión estratégica para platicar sobre el crecimiento de mi negocio.`;
    return `https://wa.me/${siteConfig.brand.whatsappNumber}?text=${encodeURIComponent(text)}`;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const mensajeWA = `¡Hola B2 Creative!\n*Nombre/Negocio:* ${formData.nombre}\n*Teléfono:* ${formData.telefono}\n*Consulta:* ${formData.mensaje}`;
    window.open(getWhatsAppLink(mensajeWA), '_blank');
  };

  return (
<div className="relative w-screen min-h-screen bg-[#111317] text-slate-100 font-sans antialiased selection:bg-[#B8975B] selection:text-black overflow-x-hidden left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
      {/* EFECTOS DE LUZ AMBIENTAL PREMIUM */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-[#B8975B]/10 rounded-full blur-[140px]"></div>
        <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-[#B8975B]/5 rounded-full blur-[160px]"></div>
      </div>

      <div className="relative z-10 w-full">

        {/* TOPBAR DE URGENCIA Y DISPONIBILIDAD */}
        <div className="bg-[#16181e] border-b border-slate-800 text-xs py-2.5 px-6 text-center text-slate-300 font-medium tracking-wide">
          <span className="inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#B8975B] animate-ping"></span>
            {siteConfig.brand.availabilityNotice}
          </span>
        </div>

        {/* HEADER / NAVEGACIÓN FIJA */}
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#111317]/90 border-b border-slate-800/80 shadow-2xl">
          <div className="w-full px-6 sm:px-12 lg:px-16 h-20 flex items-center justify-between">

            {/* Logo */}
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#B8975B] via-[#D4AF37] to-[#9E7E44] flex items-center justify-center font-black text-black text-xl shadow-lg shadow-[#B8975B]/20">
                B2
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-white">
                  {siteConfig.brand.name}<span className="text-[#B8975B]">{siteConfig.brand.nameHighlight}</span>
                </span>
                <span className="block text-[9px] tracking-[0.25em] text-slate-400 uppercase -mt-1 font-bold">Growth & Marketing</span>
              </div>
            </div>

            {/* Menú Desktop */}
            <nav className="hidden md:flex items-center space-x-8 text-xs uppercase tracking-widest font-bold text-slate-300">
              <a href="#diagnostico" className="hover:text-[#B8975B] transition-colors">Diagnóstico</a>
              <a href="#soluciones" className="hover:text-[#B8975B] transition-colors">Soluciones</a>
              <a href="#instagram" className="hover:text-[#B8975B] transition-colors">Instagram</a>
              <a href="#proceso" className="hover:text-[#B8975B] transition-colors">Metodología</a>
              <a href="#faq" className="hover:text-[#B8975B] transition-colors">FAQ</a>
            </nav>

            {/* CTA WhatsApp Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-5 py-2.5 text-xs uppercase tracking-widest font-black rounded-xl text-black bg-[#B8975B] hover:bg-[#a3834d] transition-all shadow-lg shadow-[#B8975B]/20 transform hover:-translate-y-0.5"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Agendar Sesión
              </a>
            </div>

            {/* Botón Menú Mobile */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-300 hover:text-[#B8975B] hover:bg-slate-800"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Menú Móvil Desplegable */}
          {mobileMenuOpen && (
            <div className="md:hidden border-b border-slate-800 bg-[#16181e] px-6 pt-3 pb-6 space-y-3 w-full">
              <a href="#diagnostico" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-semibold text-slate-300 hover:text-[#B8975B]">Diagnóstico</a>
              <a href="#soluciones" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-semibold text-slate-300 hover:text-[#B8975B]">Soluciones</a>
              <a href="#instagram" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-semibold text-slate-300 hover:text-[#B8975B]">Instagram</a>
              <a href="#proceso" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-semibold text-slate-300 hover:text-[#B8975B]">Metodología</a>
              <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-semibold text-slate-300 hover:text-[#B8975B]">FAQ</a>
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center mt-4 px-5 py-3 text-xs uppercase tracking-widest font-black rounded-xl text-black bg-[#B8975B]"
              >
                Agendar por WhatsApp 🚀
              </a>
            </div>
          )}
        </header>

        {/* SECCIÓN HERO LIMPIA Y ULTRA PROFESIONAL */}
                <section className="relative pt-28 pb-32 md:pt-40 md:pb-48 px-6 sm:px-12 lg:px-16 w-full text-center bg-[#111317] overflow-hidden">

                  {/* Resplandor decorativo central sutil */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#B8975B]/8 rounded-full blur-[160px] pointer-events-none"></div>

                  <div className="max-w-4xl mx-auto flex flex-col items-center relative z-10">

                    <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#B8975B]/10 border border-[#B8975B]/30 text-[#B8975B] text-xs font-bold tracking-[0.25em] uppercase mb-8 shadow-sm">
                      <Sparkles className="w-4 h-4 text-[#B8975B]" />
                      <span>{siteConfig.hero.badge}</span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.1] mb-8 text-white">
                      {siteConfig.hero.titleLine1} <br />
                      <span className="bg-gradient-to-r from-[#B8975B] via-[#E2C384] to-[#B8975B] bg-clip-text text-transparent">
                        {siteConfig.hero.titleHighlight}
                      </span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 font-normal leading-relaxed mb-12">
                      {siteConfig.hero.description}
                    </p>

                    <div className="mt-3 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto">
                      <a
                        href="#contacto"
                        className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-xs uppercase tracking-widest font-black rounded-2xl text-black bg-[#B8975B] hover:bg-[#a3834d] shadow-2xl shadow-[#B8975B]/30 transition-all transform hover:-translate-y-0.5"
                      >
                        {siteConfig.hero.ctaPrimaryText}
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </a>
                      <a
                        href="#soluciones"
                        className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-xs uppercase tracking-widest font-bold rounded-2xl text-slate-200 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-colors"
                      >
                        {siteConfig.hero.ctaSecondaryText}
                      </a>
                    </div>

                  </div>
                </section>

        {/* MÉTRICAS DE AUTORIDAD */}
        <section className="bg-[#16181e] border-y border-slate-800 py-12 px-6 sm:px-12 lg:px-16">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {siteConfig.metrics.map((metric, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-3xl sm:text-5xl font-black text-[#B8975B] tracking-tight">{metric.value}</div>
                <div className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">{metric.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* DIAGNÓSTICO DE DOLOR (Abre el apetito de solución) */}
        <section id="diagnostico" className="py-24 bg-[#111317] w-full px-6 sm:px-12 lg:px-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-left mb-16 max-w-3xl">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B8975B]">
                {siteConfig.hero.problemsHeader}
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-3 mb-4 tracking-tight">
                {siteConfig.hero.problemsTitle}
              </h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                {siteConfig.hero.problemsSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-[#B8975B]/30">
              {siteConfig.hero.highlights.map((item, idx) => (
                <div key={idx} className="p-8 rounded-3xl bg-[#16181e] border border-slate-800 hover:border-[#B8975B]/50 transition-all group shadow-lg">
                  <div className="w-12 h-12 rounded-2xl bg-[#B8975B]/10 flex items-center justify-center text-[#B8975B] mb-6 group-hover:bg-[#B8975B] group-hover:text-black transition-colors">
                    <IconMap name={item.icon} className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 p-8 rounded-3xl bg-[#16181e] border border-[#B8975B]/40 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
              <p className="text-base font-semibold text-[#B8975B]">
                {siteConfig.hero.problemsFooter}
              </p>
              <a href="#contacto" className="text-xs font-black uppercase tracking-widest text-black bg-[#B8975B] px-6 py-3.5 rounded-xl hover:bg-[#a3834d] transition-all whitespace-nowrap shadow-lg shadow-[#B8975B]/20">
                Solucionar Ahora
              </a>
            </div>
          </div>
        </section>

        {/* SOLUCIONES (Fondo elegante crema/claro para contraste visual y conversión) */}
        <section id="soluciones" className="py-24 bg-[#F7F5F0] text-slate-900 w-full px-6 sm:px-12 lg:px-16">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#8C6D37] bg-[#EBE7DF] px-4 py-1.5 rounded-full shadow-sm">
                PORTAFOLIO DE SERVICIOS
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-slate-900 mt-4 mb-4 tracking-tight">
                Soluciones diseñadas para escalar tus ventas
              </h2>
              <p className="text-slate-600 text-base sm:text-lg">
                Estrategias a la medida creadas para dominar tu sector y maximizar tu retorno de inversión.
              </p>
            </div>

            {/* Filtros de categoría */}
            <div className="flex flex-wrap justify-center gap-3 mb-14">
              {siteConfig.categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-6 py-3 rounded-full text-xs uppercase tracking-wider font-extrabold transition-all shadow-sm ${
                    activeCategory === cat.id
                      ? 'bg-[#111317] text-[#B8975B] shadow-lg scale-105'
                      : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Grid de servicios optimizado */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredServicios.map(item => (
                <div key={item.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group">
                  <div>
                    <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                      <img src={item.imagen} alt={item.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <span className="absolute top-4 right-4 bg-[#111317]/90 text-[#B8975B] text-xs font-bold px-3.5 py-1.5 rounded-full shadow-md">
                        {item.etiqueta}
                      </span>
                    </div>

                    <div className="p-8">
                      <h3 className="text-xl font-bold text-slate-900 mb-3">{item.nombre}</h3>
                      <p className="text-slate-600 text-sm leading-relaxed mb-6">{item.descripcion}</p>

                      <div className="space-y-2 pt-4 border-t border-slate-100">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Entregables clave:</span>
                        {item.entregables.map((entregable, i) => (
                          <div key={i} className="flex items-center text-xs text-slate-700 font-semibold">
                            <Check className="w-4 h-4 text-[#8C6D37] mr-2 flex-shrink-0" />
                            <span>{entregable}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="px-8 pb-8">
                    <a
                      href={getWhatsAppLink(`¡Hola B2 Creative! Me interesa cotizar y conocer más sobre la solución: ${item.nombre}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-4 px-4 rounded-xl font-black text-xs uppercase tracking-widest text-black bg-[#B8975B] hover:bg-[#a3834d] flex items-center justify-center space-x-2 transition-all shadow-md group-hover:shadow-lg"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Cotizar solución</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECCIÓN DEDICADA A INSTAGRAM (Tráfico directo al perfil) */}
        <section id="instagram" className="py-24 bg-[#16181e] text-white w-full px-6 sm:px-12 lg:px-16 border-t border-slate-800">
          <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-br from-[#1c1f26] to-[#12141a] p-10 sm:p-16 border border-[#B8975B]/40 shadow-2xl text-center space-y-8 relative overflow-hidden">

            <div className="absolute -top-24 -right-24 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 mx-auto flex items-center justify-center text-white shadow-xl shadow-pink-600/20">
              <InstagramIcon className="w-8 h-8" />
            </div>

            <div className="space-y-3 max-w-2xl mx-auto">
              <span className="text-xs font-black uppercase tracking-[0.25em] text-[#B8975B]">
                CONECTA CON NUESTRA COMUNIDAD
              </span>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                Mira nuestros casos diarios en <span className="text-[#B8975B]">Instagram</span>
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Publicamos detrás de cámaras, análisis de marcas y estrategias prácticas que puedes implementar hoy mismo en tu negocio.
              </p>
            </div>

            <div className="pt-2">
              <a
                href={siteConfig.brand.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-3 px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-white bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-95 shadow-2xl shadow-pink-600/30 transition-all transform hover:-translate-y-0.5"
              >
                <InstagramIcon className="w-5 h-5" />
                <span>Síguenos en {siteConfig.brand.instagramHandle} 🚀</span>
              </a>
            </div>

          </div>
        </section>

        {/* OBJETIVO / BENEFICIOS CLAVE */}
        <section id="objetivo" className="py-24 bg-[#111317] text-white w-full px-6 sm:px-12 lg:px-16 border-t border-slate-800">
          <div className="max-w-6xl mx-auto">
            <div className="text-left mb-16 max-w-3xl">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B8975B]">
                {siteConfig.whyUs.badge}
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white mt-3 tracking-tight">
                {siteConfig.whyUs.title}
              </h2>
              <p className="text-slate-400 text-sm sm:text-base mt-3">
                {siteConfig.whyUs.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-[#B8975B]/30">
              {siteConfig.whyUs.cards.map((card, idx) => (
                <div key={idx} className="p-8 rounded-3xl bg-[#16181e] border border-slate-800 hover:border-[#B8975B]/40 transition-colors shadow-lg">
                  <div className="w-12 h-12 rounded-2xl bg-[#B8975B]/10 flex items-center justify-center text-[#B8975B] mb-6">
                    <IconMap name={card.icon} className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{card.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* METODOLOGÍA */}
        <section id="proceso" className="py-24 bg-[#F7F5F0] text-slate-900 w-full px-6 sm:px-12 lg:px-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-left mb-16 max-w-3xl">
              <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#8C6D37]">
                {siteConfig.steps.badge}
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-slate-900 mt-3 tracking-tight">
                {siteConfig.steps.title}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-slate-300">
              {siteConfig.steps.list.map((stepItem, idx) => (
                <div key={idx} className="p-8 rounded-3xl bg-white border border-slate-200 shadow-md space-y-4">
                  <span className="text-6xl font-black text-[#B8975B] block">
                    {stepItem.step}
                  </span>
                  <h3 className="text-2xl font-bold text-slate-900">{stepItem.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{stepItem.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PREGUNTAS FRECUENTES (FAQ) */}
        <section id="faq" className="py-24 bg-[#111317] border-t border-slate-800 text-white w-full px-6 sm:px-12 lg:px-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B8975B]">RESOLVEMOS TUS DUDAS</span>
              <h2 className="text-3xl sm:text-5xl font-black text-white mt-3 tracking-tight">Preguntas Frecuentes</h2>
            </div>

            <div className="space-y-4">
              {siteConfig.faqs.map((faq, idx) => (
                <div key={idx} className="rounded-2xl bg-[#16181e] border border-slate-800 overflow-hidden shadow-md">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full p-6 text-left flex justify-between items-center font-bold text-base sm:text-lg text-white hover:text-[#B8975B] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-[#B8975B] transform transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaq === idx && (
                    <div className="px-6 pb-6 text-sm text-slate-400 leading-relaxed border-t border-slate-800/60 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BANNER PROMOCIONAL DE CIERRE */}
        {siteConfig.promo.active && (
          <section className="py-16 bg-[#16181e] text-white w-full px-6 sm:px-12 lg:px-16 border-t border-slate-800">
            <div className="max-w-5xl mx-auto rounded-3xl bg-[#181a20] p-8 sm:p-14 border border-[#B8975B]/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-left max-w-2xl">
                <span className="bg-[#B8975B] text-black text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                  {siteConfig.promo.badge}
                </span>
                <h3 className="text-3xl sm:text-4xl font-black mt-4 mb-3 text-white tracking-tight">
                  {siteConfig.promo.title}
                </h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  {siteConfig.promo.subtitle}
                </p>
              </div>
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="whitespace-nowrap px-8 py-4 text-xs font-black uppercase tracking-widest rounded-2xl bg-[#B8975B] text-black hover:bg-[#a3834d] shadow-2xl shadow-[#B8975B]/30 transition-all transform hover:-translate-y-0.5"
              >
                {siteConfig.promo.buttonText}
              </a>
            </div>
          </section>
        )}

        {/* SECCIÓN CONTACTO DIRECTO Y FORMULARIO DE CAPTURA */}
        <section id="contacto" className="py-24 bg-[#0c0d10] border-t border-slate-800 text-slate-100 w-full px-6 sm:px-12 lg:px-16">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B8975B]">SIGUIENTE PASO COMERCIAL</span>
                <h2 className="text-3xl sm:text-5xl font-black text-white mt-3 mb-4 tracking-tight">Hablemos de los objetivos de tu marca.</h2>
                <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                  Agendemos una reunión diagnóstica para explicarte a detalle cómo optimizar tu visibilidad y multiplicar tus prospectos en ventas. Cada día sin presencia fuerte es terreno ganado por tu competencia.
                </p>
              </div>

              <div className="space-y-4 pt-4">
                <div className="flex items-start space-x-4 p-5 rounded-2xl bg-[#16181e] border border-slate-800 shadow-md">
                  <PhoneCall className="w-6 h-6 text-[#B8975B] flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-white text-sm">WhatsApp Directo</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{siteConfig.brand.phoneDisplay}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-5 rounded-2xl bg-[#16181e] border border-slate-800 shadow-md">
                  <Mail className="w-6 h-6 text-[#B8975B] flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-white text-sm">Correo Electrónico</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{siteConfig.brand.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulario */}
            <div className="p-8 sm:p-10 rounded-3xl bg-[#16181e] border border-slate-800 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-2">Solicita tu diagnóstico gratuito</h3>
              <p className="text-xs text-slate-400 mb-6">Al dar clic en enviar, se abrirá tu WhatsApp con el mensaje estructurado automáticamente.</p>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Nombre o Negocio</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Carlos / Empresa ABC"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl bg-[#111317] border border-slate-800 text-white focus:outline-none focus:border-[#B8975B] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Teléfono / WhatsApp</label>
                  <input
                    type="tel"
                    required
                    placeholder="Ej. 33 1262 0089"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl bg-[#111317] border border-slate-800 text-white focus:outline-none focus:border-[#B8975B] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">¿Cuál es tu principal reto actual?</label>
                  <textarea
                    rows="3"
                    required
                    placeholder="Ej. Necesito captar más clientes y mejorar mis anuncios..."
                    value={formData.mensaje}
                    onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl bg-[#111317] border border-slate-800 text-white focus:outline-none focus:border-[#B8975B] text-sm"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full py-4 px-6 rounded-xl font-black text-xs uppercase tracking-widest text-black bg-[#B8975B] hover:bg-[#a3834d] shadow-xl shadow-[#B8975B]/20 flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <span>Enviar mensaje por WhatsApp</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

          </div>
        </section>

      </div>

      <footer className="relative z-10 border-t border-slate-800 bg-[#08090b] py-8 px-6 text-center text-xs text-slate-500 w-full">
        <p>© {new Date().getFullYear()} {siteConfig.brand.name}{siteConfig.brand.nameHighlight} - Agencia de Growth & Marketing. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
