<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { cars } from '../stores/carsStore.js'

const router = useRouter()

const searchQuery = ref('')
const sortKey = ref(null)
const sortDir = ref('asc')

function toggleSort(key) {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDir.value = 'asc'
  }
}

const filteredCars = computed(() => {
  let result = cars.value.filter((c) =>
    c.nombre.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
  if (sortKey.value) {
    result = [...result].sort((a, b) => {
      const valA = a[sortKey.value]
      const valB = b[sortKey.value]
      return sortDir.value === 'asc' ? valA - valB : valB - valA
    })
  }
  return result
})

// ===== Carousel =====
const carouselIndex = ref(0)

const totalCars = computed(() => cars.value.length)

watch(totalCars, (n) => {
  if (carouselIndex.value >= n) carouselIndex.value = Math.max(0, n - 1)
})

function carouselPrev() {
  if (totalCars.value === 0) return
  carouselIndex.value = (carouselIndex.value - 1 + totalCars.value) % totalCars.value
}

function carouselNext() {
  if (totalCars.value === 0) return
  carouselIndex.value = (carouselIndex.value + 1) % totalCars.value
}

function goToSlide(i) {
  carouselIndex.value = i
}

const stats = [
  { label: 'Autos disponibles', target: 3, suffix: '+' },
  { label: 'Clientes satisfechos', target: 500, suffix: '+' },
  { label: 'Años de experiencia', target: 15, suffix: '' },
]

const statDisplays = ref(stats.map(() => 0))

function animateCounter(index, target) {
  const duration = 1800
  const step = 16
  const increment = target / (duration / step)
  let current = 0
  const timer = setInterval(() => {
    current += increment
    if (current >= target) {
      current = target
      clearInterval(timer)
    }
    statDisplays.value[index] = Math.floor(current)
  }, step)
}

function goToDetail(id) {
  router.push({ name: 'car-detail', params: { id } })
}

onMounted(() => {
  // Animate counters when hero is visible
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          stats.forEach((s, i) => animateCounter(i, s.target))
          observer.disconnect()
        }
      })
    },
    { threshold: 0.4 },
  )
  const heroStats = document.querySelector('.hero-stats')
  if (heroStats) observer.observe(heroStats)

  // Fade-in on scroll for sections
  const fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    },
    { threshold: 0.1 },
  )
  document.querySelectorAll('.fade-in').forEach((el) => fadeObserver.observe(el))
})
</script>

