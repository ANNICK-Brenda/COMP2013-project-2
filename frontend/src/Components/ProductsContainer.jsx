import ProductCard from "./ProductCard";

export default function ProductsContainer({
  products,
  handleAddQuantity,
  handleRemoveQuantity,
  handleAddToCart,
  productQuantity,
  handleOnEdit,
  handleOnDelete,
}) {
  return (
    <div className="ProductsContainer">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          id={product._id}
          productName={product.productName}
          brand={product.brand}
          image={product.image}
          price={product.price}

        
          productQuantity={
            productQuantity.find((p) => p.id === product._id)?.quantity || 0
          }

          handleAddQuantity={handleAddQuantity}
          handleRemoveQuantity={handleRemoveQuantity}
          handleAddToCart={handleAddToCart}

          handleOnEdit={handleOnEdit}
          handleOnDelete={handleOnDelete}
        />
      ))}
    </div>
  );
}
