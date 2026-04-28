<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { cars, addCar, updateCar, deleteCar, resetCars } from '../stores/carsStore.js'

const router = useRouter()

const PLACEHOLDER_IMG =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120"><rect width="200" height="120" fill="%23f0e6d8"/><text x="50%" y="50%" font-family="sans-serif" font-size="14" fill="%23c4975f" text-anchor="middle" dominant-baseline="middle">Sin imagen</text></svg>'

function emptyForm() {
  return {
    nombre: '',
    categoria: '',
    precio: '',
    año: new Date().getFullYear(),
    motor: '',
    potencia: '',
    transmision: '',
    km: '0 km',
    combustible: '',
    traccion: '',
    puertas: 4,
    coloresText: '',
    imagen: '',
    descripcion: '',
    caracteristicasText: '',
  }
}

const form = reactive(emptyForm())
const editingId = ref(null)
const showForm = ref(false)
const formError = ref('')
const flashMessage = ref('')

function flash(msg) {
  flashMessage.value = msg
  setTimeout(() => (flashMessage.value = ''), 2500)
}

const isEditing = computed(() => editingId.value !== null)

function openCreate() {
  Object.assign(form, emptyForm())
  editingId.value = null
  formError.value = ''
  showForm.value = true
}

function openEdit(car) {
  Object.assign(form, {
    nombre: car.nombre || '',
    categoria: car.categoria || '',
    precio: car.precio ?? '',
    año: car.año ?? new Date().getFullYear(),
    motor: car.motor || '',
    potencia: car.potencia || '',
    transmision: car.transmision || '',
    km: car.km || '',
    combustible: car.combustible || '',
    traccion: car.traccion || '',
    puertas: car.puertas ?? 4,
    coloresText: Array.isArray(car.colores) ? car.colores.join(', ') : '',
    imagen: car.imagen || '',
    descripcion: car.descripcion || '',
    caracteristicasText: Array.isArray(car.caracteristicas)
      ? car.caracteristicas.join('\n')
      : '',
  })
  editingId.value = car.id
  formError.value = ''
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  editingId.value = null
  formError.value = ''
}

function handleFile(event) {
  const file = event.target.files?.[0]
  if (!file) return
  if (!file.type.startsWith('image/')) {
    formError.value = 'El archivo debe ser una imagen'
    return
  }
  const reader = new FileReader()
  reader.onload = () => {
    form.imagen = reader.result
  }
  reader.onerror = () => {
    formError.value = 'No se pudo leer el archivo'
  }
  reader.readAsDataURL(file)
}

function clearImage() {
  form.imagen = ''
}

function buildPayload() {
  return {
    nombre: form.nombre.trim(),
    categoria: form.categoria.trim(),
    precio: Number(form.precio) || 0,
    año: Number(form.año) || new Date().getFullYear(),
    motor: form.motor.trim(),
    potencia: form.potencia.trim(),
    transmision: form.transmision.trim(),
    km: form.km.trim(),
    combustible: form.combustible.trim(),
    traccion: form.traccion.trim(),
    puertas: Number(form.puertas) || 4,
    colores: form.coloresText
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean),
    imagen: form.imagen.trim() || PLACEHOLDER_IMG,
    descripcion: form.descripcion.trim(),
    caracteristicas: form.caracteristicasText
      .split('\n')
      .map((c) => c.trim())
      .filter(Boolean),
  }
}

function submit() {
  if (!form.nombre.trim()) {
    formError.value = 'El nombre es obligatorio'
    return
  }
  if (form.precio === '' || isNaN(Number(form.precio)) || Number(form.precio) < 0) {
    formError.value = 'Ingresa un precio válido'
    return
  }
  const payload = buildPayload()
  if (isEditing.value) {
    updateCar(editingId.value, payload)
    flash(`"${payload.nombre}" actualizado`)
  } else {
    const created = addCar(payload)
    flash(`"${created.nombre}" agregado al catálogo`)
  }
  closeForm()
}

function confirmDelete(car) {
  if (confirm(`¿Eliminar "${car.nombre}" del catálogo?`)) {
    deleteCar(car.id)
    flash(`"${car.nombre}" eliminado`)
  }
}

function confirmReset() {
  if (confirm('¿Restaurar el catálogo a los autos originales? Se perderán los cambios guardados.')) {
    resetCars()
    flash('Catálogo restaurado')
  }
}

