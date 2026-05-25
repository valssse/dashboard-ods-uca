// ═══════════════════════════════════════════════════
//  DATA: Investigación Cuidadores y Productos
//  Fuente: Reddit (r/Alzheimers, r/GenX, r/dementia)
//          + Reseñas Mercado Libre México
// ═══════════════════════════════════════════════════

export const metaCuidadores = {
  proyecto: 'Biomaterial Biobasado — Fase Empatizar',
  institucion: 'UCA El Salvador',
  autor: 'Valsse',
  año: 2025,
  nota: 'No se encontraron testimonios directos de El Salvador en esta ronda. Todos los datos corresponden a Latinoamérica general. Se recomienda una segunda ronda en grupos de Facebook específicos de El Salvador.',
};

export const categoriasDolor = [
  { id: 'higiene',    label: 'Higiene y autonomía',   color: '#FF8400', icon: 'sanitizer' },
  { id: 'movilidad',  label: 'Movilidad física',       color: '#B2B2FF', icon: 'accessible' },
  { id: 'expectativas', label: 'Expectativas y adaptación', color: '#B6FFCE', icon: 'sync' },
  { id: 'cognitivo',  label: 'Deterioro cognitivo',    color: '#FF5C33', icon: 'psychology' },
  { id: 'carga',      label: 'Carga del cuidador',     color: '#FFD700', icon: 'balance' },
];

export const testimonios = [
  {
    id: 1,
    fecha: 'Hace 7 meses',
    fuente: 'r/Alzheimers — Reddit',
    usuario: 'cskingley',
    pais: 'Latinoamérica',
    categoriaId: 'carga',
    testimonio: 'Tengo 62 años y mi mamá tiene 82. Mi hermano, mi hermana y yo nos turnamos para ayudarla, así que no es todo sobre una sola persona.',
    dolor: 'Carga compartida del cuidado — sistema de turnos como mecanismo de supervivencia.',
  },
  {
    id: 2,
    fecha: 'Hace 7 meses',
    fuente: 'r/Alzheimers — Reddit',
    usuario: 'DependentDeal0',
    pais: 'Latinoamérica',
    categoriaId: 'higiene',
    testimonio: 'Mi esposa, de 63 años, tiene Alzheimer de inicio temprano desde hace casi 6 años. No puede vestirse, bañarse. Come con los dedos y es incontinente.',
    dolor: 'Pérdida total de autonomía en tareas básicas de aseo e higiene personal.',
  },
  {
    id: 3,
    fecha: 'Hace 10 meses',
    fuente: 'r/GenX — Reddit',
    usuario: 'PatchouliHedge',
    pais: 'Latinoamérica',
    categoriaId: 'movilidad',
    testimonio: 'No son inválidos totales, pero ya no pueden subir escaleras al segundo piso de su casa.',
    dolor: 'Movilidad reducida — la casa no está adaptada a las limitaciones físicas del anciano.',
  },
  {
    id: 4,
    fecha: 'Hace 5 meses',
    fuente: 'r/GenX — Reddit',
    usuario: 'JacenWW5',
    pais: 'Latinoamérica',
    categoriaId: 'expectativas',
    testimonio: 'Le corté el césped gratis durante años cada dos semanas, pero se queja sin parar del cuidado de sus flores y jardín. Su esposo falleció y ella no puede, pero mantiene los niveles de expectativa como si ambos todavía lo estuvieran haciendo.',
    dolor: 'El anciano mantiene expectativas de su vida anterior sin adaptarse a sus limitaciones actuales.',
  },
  {
    id: 5,
    fecha: 'Hace 1 año',
    fuente: 'r/dementia — Reddit',
    usuario: 'Mozartrelle',
    pais: 'Latinoamérica',
    categoriaId: 'higiene',
    testimonio: 'Las llamadas, el sundowning y las cosas perdidas, pero al menos no tengo que ir a su casa todos los días y tratar con la ropa sucia por incontinencia y la comida podrida y todo asqueroso.',
    dolor: 'Objetos perdidos constantemente + higiene deteriorada — dos de los mayores generadores de crisis cotidianas.',
  },
  {
    id: 6,
    fecha: 'Hace 1 año',
    fuente: 'r/dementia — Reddit',
    usuario: 'Narrow-Natural7937',
    pais: 'Latinoamérica',
    categoriaId: 'cognitivo',
    testimonio: 'Era un matemático e ingeniero brillante y ahora, a los 82 años, no puede cambiar el canal de la tele.',
    dolor: 'Pérdida de autonomía en tareas mínimas — el contraste con la vida anterior intensifica el duelo.',
  },
];

