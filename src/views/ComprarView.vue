<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { cars } from '../stores/carsStore.js'

const route = useRoute()
const router = useRouter()

const car = computed(() => cars.value.find((c) => c.id === Number(route.params.id)))

const nombre = ref('')
const correo = ref('')
const telefono = ref('')

const formValido = computed(
  () => nombre.value.trim() !== '' && correo.value.trim() !== '' && telefono.value.trim() !== '',
)

function confirmarCompra() {
  if (!formValido.value) return
  router.push({
    name: 'compra-exitosa',
    query: {
      auto: car.value.nombre,
      nombre: nombre.value.trim(),
    },
  })
}
</script>

<template>
  <div v-if="car" class="comprar-page">
    <!-- NAV -->
    <nav class="comprar-nav">
      <button class="back-btn" @click="router.push({ name: 'car-detail', params: { id: car.id } })">
        <span>←</span> Volver al detalle
      </button>
      <span class="nav-brand">🚗 Venta de Autos</span>
    </nav>

    <div class="comprar-inner">
      <!-- RESUMEN DEL AUTO -->
      <div class="car-summary">
        <div class="summary-image">
          <img :src="car.imagen" :alt="car.nombre" />
        </div>
        <div class="summary-info">
          <span class="summary-tag">{{ car.categoria }}</span>
          <h2>{{ car.nombre }}</h2>
          <p class="summary-motor">{{ car.motor }} · {{ car.transmision }}</p>
          <div class="summary-price">
            <span class="summary-price-label">Precio total</span>
            <span class="summary-price-value">${{ car.precio.toLocaleString() }}</span>
          </div>
        </div>
      </div>

      <!-- FORMULARIO -->
      <div class="comprar-form-wrap">
        <div class="form-header">
          <span class="step-badge">Paso 1 de 1</span>
          <h1>Datos del comprador</h1>
          <p>Completa tus datos para procesar la compra. Todos los campos son obligatorios.</p>
        </div>

        <form class="comprar-form" @submit.prevent="confirmarCompra">
          <div class="form-group">
            <label for="nombre">Nombre completo <span class="required">*</span></label>
            <input
              id="nombre"
              v-model="nombre"
              type="text"
              placeholder="Tu nombre completo"
              :class="{ filled: nombre.trim() }"
            />
          </div>

          <div class="form-group">
            <label for="correo">Correo electrónico <span class="required">*</span></label>
            <input
              id="correo"
              v-model="correo"
              type="email"
              placeholder="tu@email.com"
              :class="{ filled: correo.trim() }"
            />
          </div>

          <div class="form-group">
            <label for="telefono">Número de teléfono <span class="required">*</span></label>
            <input
              id="telefono"
              v-model="telefono"
              type="tel"
              placeholder="+57 300 000 0000"
              :class="{ filled: telefono.trim() }"
            />
          </div>

          <div class="form-progress">
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{
                  width:
                    ([nombre, correo, telefono].filter((v) => v.trim()).length / 3) * 100 + '%',
                }"
              ></div>
            </div>
            <span class="progress-label">
              {{ [nombre, correo, telefono].filter((v) => v.trim()).length }} / 3 campos completados
            </span>
          </div>

          <button type="submit" class="btn-confirmar" :disabled="!formValido">
            <span v-if="formValido">Confirmar compra →</span>
            <span v-else>Completa todos los campos para continuar</span>
          </button>
        </form>
      </div>
    </div>
  </div>

  <div v-else class="not-found">
    <p>Auto no encontrado.</p>
    <button @click="router.push({ name: 'home' })">Ir al inicio</button>
  </div>
</template>

<style scoped>
.comprar-page {
  min-height: 100vh;
  background: #f8f5f3;
}

/* NAV */
.comprar-nav {
  background: rgba(26, 15, 10, 0.97);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 32px;
  position: sticky;
  top: 0;
  z-index: 100;
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

.nav-brand {
  font-size: 1.1rem;
  font-weight: 800;
  color: #c4975f;
}

/* INNER LAYOUT */
.comprar-inner {
  max-width: 1000px;
  margin: 0 auto;
  padding: 56px 24px;
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 48px;
  align-items: start;
}

/* CAR SUMMARY */
.car-summary {
  background: #fff;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.07);
  position: sticky;
  top: 96px;
}

.summary-image {
  background: linear-gradient(160deg, #fdf5ee 0%, #f0e6d8 100%);
  padding: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
}

.summary-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.summary-info {
  padding: 24px;
}

.summary-tag {
  display: inline-block;
  background: #fdf0e6;
  color: #c4975f;
  padding: 4px 12px;
  border-radius: 50px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 10px;
}

.summary-info h2 {
  font-size: 1.4rem;
  font-weight: 800;
  color: #1a0f0a;
  margin: 0 0 6px;
}

.summary-motor {
  font-size: 0.85rem;
  color: #7a6a65;
  margin: 0 0 20px;
}

.summary-price {
  border-top: 1px solid #f0e8e4;
  padding-top: 16px;
}

.summary-price-label {
  display: block;
  font-size: 12px;
  color: #9a8a85;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.summary-price-value {
  font-size: 1.8rem;
  font-weight: 900;
  color: #c4975f;
}

/* FORM */
.comprar-form-wrap {
  background: #fff;
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.07);
}

.form-header {
  margin-bottom: 32px;
}

.step-badge {
  display: inline-block;
  background: #fdf0e6;
  color: #c4975f;
  padding: 4px 12px;
  border-radius: 50px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
}

.form-header h1 {
  font-size: 1.7rem;
  font-weight: 800;
  color: #1a0f0a;
  margin: 0 0 8px;
}

.form-header p {
  font-size: 0.9rem;
  color: #7a6a65;
  line-height: 1.6;
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

.required {
  color: #c4975f;
}

.form-group input {
  width: 100%;
  padding: 13px 16px;
  border: 1.5px solid #e8ddd8;
  border-radius: 12px;
  font-size: 15px;
  font-family: inherit;
  color: #1a0f0a;
  background: #fafafa;
  transition: border-color 0.2s, background 0.2s;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #c4975f;
  background: #fff;
}

.form-group input.filled {
  border-color: #4caf50;
  background: #f8fff8;
}

/* PROGRESS */
.form-progress {
  margin: 28px 0 24px;
}

.progress-bar {
  height: 6px;
  background: #f0e8e4;
  border-radius: 50px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #c4975f, #4caf50);
  border-radius: 50px;
  transition: width 0.4s ease;
}

.progress-label {
  font-size: 13px;
  color: #9a8a85;
  font-weight: 600;
}

/* SUBMIT BUTTON */
.btn-confirmar {
  width: 100%;
  padding: 16px;
  background: #1a0f0a;
  color: #fff;
  border: none;
  border-radius: 50px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.3s;
}

.btn-confirmar:not(:disabled):hover {
  background: #c4975f;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(196, 151, 95, 0.35);
}

.btn-confirmar:disabled {
  background: #e8ddd8;
  color: #b0a09a;
  cursor: not-allowed;
}

/* NOT FOUND */
.not-found {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .comprar-inner {
    grid-template-columns: 1fr;
    gap: 28px;
    padding: 32px 16px;
  }

  .car-summary {
    position: static;
  }
}
</style>