function viewCar(id) {
  router.push({ name: 'car-detail', params: { id } })
}
</script>

<template>
  <div class="admin-page">
    <!-- NAV -->
    <nav class="admin-nav">
      <RouterLink to="/" class="back-btn">
        <span class="back-arrow">←</span> Volver al sitio
      </RouterLink>
      <span class="nav-brand">🚗 Panel de Administración</span>
      <span class="nav-count">{{ cars.length }} {{ cars.length === 1 ? 'auto' : 'autos' }}</span>
    </nav>

    <!-- HEADER -->
    <header class="admin-header">
      <div class="admin-header-inner">
        <div>
          <span class="section-tag">CRUD</span>
          <h1>Gestión del catálogo</h1>
          <p>Da de alta, edita o elimina vehículos. Los cambios se guardan en tu navegador (localStorage).</p>
        </div>
        <div class="admin-header-actions">
          <button class="btn-secondary" @click="confirmReset">Restaurar originales</button>
          <button class="btn-primary" @click="openCreate">+ Nuevo auto</button>
        </div>
      </div>
    </header>

    <!-- FLASH -->
    <transition name="flash">
      <div v-if="flashMessage" class="flash">{{ flashMessage }}</div>
    </transition>

    <!-- TABLA -->
    <section class="admin-table-section">
      <div v-if="cars.length === 0" class="empty">
        <p>No hay autos cargados.</p>
        <button class="btn-primary" @click="openCreate">Agregar el primero</button>
      </div>

      <div v-else class="admin-table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Año</th>
              <th>Precio</th>
              <th class="actions-col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="car in cars" :key="car.id">
              <td>
                <img :src="car.imagen" :alt="car.nombre" class="row-thumb" />
              </td>
              <td>
                <strong>{{ car.nombre }}</strong>
                <div class="row-sub">{{ car.motor }}</div>
              </td>
              <td><span class="row-badge">{{ car.categoria }}</span></td>
              <td>{{ car.año }}</td>
              <td class="price-cell">${{ Number(car.precio).toLocaleString() }}</td>
              <td>
                <div class="row-actions">
                  <button class="btn-action view" @click="viewCar(car.id)" title="Ver">👁</button>
                  <button class="btn-action edit" @click="openEdit(car)" title="Editar">✎</button>
                  <button class="btn-action delete" @click="confirmDelete(car)" title="Eliminar">🗑</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- MODAL FORM -->
    <transition name="modal">
      <div v-if="showForm" class="modal-overlay" @click.self="closeForm">
        <div class="modal">
          <div class="modal-header">
            <h2>{{ isEditing ? 'Editar auto' : 'Nuevo auto' }}</h2>
            <button class="modal-close" @click="closeForm" aria-label="Cerrar">✕</button>
          </div>

          <form class="modal-form" @submit.prevent="submit">
            <div class="form-row">
              <div class="form-group">
                <label>Nombre *</label>
                <input v-model="form.nombre" type="text" placeholder="Ej. Toyota Corolla" required />
              </div>
              <div class="form-group">
                <label>Categoría</label>
                <input v-model="form.categoria" type="text" placeholder="Sedán, SUV, Pick-up..." />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Precio (USD) *</label>
                <input v-model.number="form.precio" type="number" min="0" step="100" required />
              </div>
              <div class="form-group">
                <label>Año</label>
                <input v-model.number="form.año" type="number" min="1950" max="2100" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Motor</label>
                <input v-model="form.motor" type="text" placeholder="1.8L 4 cilindros" />
              </div>
              <div class="form-group">
                <label>Potencia</label>
                <input v-model="form.potencia" type="text" placeholder="139 hp" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Transmisión</label>
                <input v-model="form.transmision" type="text" placeholder="Automática CVT" />
              </div>
              <div class="form-group">
                <label>Combustible</label>
                <input v-model="form.combustible" type="text" placeholder="Gasolina" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Tracción</label>
                <input v-model="form.traccion" type="text" placeholder="Delantera (FWD)" />
              </div>
              <div class="form-group">
                <label>Kilometraje</label>
                <input v-model="form.km" type="text" placeholder="0 km" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Puertas</label>
                <input v-model.number="form.puertas" type="number" min="2" max="6" />
              </div>
              <div class="form-group">
                <label>Colores (separados por coma)</label>
                <input v-model="form.coloresText" type="text" placeholder="Blanco, Negro, Rojo" />
              </div>
            </div>

            <div class="form-group">
              <label>Descripción</label>
              <textarea v-model="form.descripcion" rows="3" placeholder="Descripción del vehículo..."></textarea>
            </div>

            <div class="form-group">
              <label>Características (una por línea)</label>
              <textarea
                v-model="form.caracteristicasText"
                rows="4"
                placeholder="Pantalla táctil 8&quot;&#10;Cámara de reversa&#10;Apple CarPlay"
              ></textarea>
            </div>

            <div class="form-group">
              <label>Imagen</label>
              <div class="image-controls">
                <input
                  v-model="form.imagen"
                  type="text"
                  placeholder="URL de la imagen o sube un archivo"
                  class="image-url"
                />
                <label class="file-btn">
                  📁 Subir
                  <input type="file" accept="image/*" @change="handleFile" hidden />
                </label>
                <button v-if="form.imagen" type="button" class="clear-img" @click="clearImage">
                  ✕
                </button>
              </div>
              <div v-if="form.imagen" class="image-preview">
                <img :src="form.imagen" alt="Vista previa" />
              </div>
            </div>

            <p v-if="formError" class="form-error">{{ formError }}</p>

            <div class="modal-actions">
              <button type="button" class="btn-secondary" @click="closeForm">Cancelar</button>
              <button type="submit" class="btn-primary">
                {{ isEditing ? 'Guardar cambios' : 'Crear auto' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.admin-page {
  min-height: 100vh;
  background: #f8f5f3;
}

/* NAV */
.admin-nav {
  position: sticky;
  top: 0;
  z-index: 50;
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
  text-decoration: none;
  font-size: 0.88rem;
  font-weight: 600;
  display: inline-flex;
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
  font-size: 1.05rem;
  font-weight: 800;
  color: #c4975f;
}

.nav-count {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
}

/* HEADER */
.admin-header {
  background: linear-gradient(160deg, #1a0f0a 0%, #2c1810 100%);
  color: #fff;
  padding: 64px 32px;
}

.admin-header-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 24px;
  flex-wrap: wrap;
}

.section-tag {
  display: inline-block;
  background: rgba(196, 151, 95, 0.2);
  color: #c4975f;
  padding: 5px 14px;
  border-radius: 50px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.admin-header h1 {
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  font-weight: 800;
  margin: 0 0 8px;
}

.admin-header p {
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  max-width: 540px;
}

.admin-header-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

/* BUTTONS */
.btn-primary,
.btn-secondary {
  border: none;
  padding: 12px 24px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
}

.btn-primary {
  background: #c4975f;
  color: #fff;
  box-shadow: 0 4px 16px rgba(196, 151, 95, 0.35);
}

.btn-primary:hover {
  background: #b3834a;
  transform: translateY(-2px);
}

.btn-secondary {
  background: transparent;
  color: #fff;
  border: 1.5px solid rgba(255, 255, 255, 0.3);
}

.btn-secondary:hover {
  border-color: #fff;
  background: rgba(255, 255, 255, 0.06);
}

/* FLASH */
.flash {
  position: fixed;
  top: 80px;
  right: 32px;
  background: #1a0f0a;
  color: #fff;
  padding: 14px 22px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  z-index: 200;
  border-left: 4px solid #c4975f;
}

.flash-enter-active,
.flash-leave-active {
  transition: all 0.3s ease;
}

.flash-enter-from,
.flash-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

/* TABLE */
.admin-table-section {
  max-width: 1200px;
  margin: -40px auto 0;
  padding: 0 32px 80px;
}

.empty {
  background: #fff;
  padding: 64px 32px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.07);
}

.empty p {
  color: #7a6a65;
  margin: 0 0 20px;
  font-size: 1.05rem;
}

.admin-table-wrapper {
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.07);
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead tr {
  background: #1a0f0a;
  color: #fff;
}

th {
  padding: 18px 20px;
  text-align: left;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  font-weight: 700;
}

th.actions-col {
  text-align: right;
}

tbody tr {
  border-bottom: 1px solid #f0e8e4;
  transition: background 0.2s;
}

tbody tr:hover {
  background: #fdf5ee;
}

td {
  padding: 16px 20px;
  font-size: 0.95rem;
  color: #3a2a25;
  vertical-align: middle;
}

.row-thumb {
  width: 80px;
  height: 56px;
  object-fit: contain;
  background: #f5f0ed;
  border-radius: 8px;
  padding: 4px;
}

.row-sub {
  font-size: 0.8rem;
  color: #9a8a85;
  margin-top: 2px;
}

.row-badge {
  background: #fdf0e6;
  color: #c4975f;
  padding: 4px 12px;
  border-radius: 50px;
  font-size: 12px;
  font-weight: 700;
}

.price-cell {
  font-weight: 800;
  color: #c4975f;
}

.row-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.btn-action {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  border: 1.5px solid #f0e8e4;
  background: #fff;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
}

.btn-action.view:hover {
  border-color: #5a463f;
  color: #1a0f0a;
  background: #fdf5ee;
}

.btn-action.edit:hover {
  border-color: #c4975f;
  color: #c4975f;
  background: #fdf0e6;
}

.btn-action.delete:hover {
  border-color: #d4524a;
  color: #d4524a;
  background: #fdecec;
}

/* MODAL */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(26, 15, 10, 0.65);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 24px;
  overflow-y: auto;
}

.modal {
  background: #fff;
  border-radius: 24px;
  width: 100%;
  max-width: 720px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  margin: auto;
}

.modal-header {
  padding: 24px 32px;
  border-bottom: 1px solid #f0e8e4;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.4rem;
  color: #1a0f0a;
  font-weight: 800;
}

.modal-close {
  background: transparent;
  border: none;
  font-size: 1.3rem;
  cursor: pointer;
  color: #9a8a85;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  transition: all 0.2s;
  font-family: inherit;
}

.modal-close:hover {
  background: #f5f0ed;
  color: #1a0f0a;
}

.modal-form {
  padding: 28px 32px;
  overflow-y: auto;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  margin-bottom: 18px;
}

.form-group label {
  display: block;
  font-weight: 700;
  color: #1a0f0a;
  font-size: 13px;
  margin-bottom: 6px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 11px 14px;
  border: 1.5px solid #e8ddd8;
  border-radius: 10px;
  font-size: 14px;
  font-family: inherit;
  color: #1a0f0a;
  background: #fafafa;
  transition: border-color 0.2s, background 0.2s;
  box-sizing: border-box;
  resize: vertical;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #c4975f;
  background: #fff;
}

.image-controls {
  display: flex;
  gap: 8px;
  align-items: stretch;
}

.image-url {
  flex: 1;
}

.file-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 11px 16px;
  background: #1a0f0a;
  color: #fff;
  border-radius: 10px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
  transition: background 0.2s;
}