<template>
  <div class="home">
    <!-- ===== HERO ===== -->
    <section class="hero">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <span class="hero-badge">Concesionario Premium</span>
        <h1 class="hero-title">
          Encuentra tu auto<br /><span class="accent">ideal</span> hoy
        </h1>
        <p class="hero-subtitle">
          Calidad, confianza y los mejores precios del mercado. Tu próximo vehículo te espera.
        </p>
        <div class="hero-actions">
          <a href="#autos" class="btn-primary">Ver autos disponibles</a>
          <a href="#contacto" class="btn-outline">Solicitar información</a>
        </div>
      </div>
      <div class="hero-stats">
        <div class="stat" v-for="(s, i) in stats" :key="s.label">
          <span class="stat-number">{{ statDisplays[i] }}{{ s.suffix }}</span>
          <span class="stat-label">{{ s.label }}</span>
        </div>
      </div>
    </section>

    <!-- ===== AUTOS DISPONIBLES ===== -->
    <section id="autos" class="cars-section">
      <div class="section-header fade-in">
        <span class="section-tag">Nuestro catálogo</span>
        <h2>Autos Disponibles</h2>
        <p>Haz clic en cualquier vehículo para ver todos sus detalles</p>
      </div>

      <div v-if="cars.length === 0" class="empty-state">
        No hay autos disponibles. Da de alta nuevos vehículos en el
        <RouterLink to="/admin">panel de administración</RouterLink>.
      </div>

      <div v-else class="carousel fade-in">
        <button
          class="carousel-arrow carousel-prev"
          aria-label="Anterior"
          @click="carouselPrev"
          :disabled="cars.length <= 1"
        >
          ‹
        </button>

        <div class="carousel-viewport">
          <div
            class="carousel-track"
            :style="{ transform: `translateX(-${carouselIndex * 100}%)` }"
          >
            <div v-for="car in cars" :key="car.id" class="carousel-slide">
              <div class="car-card" @click="goToDetail(car.id)">
                <div class="card-badge">{{ car.categoria }}</div>
                <div class="card-image">
                  <img :src="car.imagen" :alt="car.nombre" loading="lazy" />
                  <div class="card-hover-overlay">
                    <span>Ver detalle</span>
                  </div>
                </div>
                <div class="card-body">
                  <div class="card-meta">
                    <span class="card-year">{{ car.año }}</span>
                    <span class="card-fuel">{{ car.combustible }}</span>
                  </div>
                  <h3>{{ car.nombre }}</h3>
                  <p class="card-motor">{{ car.motor }} · {{ car.transmision }}</p>
                  <div class="card-footer">
                    <div class="card-price">
                      <span class="price-label">Precio</span>
                      <span class="price-value">${{ Number(car.precio).toLocaleString() }}</span>
                    </div>
                    <button class="btn-card">Ver detalle →</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          class="carousel-arrow carousel-next"
          aria-label="Siguiente"
          @click="carouselNext"
          :disabled="cars.length <= 1"
        >
          ›
        </button>

        <div class="carousel-dots">
          <button
            v-for="(car, i) in cars"
            :key="car.id"
            :class="['carousel-dot', i === carouselIndex && 'active']"
            :aria-label="`Ir al auto ${i + 1}`"
            @click="goToSlide(i)"
          ></button>
        </div>
      </div>
    </section>

    <!-- ===== TABLA DE PRECIOS ===== -->
    <section id="precios" class="prices-section fade-in">
      <div class="section-header">
        <span class="section-tag">Transparencia</span>
        <h2>Lista de Precios</h2>
        <p>Precios claros y sin sorpresas</p>
      </div>

      <div class="table-controls">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por nombre..."
            class="search-input"
          />
          <button v-if="searchQuery" class="search-clear" @click="searchQuery = ''">✕</button>
        </div>
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Vehículo</th>
              <th>Categoría</th>
              <th class="sortable" @click="toggleSort('año')">
                Año
                <span class="sort-icons">
                  <span :class="['sort-arrow', sortKey === 'año' && sortDir === 'asc' ? 'active' : '']">▲</span>
                  <span :class="['sort-arrow', sortKey === 'año' && sortDir === 'desc' ? 'active' : '']">▼</span>
                </span>
              </th>
              <th class="sortable" @click="toggleSort('precio')">
                Precio (USD)
                <span class="sort-icons">
                  <span :class="['sort-arrow', sortKey === 'precio' && sortDir === 'asc' ? 'active' : '']">▲</span>
                  <span :class="['sort-arrow', sortKey === 'precio' && sortDir === 'desc' ? 'active' : '']">▼</span>
                </span>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="car in filteredCars" :key="car.id" @click="goToDetail(car.id)">
              <td>
                <div class="table-car-name">
                  <img :src="car.imagen" :alt="car.nombre" class="table-thumb" />
                  <strong>{{ car.nombre }}</strong>
                </div>
              </td>
              <td><span class="table-badge">{{ car.categoria }}</span></td>
              <td>{{ car.año }}</td>
              <td class="price-cell">${{ Number(car.precio).toLocaleString() }}</td>
              <td><button class="btn-table">Ver →</button></td>
            </tr>
            <tr v-if="filteredCars.length === 0">
              <td colspan="5" class="no-results">No se encontraron autos con ese nombre</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- ===== FORMULARIO ===== -->
    <section id="contacto" class="form-section fade-in">
      <div class="form-inner">
        <div class="form-left">
          <span class="section-tag">Contáctanos</span>
          <h2>Solicitar información</h2>
          <p>
            ¿Tienes dudas sobre alguno de nuestros vehículos? Déjanos tus datos y uno de
            nuestros asesores te contactará a la brevedad.
          </p>
          <ul class="contact-list">
            <li>📞 +57 300 123 4567</li>
            <li>✉️ ventas@ventadeautos.com</li>
            <li>📍 Medellín, Colombia</li>
          </ul>
        </div>
        <form class="formulario" @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="nombre">Nombre completo</label>
            <input id="nombre" type="text" placeholder="Tu nombre" required />
          </div>
          <div class="form-group">
            <label for="correo">Correo electrónico</label>
            <input id="correo" type="email" placeholder="tu@email.com" required />
          </div>
          <div class="form-group">
            <label for="auto">Auto de interés</label>
            <select id="auto">
              <option value="">Selecciona un auto</option>
              <option v-for="car in cars" :key="car.id" :value="car.nombre">
                {{ car.nombre }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="mensaje">Mensaje (opcional)</label>
            <textarea id="mensaje" rows="3" placeholder="¿En qué podemos ayudarte?"></textarea>
          </div>
          <button type="submit" class="btn-submit">Enviar solicitud</button>
        </form>
      </div>
    </section>

    <!-- ===== FOOTER ===== -->
    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <span class="footer-logo">🚗 Venta de Autos</span>
          <p>Tu concesionario de confianza en Medellín</p>
        </div>
        <nav class="footer-nav">
          <a href="#">Inicio</a>
          <a href="#autos">Autos</a>
          <a href="#precios">Precios</a>
          <a href="#contacto">Contacto</a>
          <RouterLink to="/admin">Admin</RouterLink>
        </nav>
        <p class="footer-copy">© 2026 Venta de Autos. Todos los derechos reservados.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* ===== HERO ===== */
.hero {
  position: relative;
  min-height: 92vh;
  background: linear-gradient(135deg, #1a0f0a 0%, #2c1810 40%, #5a2d1a 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 80px 24px 60px;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 70% 50%, rgba(196, 151, 95, 0.15) 0%, transparent 60%);
  pointer-events: none;
}

.hero-badge {
  display: inline-block;
  background: rgba(196, 151, 95, 0.2);
  color: #c4975f;
  border: 1px solid rgba(196, 151, 95, 0.4);
  padding: 6px 18px;
  border-radius: 50px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 24px;
  animation: fadeDown 0.7s ease both;
}

.hero-title {
  font-size: clamp(2.4rem, 6vw, 4.5rem);
  font-weight: 800;
  color: #fff;
  line-height: 1.15;
  margin: 0 0 20px;
  animation: fadeDown 0.7s 0.15s ease both;
}

.hero-title .accent {
  color: #c4975f;
}

.hero-subtitle {
  font-size: 1.15rem;
  color: rgba(255, 255, 255, 0.7);
  max-width: 540px;
  margin: 0 auto 40px;
  line-height: 1.7;
  animation: fadeDown 0.7s 0.25s ease both;
}

.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  animation: fadeDown 0.7s 0.35s ease both;
}

.btn-primary {
  background: #c4975f;
  color: #fff;
  padding: 14px 32px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.95rem;
  transition: all 0.25s;
  box-shadow: 0 4px 20px rgba(196, 151, 95, 0.4);
}

.btn-primary:hover {
  background: #b3834a;
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(196, 151, 95, 0.5);
}

.btn-outline {
  background: transparent;
  color: #fff;
  padding: 14px 32px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  border: 1.5px solid rgba(255, 255, 255, 0.4);
  transition: all 0.25s;
}

.btn-outline:hover {
  border-color: #fff;
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
}

.hero-stats {
  display: flex;
  gap: 64px;
  margin-top: 64px;
  animation: fadeUp 0.8s 0.5s ease both;
}

.stat {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2.4rem;
  font-weight: 800;
  color: #c4975f;
  line-height: 1;
}

.stat-label {
  display: block;
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.55);
  margin-top: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* ===== CARS SECTION ===== */
.cars-section {
  padding: 96px 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 56px;
}

.section-tag {
  display: inline-block;
  background: #fdf0e6;
  color: #c4975f;
  padding: 5px 14px;
  border-radius: 50px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.section-header h2 {
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  font-weight: 800;
  color: #1a0f0a;
  margin: 0 0 12px;
}

.section-header p {
  color: #7a6a65;
  font-size: 1rem;
}

.cars-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 28px;
}

/* ===== CAROUSEL ===== */
.empty-state {
  text-align: center;
  padding: 48px 24px;
  color: #7a6a65;
  background: #fdf5ee;
  border: 1.5px dashed #e8ddd8;
  border-radius: 16px;
}

.empty-state a {
  color: #c4975f;
  font-weight: 700;
  text-decoration: none;
}

.empty-state a:hover {
  text-decoration: underline;
}

.carousel {
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 16px;
}

.carousel-viewport {
  overflow: hidden;
  border-radius: 20px;
}

.carousel-track {
  display: flex;
  transition: transform 0.5s cubic-bezier(0.22, 0.61, 0.36, 1);
  will-change: transform;
}

.carousel-slide {
  flex: 0 0 100%;
  min-width: 0;
  padding: 12px;
  box-sizing: border-box;
}

.carousel-slide .car-card {
  max-width: 520px;
  margin: 0 auto;
}

.carousel-arrow {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: #1a0f0a;
  color: #fff;
  font-size: 1.6rem;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, transform 0.2s;
  font-family: inherit;
  flex-shrink: 0;
}

.carousel-arrow:hover:not(:disabled) {
  background: #c4975f;
  transform: scale(1.08);
}

.carousel-arrow:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.carousel-dots {
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
}

.carousel-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  background: #e8ddd8;
  cursor: pointer;
  padding: 0;
  transition: all 0.2s;
}

