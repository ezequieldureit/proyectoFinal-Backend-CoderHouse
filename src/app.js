import express from 'express';
import productsRouter from './routes/products.routes.js';
import cartRouter from './routes/cart.routes.js';

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({extended:true}))


app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);


// Correciones tutor>>> corregido
// Esta perfecto, obviando el detalle que no agregaste una ruta general que atrape cuando envian un mensaje a una URL dentro de nuestro dominio pero que no controlemos. Algo del tipo:



// app.use('*', (req, res)=>   >> corregido...
//    res.status(404).json({
//              error: "Ruta no identificada";
//   }) 
// );
app.use('*', (req, res)=>
   res.status(404).json({
             error: "Ruta no existente"
  }) 
);

app.listen(port, () => {
  console.log(`Server listening in port ${port}`);
});
