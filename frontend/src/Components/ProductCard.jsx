import QuantityCounter from "./QuantityCounter";

export default function ProductCard({
  productName,
  brand,
  image,
  price,
  productQuantity,
  handleAddQuantity,
  handleRemoveQuantity,
  handleAddToCart,
  handleOnDelete,      // <-- added
  handleOnEdit,        // <-- added
  id,
}) {

  // FINAL SAFE FIX: handle string prices like "$3.65"
  let numericPrice = 0;

  if (typeof price === "string") {
    numericPrice = parseFloat(
      price
        .replace("$", "") 
        .replace(" ", "")
        .trim()
    );
  } else if (typeof price === "number") {
    numericPrice = price;
  } else {
    numericPrice = 0;
  }

  return (
    <div className="ProductCard">
      <h3>{productName}</h3>
      <img src={image} alt="" />
      <h4>{brand}</h4>

      <QuantityCounter
        handleAddQuantity={handleAddQuantity}
        productQuantity={productQuantity}
        handleRemoveQuantity={handleRemoveQuantity}
        id={id}
        mode="product"
      />

      <h3>${numericPrice.toFixed(2)}</h3>

      <button onClick={() => handleAddToCart(id)}>Add to Cart</button>

      <button onClick={() => handleOnEdit(id)}>Edit</button>
      <button onClick={() => handleOnDelete(id)}>Delete</button>

    </div>
  );
}