.carousel-dot:hover {
  background: #c4975f;
}

.carousel-dot.active {
  background: #c4975f;
  width: 26px;
  border-radius: 50px;
}

.car-card {
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.07);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
}

.car-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.14);
}

.card-badge {
  position: absolute;
  top: 16px;
  left: 16px;
  background: #c4975f;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  padding: 4px 12px;
  border-radius: 50px;
  z-index: 2;
}

.card-image {
  position: relative;
  height: 220px;
  background: linear-gradient(160deg, #fdf5ee 0%, #f0e6d8 100%);
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 16px;
  transition: transform 0.4s ease;
}

.car-card:hover .card-image img {
  transform: scale(1.06);
}

.card-hover-overlay {
  position: absolute;
  inset: 0;
  background: rgba(26, 15, 10, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.card-hover-overlay span {
  color: #fff;
  font-size: 1.1rem;
  font-weight: 700;
  border: 2px solid #fff;
  padding: 10px 24px;
  border-radius: 50px;
}

.car-card:hover .card-hover-overlay {
  opacity: 1;
}

.card-body {
  padding: 20px 24px 24px;
}

.card-meta {
  display: flex;
  gap: 10px;
  margin-bottom: 8px;
}

.card-year,
.card-fuel {
  font-size: 12px;
  color: #9a8a85;
  background: #f5f0ed;
  padding: 3px 10px;
  border-radius: 50px;
  font-weight: 600;
}

.card-body h3 {
  font-size: 1.3rem;
  font-weight: 800;
  color: #1a0f0a;
  margin: 0 0 6px;
}

.card-motor {
  font-size: 0.85rem;
  color: #7a6a65;
  margin: 0 0 20px;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #f0e8e4;
  padding-top: 16px;
}

.price-label {
  display: block;
  font-size: 11px;
  color: #9a8a85;
  font-weight: 600;
  text-transform: uppercase;
}

.price-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 800;
  color: #c4975f;
}

.btn-card {
  background: #1a0f0a;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-card:hover {
  background: #c4975f;
}

/* ===== PRICES SECTION ===== */
.prices-section {
  background: #f8f5f3;
  padding: 96px 24px;
}

.prices-section .section-header {
  max-width: 1100px;
  margin: 0 auto 48px;
}

.table-controls {
  max-width: 1100px;
  margin: 0 auto 20px;
  display: flex;
  justify-content: flex-end;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
  background: #fff;
  border: 1.5px solid #e8ddd8;
  border-radius: 50px;
  padding: 0 16px;
  width: 280px;
  transition: border-color 0.2s;
}

.search-box:focus-within {
  border-color: #c4975f;
}

.search-icon {
  font-size: 14px;
  margin-right: 8px;
  pointer-events: none;
}

.search-input {
  border: none;
  background: transparent;
  padding: 10px 0;
  font-size: 14px;
  color: #1a0f0a;
  width: 100%;
  outline: none;
}

.search-input::placeholder {
  color: #b0a09a;
}

.search-clear {
  background: none;
  border: none;
  color: #b0a09a;
  cursor: pointer;
  font-size: 13px;
  padding: 0;
  line-height: 1;
  transition: color 0.2s;
}

.search-clear:hover {
  color: #1a0f0a;
}

.table-wrapper {
  max-width: 1100px;
  margin: 0 auto;
  overflow-x: auto;
  border-radius: 20px;
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.07);
}

table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
}

