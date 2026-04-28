<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const autoNombre = computed(() => route.query.auto || 'tu vehículo')
const compradorNombre = computed(() => route.query.nombre || '')

const referencia = computed(() => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let ref = 'VA-'
  for (let i = 0; i < 8; i++) ref += chars[Math.floor(Math.random() * chars.length)]
  return ref
})
</script>

<template>
  <div class="exito-page">
    <!-- NAV -->
    <nav class="exito-nav">
      <span class="nav-brand">🚗 Venta de Autos</span>
    </nav>

    <div class="exito-inner">
      <!-- ICONO ANIMADO -->
      <div class="check-circle">
        <svg viewBox="0 0 52 52" class="check-svg">
          <circle cx="26" cy="26" r="25" fill="none" class="check-ring" />
          <path d="M14 27 l8 8 l16 -16" fill="none" class="check-mark" />
        </svg>
      </div>

      <h1 class="exito-title">
        <span v-if="compradorNombre">¡Felicitaciones, {{ compradorNombre }}!</span>
        <span v-else>¡Compra en proceso!</span>
      </h1>

      <p class="exito-subtitle">
        Tu solicitud de compra del <strong>{{ autoNombre }}</strong> ha sido recibida exitosamente.
        Nos pondremos en contacto contigo a la brevedad para coordinar la entrega en nuestro concesionario.
      </p>

      <!-- INFO CARDS -->
      <div class="info-cards">
        <div class="info-card">
          <span class="info-icon">📋</span>
          <span class="info-label">Número de referencia</span>
          <span class="info-value ref">{{ referencia }}</span>
        </div>
        <div class="info-card">
          <span class="info-icon">🚗</span>
          <span class="info-label">Vehículo solicitado</span>
          <span class="info-value">{{ autoNombre }}</span>
        </div>
        <div class="info-card">
          <span class="info-icon">📍</span>
          <span class="info-label">Punto de entrega</span>
          <span class="info-value">Concesionario Medellín</span>
        </div>
        <div class="info-card">
          <span class="info-icon">⏱️</span>
          <span class="info-label">Tiempo estimado de contacto</span>
          <span class="info-value">24 – 48 horas</span>
        </div>
      </div>

      <!-- PASOS -->
      <div class="steps-section">
        <h3>¿Qué sigue?</h3>
        <div class="steps">
          <div class="step">
            <div class="step-num">1</div>
            <div class="step-text">
              <strong>Confirmación por correo</strong>
              <p>Recibirás un email con los detalles de tu solicitud.</p>
            </div>
          </div>
          <div class="step-connector"></div>
          <div class="step">
            <div class="step-num">2</div>
            <div class="step-text">
              <strong>Contacto del asesor</strong>
              <p>Un asesor te llamará para verificar tu información y acordar los detalles del pago.</p>
            </div>
          </div>
          <div class="step-connector"></div>
          <div class="step">
            <div class="step-num">3</div>
            <div class="step-text">
              <strong>Entrega en el concesionario</strong>
              <p>Ven a recoger tu nuevo vehículo en nuestra sede de Medellín.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="exito-actions">
        <button class="btn-home" @click="router.push({ name: 'home' })">
          Ver más autos
        </button>
      </div>
    </div>

    <footer class="exito-footer">
      <span class="footer-logo">🚗 Venta de Autos</span>
      <p>© 2026 Venta de Autos. Todos los derechos reservados.</p>
    </footer>
  </div>
</template>

<style scoped>
.exito-page {
  min-height: 100vh;
  background: #f8f5f3;
  display: flex;
  flex-direction: column;
}

/* NAV */
.exito-nav {
  background: rgba(26, 15, 10, 0.97);
  padding: 16px 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(196, 151, 95, 0.2);
}

.nav-brand {
  font-size: 1.1rem;
  font-weight: 800;
  color: #c4975f;
}

/* INNER */
.exito-inner {
  max-width: 720px;
  margin: 0 auto;
  padding: 64px 24px;
  text-align: center;
  flex: 1;
}

/* CHECK ANIMATION */
.check-circle {
  width: 96px;
  height: 96px;
  margin: 0 auto 32px;
}

.check-svg {
  width: 100%;
  height: 100%;
}

.check-ring {
  stroke: #c4975f;
  stroke-width: 2;
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  animation: drawRing 0.6s ease forwards;
}

.check-mark {
  stroke: #c4975f;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation: drawCheck 0.4s 0.55s ease forwards;
}

@keyframes drawRing {
  to { stroke-dashoffset: 0; }
}

@keyframes drawCheck {
  to { stroke-dashoffset: 0; }
}

/* TITLE */
.exito-title {
  font-size: clamp(1.8rem, 4vw, 2.4rem);
  font-weight: 900;
  color: #1a0f0a;
  margin: 0 0 16px;
  animation: fadeUp 0.6s 0.3s ease both;
}

.exito-subtitle {
  font-size: 1rem;
  color: #5a4a45;
  line-height: 1.75;
  margin: 0 0 48px;
  animation: fadeUp 0.6s 0.4s ease both;
}

/* INFO CARDS */
.info-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 48px;
  animation: fadeUp 0.6s 0.5s ease both;
}

.info-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  text-align: left;
  border: 1.5px solid #f0e8e4;
  display: flex;
  flex-direction: column;
  gap: 4px;
  transition: border-color 0.2s;
}

.info-card:hover {
  border-color: #c4975f;
}

.info-icon {
  font-size: 1.3rem;
  margin-bottom: 4px;
}

.info-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #9a8a85;
  font-weight: 700;
}

.info-value {
  font-size: 0.95rem;
  font-weight: 700;
  color: #1a0f0a;
}

.info-value.ref {
  font-size: 1.05rem;
  color: #c4975f;
  letter-spacing: 1px;
}

/* STEPS */
.steps-section {
  text-align: left;
  background: #fff;
  border-radius: 20px;
  padding: 32px;
  margin-bottom: 40px;
  border: 1.5px solid #f0e8e4;
  animation: fadeUp 0.6s 0.6s ease both;
}

.steps-section h3 {
  font-size: 1.1rem;
  font-weight: 800;
  color: #1a0f0a;
  margin: 0 0 24px;
}

.steps {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.step {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.step-num {
  width: 36px;
  min-width: 36px;
  height: 36px;
  background: #c4975f;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.9rem;
}

.step-text strong {
  display: block;
  font-size: 0.95rem;
  color: #1a0f0a;
  margin-bottom: 4px;
}

.step-text p {
  font-size: 0.85rem;
  color: #7a6a65;
  line-height: 1.5;
  margin: 0;
}

.step-connector {
  width: 2px;
  height: 20px;
  background: #f0e8e4;
  margin-left: 17px;
}

/* ACTIONS */
.exito-actions {
  animation: fadeUp 0.6s 0.7s ease both;
}

.btn-home {
  background: #1a0f0a;
  color: #fff;
  border: none;
  padding: 14px 40px;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.25s;
}

.btn-home:hover {
  background: #c4975f;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(196, 151, 95, 0.35);
}

/* FOOTER */
.exito-footer {
  background: #1a0f0a;
  padding: 28px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.footer-logo {
  font-size: 1rem;
  font-weight: 800;
  color: #c4975f;
}

.exito-footer p {
  color: rgba(255, 255, 255, 0.3);
  font-size: 0.82rem;
}

/* ANIMATIONS */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* RESPONSIVE */
@media (max-width: 600px) {
  .info-cards {
    grid-template-columns: 1fr;
  }
}
</style>
