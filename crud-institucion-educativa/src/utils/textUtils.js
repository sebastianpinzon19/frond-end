// Archivo: src/utils/textUtils.js

function normalizeText(input) {
    const from = "áéíóúÁÉÍÓÚ";
    const to = "aeiouAEIOU";

    // Crear un arreglo de caracteres para la transformación
    const mapping = {};

    for (let i = 0; i < from.length; i++) {
        mapping[from.charAt(i)] = to.charAt(i);
    }

    // Reemplazar todos los caracteres especiales
    const result = input.replace(/[\s+]/g, '').split('').map((char) => mapping[char] || char).join('').toLowerCase();

    return result;
}

export default normalizeText;