thead tr {
  background: #1a0f0a;
  color: #fff;
}

th {
  padding: 18px 24px;
  text-align: left;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  font-weight: 700;
}

th.sortable {
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
}

th.sortable:hover {
  background: #2c1810;
}

.sort-icons {
  display: inline-flex;
  flex-direction: column;
  margin-left: 6px;
  vertical-align: middle;
  gap: 1px;
}

.sort-arrow {
  font-size: 9px;
  color: rgba(255, 255, 255, 0.3);
  line-height: 1;
  transition: color 0.2s;
}

.sort-arrow.active {
  color: #c4975f;
}

.no-results {
  text-align: center;
  color: #9a8a85;
  padding: 40px 24px;
  font-size: 0.95rem;
}

tbody tr {
  border-bottom: 1px solid #f0e8e4;
  cursor: pointer;
  transition: background 0.2s;
}

tbody tr:hover {
  background: #fdf5ee;
}

td {
  padding: 18px 24px;
  font-size: 0.95rem;
  color: #3a2a25;
}

.table-car-name {
  display: flex;
  align-items: center;
  gap: 14px;
}

.table-thumb {
  width: 64px;
  height: 40px;
  object-fit: contain;
  background: #f5f0ed;
  border-radius: 8px;
  padding: 4px;
}