export const tiposProducto = [
  { id: 'andadera',    label: 'Andadera / Silla de ruedas', color: '#FF8400', icon: 'accessible' },
  { id: 'panal',       label: 'Pañal para adulto',          color: '#B2B2FF', icon: 'water_drop' },
  { id: 'bano',        label: 'Silla de baño',              color: '#B6FFCE', icon: 'shower' },
];

export const reseñasProductos = [
  {
    id: 1,
    producto: 'Andadera Ortopédica 2 en 1 — Silla de Ruedas Plegable',
    tipoId: 'andadera',
    plataforma: 'Mercado Libre',
    pais: 'México',
    calificacion: 4,
    resena: 'En comparación a su precio está bien, pero es para tenerla dentro de casa o de paseo al centro comercial; sus llantas se atoran mucho, el mecanismo para replegarla se rompió muy fácil.',
    falla: 'Durabilidad deficiente en partes móviles — mecanismo plegable frágil.',
  },
  {
    id: 2,
    producto: 'Andadera Ortopédica 2 en 1 — Silla de Ruedas Plegable',
    tipoId: 'andadera',
    plataforma: 'Mercado Libre',
    pais: 'México',
    calificacion: 5,
    resena: 'Está muy bien la andadera, es alta o para mi estatura me pareció muy bien, la silla es angosta pero muy útil; como silla de ruedas a veces es difícil de maniobrar pero sí funciona.',
    falla: 'Maniobrabilidad limitada — el usuario acepta el defecto por falta de mejores opciones.',
  },
  {
    id: 3,
    producto: 'Andadera Ortopédica 2 en 1 — Silla de Ruedas Plegable',
    tipoId: 'andadera',
    plataforma: 'Mercado Libre',
    pais: 'México',
    calificacion: 5,
    resena: 'La silla es de una excelente calidad en materiales, liviana, fácil de armar y de usar, se transporta fácil y es cómoda.',
    falla: 'Referencia positiva — ligereza y facilidad de uso son los atributos más valorados.',
  },
  {
    id: 4,
    producto: 'Andadera Ortopédica 2 en 1 — Silla de Ruedas Plegable',
    tipoId: 'andadera',
    plataforma: 'Mercado Libre',
    pais: 'México',
    calificacion: 5,
    resena: 'Muy cómodo, tiene para 4 alturas, está súper práctico.',
    falla: 'La ajustabilidad en altura es un atributo muy valorado por este segmento.',
  },
  {
    id: 5,
    producto: 'Andadera Ortopédica 2 en 1 — Silla de Ruedas Plegable',
    tipoId: 'andadera',
    plataforma: 'Mercado Libre',
    pais: 'México',
    calificacion: 4,
    resena: 'En general es funcional para las necesidades de un ancianito, solo me gustaría que adicionaran la opción de colocar frenos candadeados para cuando se tenga que sentar la persona.',
    falla: 'El freno requiere fuerza constante — necesidad de mecanismo pasivo sin esfuerzo.',
  },
  {
    id: 6,
    producto: 'Andadera Ortopédica Adulto — Asiento Silla Plegable Ajustable ShopMall',
    tipoId: 'andadera',
    plataforma: 'Mercado Libre',
    pais: 'México',
    calificacion: 1,
    resena: 'Faltó una tuerca para ajustar manubrio. Está mal ensamblado por lo tanto no frena bien. Quiero un cambio del mismo producto.',
    falla: 'Control de calidad deficiente — producto de seguridad que llega defectuoso genera riesgo real.',
  },
  {
    id: 7,
    producto: 'Pañal Para Adulto Protect Talla Mediano Unisex',
    tipoId: 'panal',
    plataforma: 'Mercado Libre',
    pais: 'México',
    calificacion: 1,
    resena: 'Pésimos broches adheribles, pobre absorción, se escurre, no gelatiniza rápido. No volveré a comprar.',
    falla: 'Falla en función principal — broches sin agarre y absorción deficiente.',
  },
  {
    id: 8,
    producto: 'Silla Para Baño Cómodo Onof — Asiento Para Ducha Plegable',
    tipoId: 'bano',
    plataforma: 'Mercado Libre',
    pais: 'México',
    calificacion: 5,
    resena: 'Cumple con su función de baño. Como andadera no, porque no tiene un soporte que lo mantenga estable, pero para baño está excelente.',
    falla: 'Inestabilidad como andadera — el problema más peligroso para un adulto mayor.',
  },
];
