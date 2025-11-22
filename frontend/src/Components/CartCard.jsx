import QuantityCounter from "./QuantityCounter";

export default function CartCard({
  id,
  image,
  productName,
  price,
  quantity,
  handleRemoveFromCart,
  handleAddQuantity,
  handleRemoveQuantity,
}) {
  return (
    <div className="CartCard">
      <div className="CartCardInfo">
        <img src={image} alt="" />
        <p>{productName}</p>
        <p>{price}</p>

        <QuantityCounter
          id={id}                      // ✅ FIXED HERE
          productQuantity={quantity}
          handleAddQuantity={handleAddQuantity}
          handleRemoveQuantity={handleRemoveQuantity}
          mode="cart"
        />
      </div>

      <div>
        <h3>
          Total: {(Number(price.replace("$", "")) * quantity).toFixed(2)}
        </h3>

        <button
          onClick={() => handleRemoveFromCart(id)}
          className="RemoveButton"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