.table-badge {
  background: #fdf0e6;
  color: #c4975f;
  padding: 4px 12px;
  border-radius: 50px;
  font-size: 12px;
  font-weight: 700;
}

.price-cell {
  font-weight: 800;
  font-size: 1.05rem;
  color: #c4975f;
}

.btn-table {
  background: transparent;
  border: 1.5px solid #c4975f;
  color: #c4975f;
  padding: 7px 16px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-table:hover {
  background: #c4975f;
  color: #fff;
}

/* ===== FORM SECTION ===== */
.form-section {
  padding: 96px 24px;
  max-width: 1100px;
  margin: 0 auto;
}

.form-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: start;
}

.form-left h2 {
  font-size: 2rem;
  font-weight: 800;
  color: #1a0f0a;
  margin: 12px 0 16px;
}

.form-left p {
  color: #7a6a65;
  line-height: 1.7;
  margin-bottom: 28px;
}

.contact-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.contact-list li {
  color: #3a2a25;
  font-size: 0.95rem;
}

.formulario {
  background: #fff;
  padding: 40px;
  border-radius: 24px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.09);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-weight: 700;
  color: #1a0f0a;
  font-size: 14px;
  margin-bottom: 8px;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1.5px solid #e8ddd8;
  border-radius: 12px;
  font-size: 15px;
  font-family: inherit;
  color: #1a0f0a;
  background: #fafafa;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #c4975f;
  background: #fff;
}

.btn-submit {
  width: 100%;
  padding: 14px;
  background: #1a0f0a;
  color: #fff;
  border: none;
  border-radius: 50px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s;
  font-family: inherit;
}

.btn-submit:hover {
  background: #c4975f;
  transform: translateY(-1px);
}

/* ===== FOOTER ===== */
.footer {
  background: #1a0f0a;
  padding: 48px 24px;
}

.footer-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  text-align: center;
}

.footer-logo {
  font-size: 1.3rem;
  font-weight: 800;
  color: #c4975f;
}

.footer-brand p {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
  margin-top: 6px;
}

.footer-nav {
  display: flex;
  gap: 32px;
}

.footer-nav a {
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s;
}

.footer-nav a:hover {
  color: #c4975f;
}

.footer-copy {
  color: rgba(255, 255, 255, 0.3);
  font-size: 0.82rem;
}

/* ===== ANIMATIONS ===== */
@keyframes fadeDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}

.fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .hero-stats {
    gap: 32px;
  }

  .form-inner {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
}
</style>
