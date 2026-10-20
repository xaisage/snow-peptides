// Asynchrone Mock-API. Die JSON-Daten können später durch echte Backend-Aufrufe ersetzt werden.
import products from '../data/products.json'
export async function getProducts(){ await Promise.resolve(); return products }
export async function getProduct(id:string){ await Promise.resolve(); return products.find(p=>p.id===id)??null }
