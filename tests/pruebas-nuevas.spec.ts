
import { test, expect } from '@playwright/test';

// Prueba 1: Vaciar carrito
test('vaciar carrito deja el contador en 0 sin errores de JavaScript', async ({ page }) => {
  const errores: string[] = [];

  page.on('pageerror', error => {
    errores.push(error.message);
  });

  await page.goto('/catalogo.html');

  const producto = page.getByTestId('producto').first();
  await expect(page.getByTestId('producto')).toHaveCount(4);

  await producto.getByRole('button', { name: 'Agregar al carrito' }).click();

  await expect(page.getByTestId('contador-carrito')).toHaveText('1');

  await page.getByRole('button', { name: 'Vaciar carrito' }).click();

  await expect(page.getByTestId('contador-carrito')).toHaveText('0');

  expect(errores).toEqual([]);
});

// Prueba 2: Inicio de sesión con campos vacíos
test('iniciar sesión con campos vacíos muestra un mensaje de error', async ({ page }) => {
  await page.goto('/login.html');

  await page.getByRole('button', { name: 'Entrar' }).click();

  await expect(page.getByRole('alert'))
    .toHaveText('Usuario o contraseña incorrectos');

  await expect(page).toHaveURL(/login\.html/);
});

// Prueba 3: Validar nombre y precio de los productos de la API
test('la API devuelve productos con nombre y precio mayor que 0', async ({ request }) => {
  const respuesta = await request.get('/api/productos');

  expect(respuesta.ok()).toBeTruthy();

  const productos = await respuesta.json();

  expect(productos).toHaveLength(4);

  for (const producto of productos) {
    expect(typeof producto.nombre).toBe('string');
    expect(producto.nombre.trim().length).toBeGreaterThan(0);

    expect(typeof producto.precio).toBe('number');
    expect(producto.precio).toBeGreaterThan(0);
  }
});
