import { ref, watch } from 'vue'
import { cars as defaultCars } from '../data/cars.js'

const STORAGE_KEY = 'catalogo-carros-data'

function loadCars() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch (e) {
    console.warn('No se pudo leer localStorage, usando datos por defecto', e)
  }
  return JSON.parse(JSON.stringify(defaultCars))
}

export const cars = ref(loadCars())

watch(
  cars,
  (val) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
    } catch (e) {
      console.warn('No se pudo guardar en localStorage', e)
    }
  },
  { deep: true },
)

function nextId() {
  if (cars.value.length === 0) return 1
  return Math.max(...cars.value.map((c) => Number(c.id) || 0)) + 1
}

export function getCarById(id) {
  return cars.value.find((c) => Number(c.id) === Number(id))
}

export function addCar(data) {
  const car = { ...data, id: nextId() }
  cars.value.push(car)
  return car
}

export function updateCar(id, data) {
  const idx = cars.value.findIndex((c) => Number(c.id) === Number(id))
  if (idx !== -1) {
    cars.value[idx] = { ...cars.value[idx], ...data, id: cars.value[idx].id }
  }
}

export function deleteCar(id) {
  const idx = cars.value.findIndex((c) => Number(c.id) === Number(id))
  if (idx !== -1) cars.value.splice(idx, 1)
}

export function resetCars() {
  cars.value = JSON.parse(JSON.stringify(defaultCars))
}
