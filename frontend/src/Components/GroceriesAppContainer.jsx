import { useEffect, useState } from "react";
import axios from "axios";
import CartContainer from "./CartContainer";
import ProductsContainer from "./ProductsContainer";
import NavBar from "./NavBar";

export default function GroceriesAppContainer() {
  const [products, setProducts] = useState([]);
  const [productQuantity, setProductQuantity] = useState([]);
  const [cartList, setCartList] = useState([]);

  // form state
  const [formData, setFormData] = useState({
    id: "",
    productName: "",
    brand: "",
    image: "",
    price: "",          // keep string: "$3.65"
    _id: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  // fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await axios.get("http://localhost:3000/products");
        setProducts(result.data);

        setProductQuantity(
          result.data.map((p) => ({
            id: p._id,
            quantity: 0,
          }))
        );
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchProducts();
  }, []);

  // form change handler
  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // SUBMIT: add OR update product
  const handleOnSubmit = async (event) => {
    event.preventDefault();

    if (isEditing) {
      await handleOnUpdate(formData._id, formData, resetForm);
      return;
    }

    try {
      // price stays STRING, exactly like teacher’s JSON
      const result = await axios.post("http://localhost:3000/add-product", formData);

      alert(result.data.message);

      const refreshed = await axios.get("http://localhost:3000/products");
      setProducts(refreshed.data);

      resetForm();
    } catch (error) {
      console.log(error.message);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      id: "",
      productName: "",
      brand: "",
      image: "",
      price: "",
      _id: "",
    });
    setIsEditing(false);
  };

  // quantity handlers
  const handleAddQuantity = (productId, mode) => {
    if (mode === "cart") {
      setCartList((prev) =>
        prev.map((item) =>
          item._id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
      return;
    }

    setProductQuantity((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, quantity: p.quantity + 1 } : p
      )
    );
  };

  const handleRemoveQuantity = (productId, mode) => {
    if (mode === "cart") {
      setCartList((prev) =>
        prev.map((item) =>
          item._id === productId && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      );
      return;
    }

    setProductQuantity((prev) =>
      prev.map((p) =>
        p.id === productId && p.quantity > 0
          ? { ...p, quantity: p.quantity - 1 }
          : p
      )
    );
  };

  // add to cart
  const handleAddToCart = (productId) => {
    const product = products.find((p) => p._id === productId);
    const qty = productQuantity.find((p) => p.id === productId);

    if (!qty || qty.quantity === 0) {
      alert(`Please select quantity for ${product.productName}`);
      return;
    }

    const existing = cartList.find((p) => p._id === productId);

    if (existing) {
      existing.quantity += qty.quantity;
      setCartList([...cartList]);
    } else {
      setCartList([...cartList, { ...product, quantity: qty.quantity }]);
    }
  };

  // remove from cart
  const handleRemoveFromCart = (productId) => {
    setCartList(cartList.filter((product) => product._id !== productId));
  };

  const handleClearCart = () => setCartList([]);

  // delete product
  const handleOnDelete = async (id) => {
    try {
      const result = await axios.delete(`http://localhost:3000/products/${id}`);
      alert(result.data.message);

      setProducts(products.filter((p) => p._id !== id));
    } catch (error) {
      console.log(error.message);
    }
  };

  // load product into form for editing
  const handleOnEdit = async (id) => {
    try {
      const itemToEdit = await axios.get(`http://localhost:3000/products/${id}`);

      setFormData({
        id: itemToEdit.data.id || "",
        productName: itemToEdit.data.productName,
        brand: itemToEdit.data.brand,
        image: itemToEdit.data.image,
        price: itemToEdit.data.price,     // KEEP AS STRING "$3.75"
        _id: itemToEdit.data._id,
      });

      setIsEditing(true);
    } catch (error) {
      console.log(error.message);
    }
  };

  // update product (PATCH)
  const handleOnUpdate = async (id, formData, resetFormFn) => {
    try {
      await axios.patch(
        `http://localhost:3000/products/${id}`,
        formData
      );

      alert("Product updated successfully");

      const refreshed = await axios.get("http://localhost:3000/products");
      setProducts(refreshed.data);

      resetFormFn();
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div>
      <NavBar quantity={cartList.length} />

      <div className="GroceriesApp-Container">

        {/* PRODUCT FORM */}
        <div className="ProductForm">
          <form onSubmit={handleOnSubmit}>
            <input
              name="productName"
              placeholder="Product Name"
              value={formData.productName}
              onChange={handleOnChange}
            />

            <input
              name="brand"
              placeholder="Brand"
              value={formData.brand}
              onChange={handleOnChange}
            />

            <input
              name="image"
              placeholder="Image Link"
              value={formData.image}
              onChange={handleOnChange}
            />

            <input
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleOnChange}
            />

            <button type="submit">
              {isEditing ? "Update" : "Submit"}
            </button>
          </form>

          {isEditing && (
            <p>
              {formData.productName} edited with id:
              <br />
              {formData._id}
            </p>
          )}
        </div>

        <ProductsContainer
          products={products}
          productQuantity={productQuantity}
          handleAddQuantity={handleAddQuantity}
          handleRemoveQuantity={handleRemoveQuantity}
          handleAddToCart={handleAddToCart}
          handleOnDelete={handleOnDelete}
          handleOnEdit={handleOnEdit}
        />

        <CartContainer
          cartList={cartList}
          handleRemoveFromCart={handleRemoveFromCart}
          handleAddQuantity={handleAddQuantity}
          handleRemoveQuantity={handleRemoveQuantity}
          handleClearCart={handleClearCart}
        />
      </div>
    </div>
  );
}
