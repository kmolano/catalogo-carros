# Venta de Autos – Resumen del Proyecto

**Proyecto estudiantil · Politécnico Grancolombiano**
Asignatura: Front End · Docente: Oscar Campos Porras · Grupo B03

---

## Tecnologías utilizadas

### Framework: Vue 3

El proyecto fue migrado desde HTML/CSS estático a **Vue 3** usando la **Composition API** con `<script setup>`. Esto permite organizar el código en componentes reutilizables y reactivos.

**Herramienta de build:** Vite 8 — servidor de desarrollo ultrarrápido con Hot Module Replacement (HMR).

---

## Uso de JavaScript

### Reactividad y estado
Se usaron las primitivas reactivas de Vue para manejar el estado de la interfaz:

```js
// Estado reactivo para búsqueda y ordenamiento
const searchQuery = ref('')
const sortKey = ref(null)
const sortDir = ref('asc')

// Lista filtrada y ordenada calculada automáticamente
const filteredCars = computed(() => {
  let result = cars.filter(c =>
    c.nombre.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
  if (sortKey.value) {
    result = [...result].sort((a, b) =>
      sortDir.value === 'asc' ? a[sortKey.value] - b[sortKey.value]
                              : b[sortKey.value] - a[sortKey.value]
    )
  }
  return result
})
```

### Animación de contadores (hero)
Al hacer scroll hasta la sección de estadísticas, los números se animan desde 0 hasta su valor final usando `setInterval`:

```js
function animateCounter(index, target) {
  const duration = 1800
  const increment = target / (duration / 16)
  let current = 0
  const timer = setInterval(() => {
    current += increment
    if (current >= target) { current = target; clearInterval(timer) }
    statDisplays.value[index] = Math.floor(current)
  }, 16)
}
```

### Animaciones de entrada al hacer scroll
Se usó la API nativa del navegador `IntersectionObserver` para detectar cuando los elementos entran al viewport y agregarles la clase `visible`, activando transiciones CSS:

```js
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible')
  })
}, { threshold: 0.1 })

document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el))
```

### Navegación entre páginas: Vue Router 4
Se configuró un router con 4 rutas para simular una aplicación multipágina (SPA):

| Ruta | Vista | Descripción |
|---|---|---|
| `/` | `HomeView` | Catálogo principal |
| `/auto/:id` | `CarDetailView` | Detalle del vehículo |
| `/auto/:id/comprar` | `ComprarView` | Formulario de compra |
| `/compra-exitosa` | `CompraExitosaView` | Confirmación de compra |

### Validación reactiva del formulario de compra
El botón "Confirmar compra" se habilita automáticamente cuando los 3 campos están llenos, sin necesidad de eventos manuales:

```js
const formValido = computed(
  () => nombre.value.trim() !== '' &&
        correo.value.trim() !== '' &&
        telefono.value.trim() !== ''
)
```

### Animación SVG en la confirmación
El ícono de check de la pantalla de compra exitosa es un SVG animado con `stroke-dashoffset` que dibuja el círculo y la palomita en secuencia mediante keyframes CSS.

---

## Mejoras visuales implementadas

### Diseño general
- **Paleta de colores premium**: café oscuro `#1a0f0a` como color principal y dorado cálido `#c4975f` como acento, coherente en toda la app.
- **Tipografía**: fuente Inter (sans-serif del sistema) con jerarquía clara entre títulos, subtítulos y cuerpo.
- **Espaciado generoso**: márgenes y paddings amplios que dan respiración al contenido.

### Hero section
- Fondo con gradiente oscuro multicapa y efecto de luz radial sutil.
- Título con palabra clave en color acento dorado.
- Botones estilo "pill" con efecto `translateY` al hacer hover.
- Estadísticas animadas (contadores JS) al entrar al viewport.
- Animaciones de entrada escalonadas (`fadeDown` con `animation-delay`).

### Tarjetas de autos
- Imagen con fondo degradado crema que cambia de escala al hover (`transform: scale(1.06)`).
- Overlay oscuro semitransparente con texto "Ver detalle" al pasar el cursor.
- Badge de categoría superpuesto en la imagen.
- Sombra que se intensifica al hacer hover (`box-shadow`).
- Chips de año y tipo de combustible.

### Tabla de precios
- Encabezado con fondo oscuro `#1a0f0a` y texto en mayúsculas.
- Miniaturas del auto dentro de cada fila.
- Chips de categoría con color dorado.
- Filas con efecto hover y precio destacado en dorado.
- Buscador por nombre con diseño "pill" y botón de limpiar.
- Columnas ordenables (año/precio) con flechas indicadoras activas.

### Formulario de contacto
- Layout de dos columnas: info a la izquierda, formulario a la derecha.
- Inputs con borde que cambia a dorado al recibir foco.
- Botón de envío con transición de color y efecto de elevación.

### Página de detalle
- Navbar sticky con efecto `backdrop-filter: blur`.
- Imagen del auto con animación de fade-in al cargar (`opacity` + `translateY`).
- Tabs interactivos (Especificaciones / Características / Colores) con indicador animado.
- Cards de especificaciones con borde dorado al hover.
- Dos botones de acción: "Solicitar cotización" (dorado) y "Comprar" (blanco).

### Flujo de compra
- **Formulario**: campos que se vuelven verdes al ser completados (`border-color: #4caf50`).
- **Barra de progreso**: gradiente de dorado a verde que avanza con cada campo llenado.
- **Botón deshabilitado**: color gris con cursor `not-allowed` hasta completar el formulario.
- **Pantalla de éxito**: animación SVG del check dibujándose, tarjetas de info con número de referencia único, y lista de pasos siguientes.

---

*Proyecto desarrollado para la asignatura Front End · 2026*
