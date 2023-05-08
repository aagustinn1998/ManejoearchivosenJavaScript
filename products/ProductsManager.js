const fs = require('fs');


class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
    this.load();
  }


  load() {
    try {
      const data = fs.readFileSync(this.path, 'utf-8');
      const json = JSON.parse(data);
      this.products = json;
    } catch (error) {
      console.log('Error loading file', error);
    }
  }


  save() {
    try {
      const json = JSON.stringify(this.products);
      fs.writeFileSync(this.path, json, 'utf-8');
    } catch (error) {
      console.log('Error saving file', error);
    }
  }


  generateId() {
    return this.products.length > 0 ? this.products[this.products.length - 1].id + 1 : 1;
  }


  getProducts() {
    return this.products;
  }


  getProductById(id) {
    const product = this.products.find(p => p.id === id);
    if (!product) {
        throw new Error('Producto no encontrado');
      }
      
      return product;
    }


    addProduct(product) {
      const id = this.generateId();
      const newProduct = { ...product, id };
      this.products.push(newProduct);
      this.save();
      return newProduct;
    }
  
  
    updateProduct(id, data) {
      const productIndex = this.products.findIndex(p => p.id === id);
  
      if (productIndex === -1) {
        throw new Error('Producto no encontrado');
      }
      
      this.products[productIndex] = { ...this.products[productIndex], ...data };
      this.save();
    }


    deleteProduct(id) {
      const productIndex = this.products.findIndex(p => p.id === id);
      if (productIndex === -1) {
        throw new Error('Producto no encontrado');
      }
      
      this.products.splice(productIndex, 1);
      this.save();

     }
}


const productManager = new ProductManager('./products.json');


console.log(productManager.getProducts()); // []


const newProduct = productManager.addProduct({
  title: 'producto prueba',
  description: 'Este es un producto prueba',
  price: 200,
  thumbnail: 'Sin imagen',
  code: 'abc123',
  stock: 25
});


console.log(newProduct); // { id: 1, title: 'producto prueba', description: 'Este es un producto prueba', price: 200, thumbnail: 'Sin imagen', code: 'abc123', stock: 25 }


console.log(productManager.getProducts()); // [{ id: 1, title: 'producto prueba', description: 'Este es un producto prueba', price: 200, thumbnail: 'Sin imagen', code: 'abc123', stock: 25 }]


const productById = productManager.getProductById(1);
console.log(productById); // { id: 1, title: 'producto prueba', description: 'Este es un producto prueba', price: 200, thumbnail: 'Sin imagen', code: 'abc123', stock: 25 }


productManager.updateProduct(1, { title: 'producto prueba actualizado' });
console.log(productManager.getProductById(1)); // { id: 1, title: 'producto prueba actualizado', description: 'Este es un producto prueba', price: 200, thumbnail: 'Sin imagen', code: 'abc123', stock: 25 }


productManager.deleteProduct(1);
console.log(productManager.getProducts()); // []
