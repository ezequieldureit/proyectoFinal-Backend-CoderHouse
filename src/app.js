import express from 'express';
import productsRouter from './routes/products.routes.js';
import cartRouter from './routes/cart.routes.js';

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({extended:true}))


app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);


app.use('*', (req, res)=>
   res.status(404).json({
             error: "Ruta no existente"
  }) 
);

app.listen(port, () => {
  console.log(`Server listening in port ${port}`);
});