.file-btn:hover {
  background: #c4975f;
}

.clear-img {
  background: #fdecec;
  border: 1.5px solid #f5d0d0;
  color: #d4524a;
  border-radius: 10px;
  padding: 0 14px;
  cursor: pointer;
  font-family: inherit;
  font-size: 14px;
  transition: all 0.2s;
}

.clear-img:hover {
  background: #d4524a;
  color: #fff;
  border-color: #d4524a;
}

.image-preview {
  margin-top: 12px;
  background: linear-gradient(135deg, #fdf5ee, #f0e6d8);
  border-radius: 12px;
  padding: 16px;
  text-align: center;
}

.image-preview img {
  max-width: 100%;
  max-height: 200px;
  object-fit: contain;
}

.form-error {
  background: #fdecec;
  color: #b13a32;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 0.88rem;
  margin: 0 0 16px;
  border-left: 3px solid #d4524a;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0e8e4;
  margin-top: 20px;
  padding-top: 20px;
}

.modal-actions .btn-secondary {
  color: #1a0f0a;
  border-color: #e8ddd8;
}

.modal-actions .btn-secondary:hover {
  border-color: #1a0f0a;
  background: #f5f0ed;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}

.modal-enter-active .modal,
.modal-leave-active .modal {
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal,
.modal-leave-to .modal {
  transform: translateY(20px);
  opacity: 0;
}

/* RESPONSIVE */
@media (max-width: 720px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .admin-header-inner {
    flex-direction: column;
    align-items: flex-start;
  }

  .modal-header,
  .modal-form {
    padding: 20px;
  }

  .admin-table-section {
    padding: 0 16px 60px;
  }

  th,
  td {
    padding: 12px 14px;
  }

  .row-thumb {
    width: 56px;
    height: 40px;
  }
}
</style>
