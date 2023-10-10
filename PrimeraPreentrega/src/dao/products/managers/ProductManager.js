import fs from 'fs';

export default class ProductManager {
    constructor(path) {
        this.path = path;

        try {
            fs.accessSync(this.path, fs.constants.R_OK | fs.constants.W_OK);
        } catch (err) {
            // El archivo no existe, crearlo con un array vacío
            fs.writeFileSync(this.path, JSON.stringify([], null, '\t'));
        }
    }


    getProducts = async () => {
        if (fs.existsSync(this.path)) {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            const products = JSON.parse(data);
            return products;
        }
        return [];
    }
    generateUniqueId(products) {
        // Lógica para generar un ID único aquí
        // Por ejemplo, puedes contar cuántos productos hay y agregar 1 al último ID
        const lastProductId = products.length > 0 ? products[products.length - 1].id : 0;
        return lastProductId + 1;
    }
    addProduct = async (product) => {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            const products = JSON.parse(data);

            if (products.some(p => p.code === product.code)) {
                throw new Error("El producto ya existe.");
            }

            product.id = this.generateUniqueId(products);
            products.push(product);

            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));

            return product;
        } catch (error) {
            console.error("Error al agregar el producto:", error);
            throw error;
        }
    }

    getProductById = async (searchById) => {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            const products = JSON.parse(data);
            const product = products.find(p => p.id === searchById);

            if (product) {
                return product;
            } else {
                throw new Error("El producto no existe");
            }
        } catch (error) {
            console.error("Error al obtener el producto:", error);
            throw error;
        }
    }

    deleteProduct = async (_id) => {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            const products = JSON.parse(data);
            const index = products.findIndex(product => product.id === _id);

            if (index === -1) {
                throw new Error("El producto no existe");
            }

            products.splice(index, 1);
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            throw error;
        }
    }

    updateProduct = async (productId, newData) => {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            const products = JSON.parse(data);
            const product = products.find(p => p.id === productId);
            if (!product) {
                throw new Error("El producto no existe");
            }
            for (const key in newData) {
                if (newData.hasOwnProperty(key)) {
                    product[key] = newData[key];
                }
            }
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
            return product;
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
            throw error;
        }
    }
}