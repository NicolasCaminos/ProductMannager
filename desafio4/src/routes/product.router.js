import { Router } from 'express';
import ProductManager from '../dao/products/managers/ProductManager.js';
import __dirname from '../utill.js';
import path from 'path';


const router = Router();
const filePath = path.resolve(
    __dirname,
    'dao',
    'products',
    'files',
    'productos.json'
);

const pm = new ProductManager(filePath);



router.get('/', async (request, response) => {
    try {
        //Limit recibido
        let { limit } = request.query

        // Productos
        const products = await pm.getProducts();

        // Si no se pasa un limit devuelve todos los productos
        if (!limit) return response.status(200).send({ products })

        // parseo de limit
        if (isNaN(Number(limit))) return response.status(400).send({ message: 'The limit is invalid' })
        limit = Number(limit)

        "Si el limit es menor a cero se devuelve un error"
        if (limit < 0) return response.status(400).send({ message: 'The limit cannot be less than 0' })
        // Si el límite es menor a la cantidad de productos disponibles entra al condicional
        if (products.length > limit) {
            const limitProduct = products.slice(0, limit)
            return response.status(200).send({ limit, products: limitProduct });
        }

        // Caso de que el limit sea mayor a lo disponible
        return response.status(200).send({ products });
    } catch (err) {
        console.log(err);
    }


})

router.get('/:pid', async (request, response) => {
    try {
        const { pid } = request.params

        // Consulta si el parámetro es un número ya que el ID es numérico
        if (isNaN(Number(pid))) {
            return response.status(400).send({ message: 'Invalid identification' });
        }

        // Se devuelve el resultado
        const result = await pm.getProductById(pid)

        // Si el valor de status es 'error' devuelve un error
        if (result.status === 'error') return response.status(400).send(result.message);

        // Resultado
        return response.status(200).send(result);
    } catch (err) {
        console.log(err);
    }

})

router.post('/', async (request, response) => {
    try {
        const product = request.body

        const result = await pm.addProduct(product)

        if (result.status === 'error') return response.status(400).send(result.message);

        return response.status(201).send({ result: result.message, product });
    }
    catch (err) {
        console.log(err);
    }
})

router.put('/:pid', async (request, response) => {
    try {
        const { pid } = request.params
        const product = request.body

        const result = await pm.updateProduct(Number(pid), product)

        if (result.status === 'error') return response.status(400).send({ result });

        return response.status(200).send(`${result.message} whit ID: ${pid}`)
    }
    catch (err) {
        console.log(err);
    }
    ;

})

router.delete('/:pid', async (request, response) => {
    try {
        const { pid } = request.params
        const result = await pm.deleteProduct(Number(pid))

        if (result.status === 'error') return response.status(400).send(result.message);

        return response.status(200).send(result.message);

    } catch (err) {
        console.log(err);
    }
})

export default router
