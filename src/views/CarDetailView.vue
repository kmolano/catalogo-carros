<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { cars } from '../stores/carsStore.js'

const route = useRoute()
const router = useRouter()

const car = computed(() => cars.value.find((c) => c.id === Number(route.params.id)))
const otherCars = computed(() => cars.value.filter((c) => c.id !== Number(route.params.id)))

const imageLoaded = ref(false)
const activeTab = ref('specs')

function goBack() {
  router.push({ name: 'home' })
}

function goToCar(id) {
  router.push({ name: 'car-detail', params: { id } })
}

onMounted(() => {
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
  <div v-if="car" class="detail-page">
    <!-- NAVBAR -->
    <nav class="detail-nav">
      <button class="back-btn" @click="goBack">
        <span class="back-arrow">←</span> Volver al catálogo
      </button>
      <span class="nav-brand">🚗 Venta de Autos</span>
      <span class="nav-crumb">{{ car.nombre }}</span>
    </nav>

    <!-- HERO DETAIL -->
    <section class="detail-hero">
      <div class="detail-hero-inner">
        <div class="detail-image-wrap fade-in">
          <div class="detail-category-badge">{{ car.categoria }}</div>
          <img
            :src="car.imagen"
            :alt="car.nombre"
            :class="{ loaded: imageLoaded }"
            @load="imageLoaded = true"
          />
        </div>

        <div class="detail-info fade-in">
          <div class="detail-year">{{ car.año }}</div>
          <h1>{{ car.nombre }}</h1>
          <p class="detail-desc">{{ car.descripcion }}</p>

          <div class="detail-price-box">
            <div>
              <span class="price-hint">Precio de lista</span>
              <span class="detail-price">${{ car.precio.toLocaleString() }}</span>
            </div>
            <div class="detail-actions">
              <a href="#contacto-detalle" class="btn-contact">Solicitar cotización</a>
              <button class="btn-buy" @click="router.push({ name: 'comprar', params: { id: car.id } })">Comprar</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- TABS -->
    <section class="tabs-section fade-in">
      <div class="tabs-header">
        <button
          :class="['tab-btn', activeTab === 'specs' && 'active']"
          @click="activeTab = 'specs'"
        >
          Especificaciones
        </button>
        <button
          :class="['tab-btn', activeTab === 'features' && 'active']"
          @click="activeTab = 'features'"
        >
          Características
        </button>
        <button
          :class="['tab-btn', activeTab === 'colors' && 'active']"
          @click="activeTab = 'colors'"
        >
          Colores
        </button>
      </div>

      <div class="tab-content">
        <!-- SPECS -->
        <div v-show="activeTab === 'specs'" class="specs-grid">
          <div class="spec-card">
            <span class="spec-icon">⚙️</span>
            <span class="spec-label">Motor</span>
            <span class="spec-value">{{ car.motor }}</span>
          </div>
          <div class="spec-card">
            <span class="spec-icon">⚡</span>
            <span class="spec-label">Potencia</span>
            <span class="spec-value">{{ car.potencia }}</span>
          </div>
          <div class="spec-card">
            <span class="spec-icon">🔧</span>
            <span class="spec-label">Transmisión</span>
            <span class="spec-value">{{ car.transmision }}</span>
          </div>
          <div class="spec-card">
            <span class="spec-icon">⛽</span>
            <span class="spec-label">Combustible</span>
            <span class="spec-value">{{ car.combustible }}</span>
          </div>
          <div class="spec-card">
            <span class="spec-icon">🛞</span>
            <span class="spec-label">Tracción</span>
            <span class="spec-value">{{ car.traccion }}</span>
          </div>
          <div class="spec-card">
            <span class="spec-icon">🚪</span>
            <span class="spec-label">Puertas</span>
            <span class="spec-value">{{ car.puertas }}</span>
          </div>
          <div class="spec-card">
            <span class="spec-icon">📅</span>
            <span class="spec-label">Año</span>
            <span class="spec-value">{{ car.año }}</span>
          </div>
          <div class="spec-card">
            <span class="spec-icon">🏷️</span>
            <span class="spec-label">Kilometraje</span>
            <span class="spec-value">{{ car.km }}</span>
          </div>
        </div>

        <!-- FEATURES -->
        <div v-show="activeTab === 'features'" class="features-list">
          <div v-for="(feat, i) in car.caracteristicas" :key="i" class="feature-item">
            <span class="feature-check">✓</span>
            <span>{{ feat }}</span>
          </div>
        </div>

        <!-- COLORS -->
        <div v-show="activeTab === 'colors'" class="colors-list">
          <div v-for="color in car.colores" :key="color" class="color-item">
            <span class="color-dot"></span>
            <span>{{ color }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- CONTACT FORM -->
    <section id="contacto-detalle" class="detail-form-section fade-in">
      <div class="section-header">
        <span class="section-tag">¿Te interesa?</span>
        <h2>Cotiza el {{ car.nombre }}</h2>
        <p>Déjanos tus datos y te contactamos con la mejor oferta</p>
      </div>
      <form class="detail-form" @submit.prevent>
        <div class="form-row">
          <div class="form-group">
            <label>Nombre completo</label>
            <input type="text" placeholder="Tu nombre" />
          </div>
          <div class="form-group">
            <label>Correo electrónico</label>
            <input type="email" placeholder="tu@email.com" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Teléfono</label>
            <input type="tel" placeholder="+57 300 000 0000" />
          </div>
          <div class="form-group">
            <label>Auto de interés</label>
            <input type="text" :value="car.nombre" readonly />
          </div>
        </div>
        <div class="form-group">
          <label>Mensaje</label>
          <textarea rows="3" placeholder="¿Tienes alguna pregunta específica?"></textarea>
        </div>
        <button type="submit" class="btn-submit-detail">Enviar cotización</button>
      </form>
    </section>

    <!-- OTROS AUTOS -->
    <section class="other-cars fade-in">
      <div class="section-header">
        <span class="section-tag">Catálogo</span>
        <h2>Otros vehículos</h2>
      </div>
      <div class="other-grid">
        <div
          v-for="other in otherCars"
          :key="other.id"
          class="other-card"
          @click="goToCar(other.id)"
        >
          <div class="other-img">
            <img :src="other.imagen" :alt="other.nombre" />
          </div>
          <div class="other-info">
            <span class="other-cat">{{ other.categoria }}</span>
            <h4>{{ other.nombre }}</h4>
            <span class="other-price">${{ other.precio.toLocaleString() }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="footer">
      <div class="footer-inner">
        <span class="footer-logo">🚗 Venta de Autos</span>
        <p class="footer-copy">© 2026 Venta de Autos. Todos los derechos reservados.</p>
      </div>
    </footer>
  </div>

  <!-- NOT FOUND -->
  <div v-else class="not-found">
    <h2>Auto no encontrado</h2>
    <button @click="goBack" class="btn-primary">Volver al inicio</button>
  </div>
</template>

<style scoped>
/* ===== NAV ===== */
.detail-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(26, 15, 10, 0.97);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 32px;
  border-bottom: 1px solid rgba(196, 151, 95, 0.2);
}

.back-btn {
  background: transparent;
  color: rgba(255, 255, 255, 0.8);
  border: 1.5px solid rgba(255, 255, 255, 0.2);
  padding: 8px 18px;
  border-radius: 50px;
  cursor: pointer;
  font-size: 0.88rem;
  font-weight: 600;
  font-family: inherit;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}

.back-btn:hover {
  border-color: #c4975f;
  color: #c4975f;
}

.back-arrow {
  font-size: 1.1rem;
}

.nav-brand {
  font-size: 1.1rem;
  font-weight: 800;
  color: #c4975f;
}

.nav-crumb {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.4);
}

/* ===== HERO DETAIL ===== */
.detail-hero {
  background: linear-gradient(160deg, #1a0f0a 0%, #2c1810 60%, #3d2010 100%);
  padding: 80px 32px;
}

.detail-hero-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
}

.detail-image-wrap {
  position: relative;
  background: linear-gradient(135deg, rgba(196, 151, 95, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  border-radius: 24px;
  overflow: hidden;
  padding: 32px;
  border: 1px solid rgba(196, 151, 95, 0.15);
}

.detail-category-badge {
  position: absolute;
  top: 16px;
  left: 16px;
  background: #c4975f;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  padding: 5px 14px;
  border-radius: 50px;
}

.detail-image-wrap img {
  width: 100%;
  height: 280px;
  object-fit: contain;
  opacity: 0;
  transition: opacity 0.5s ease, transform 0.5s ease;
  transform: translateY(10px);
}

.detail-image-wrap img.loaded {
  opacity: 1;
  transform: translateY(0);
}

.detail-info .detail-year {
  display: inline-block;
  background: rgba(196, 151, 95, 0.15);
  color: #c4975f;
  padding: 5px 14px;
  border-radius: 50px;
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 16px;
}

.detail-info h1 {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 900;
  color: #fff;
  margin: 0 0 20px;
  line-height: 1.1;
}

.detail-desc {
  color: rgba(255, 255, 255, 0.65);
  line-height: 1.75;
  font-size: 0.95rem;
  margin-bottom: 36px;
}

.detail-price-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(196, 151, 95, 0.25);
  border-radius: 16px;
  padding: 20px 24px;
  gap: 16px;
}

.price-hint {
  display: block;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.detail-price {
  font-size: 2rem;
  font-weight: 900;
  color: #c4975f;
}

.detail-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.btn-contact {
  background: #c4975f;
  color: #fff;
  text-decoration: none;
  padding: 13px 28px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 0.9rem;
  white-space: nowrap;
  transition: all 0.25s;
}

.btn-contact:hover {
  background: #b3834a;
  transform: translateY(-2px);
}

.btn-buy {
  background: #fff;
  color: #1a0f0a;
  border: 2px solid #fff;
  padding: 13px 28px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 0.9rem;
  white-space: nowrap;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.25s;
}

.btn-buy:hover {
  background: transparent;
  color: #fff;
  transform: translateY(-2px);
}

/* ===== TABS ===== */
.tabs-section {
  max-width: 1100px;
  margin: 0 auto;
  padding: 80px 32px;
}

.tabs-header {
  display: flex;
  gap: 8px;
  border-bottom: 2px solid #f0e8e4;
  margin-bottom: 40px;
}

.tab-btn {
  background: transparent;
  border: none;
  padding: 12px 24px;
  font-size: 0.95rem;
  font-weight: 700;
  color: #9a8a85;
  cursor: pointer;
  font-family: inherit;
  border-bottom: 3px solid transparent;
  margin-bottom: -2px;
  transition: all 0.2s;
}

.tab-btn.active {
  color: #1a0f0a;
  border-bottom-color: #c4975f;
}

.tab-btn:hover:not(.active) {
  color: #5a463f;
}

.specs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}

.spec-card {
  background: #fff;
  border: 1.5px solid #f0e8e4;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.spec-card:hover {
  border-color: #c4975f;
  box-shadow: 0 4px 16px rgba(196, 151, 95, 0.12);
}

.spec-icon {
  font-size: 1.4rem;
}

.spec-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #9a8a85;
  font-weight: 700;
}

.spec-value {
  font-size: 0.95rem;
  font-weight: 700;
  color: #1a0f0a;
}

.features-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fff;
  border: 1.5px solid #f0e8e4;
  padding: 14px 18px;
  border-radius: 12px;
  font-size: 0.95rem;
  color: #3a2a25;
  font-weight: 500;
  transition: border-color 0.2s;
}

.feature-item:hover {
  border-color: #c4975f;
}

.feature-check {
  color: #c4975f;
  font-weight: 900;
  font-size: 1rem;
}

.colors-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.color-item {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  border: 1.5px solid #f0e8e4;
  padding: 12px 20px;
  border-radius: 50px;
  font-size: 0.92rem;
  font-weight: 600;
  color: #3a2a25;
  transition: border-color 0.2s;
}

.color-item:hover {
  border-color: #c4975f;
}

.color-dot {
  width: 14px;
  height: 14px;
  background: linear-gradient(135deg, #c4975f, #5a463f);
  border-radius: 50%;
}

/* ===== DETAIL FORM ===== */
.detail-form-section {
  background: #f8f5f3;
  padding: 80px 32px;
}

.detail-form-section .section-header {
  text-align: center;
  margin-bottom: 48px;
}

.section-header h2 {
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  font-weight: 800;
  color: #1a0f0a;
  margin: 8px 0 12px;
}

.section-header p {
  color: #7a6a65;
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
}

.detail-form {
  max-width: 800px;
  margin: 0 auto;
  background: #fff;
  padding: 40px;
  border-radius: 24px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.08);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
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
.form-group textarea:focus {
  outline: none;
  border-color: #c4975f;
  background: #fff;
}

.form-group input[readonly] {
  background: #f5f0ed;
  color: #7a6a65;
}

.btn-submit-detail {
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

.btn-submit-detail:hover {
  background: #c4975f;
  transform: translateY(-1px);
}

/* ===== OTHER CARS ===== */
.other-cars {
  max-width: 1100px;
  margin: 0 auto;
  padding: 80px 32px;
}

.other-cars .section-header {
  text-align: center;
  margin-bottom: 40px;
}

.other-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.other-card {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  border: 1.5px solid #f0e8e4;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0;
}

.other-card:hover {
  border-color: #c4975f;
  box-shadow: 0 8px 32px rgba(196, 151, 95, 0.15);
  transform: translateY(-4px);
}

.other-img {
  width: 120px;
  min-width: 120px;
  height: 90px;
  background: linear-gradient(135deg, #fdf5ee, #f0e6d8);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
}

.other-img img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.other-info {
  padding: 16px;
  flex: 1;
}

.other-cat {
  font-size: 11px;
  color: #c4975f;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.other-info h4 {
  font-size: 1rem;
  font-weight: 800;
  color: #1a0f0a;
  margin: 4px 0 6px;
}

.other-price {
  font-size: 1.05rem;
  font-weight: 700;
  color: #c4975f;
}

/* ===== FOOTER ===== */
.footer {
  background: #1a0f0a;
  padding: 32px;
  text-align: center;
}

.footer-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.footer-logo {
  font-size: 1.15rem;
  font-weight: 800;
  color: #c4975f;
}

.footer-copy {
  color: rgba(255, 255, 255, 0.3);
  font-size: 0.82rem;
}

/* ===== NOT FOUND ===== */
.not-found {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
}

.not-found h2 {
  font-size: 1.8rem;
  color: #1a0f0a;
}

.btn-primary {
  background: #c4975f;
  color: #fff;
  padding: 14px 32px;
  border: none;
  border-radius: 50px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.25s;
  font-family: inherit;
}

.btn-primary:hover {
  background: #b3834a;
}

/* ===== ANIMATIONS ===== */
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
  .detail-hero-inner {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .detail-nav {
    padding: 12px 16px;
  }

  .nav-crumb {
    display: none;
  }

  .detail-price-box {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
