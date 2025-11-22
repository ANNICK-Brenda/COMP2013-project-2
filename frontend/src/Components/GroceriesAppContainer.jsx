import { useEffect, useState } from "react";
import axios from "axios";
import CartContainer from "./CartContainer";
import ProductsContainer from "./ProductsContainer";
import NavBar from "./NavBar";

export default function GroceriesAppContainer() {

  //States these hold all the changing data in the app
  const [products, setProducts] = useState([]);                // list of all products from DB
  const [productQuantity, setProductQuantity] = useState([]);  // quantity chosen for each product
  const [cartList, setCartList] = useState([]);                // items added to cart

  const [formData, setFormData] = useState({                   // form inputs for add + edit
    id: "",
    productName: "",
    brand: "",
    image: "",
    price: "",       
    _id: "",
  });

  const [isEditing, setIsEditing] = useState(false);            // check if user is editing
  const [postResponse, setPostResponse] = useState("");        

  //useEffect runs once when page loads to get products
  useEffect(() => {
    fetchProductsDB();
  }, []);

  //Handlers

  //GET all products from DB and set quantity list
  const fetchProductsDB = async () => {
    try {
      const response = await axios.get("http://localhost:3000/products");
      setProducts(response.data);  // save all products

      // create quantity list for each new product
      setProductQuantity(
        response.data.map((p) => ({
          id: p._id,
          quantity: 0,
        }))
      );

    } catch (error) {
      console.log(error.message);
    }
  };

  //Handle input typing inside the form
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));  // update form
    setPostResponse("");  // clear success message when typing
  };

  //Reset form after add/update
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

  //Handle form submit  add or update
  const handleOnSubmit = async (e) => {
    e.preventDefault(); // stop page refresh

    // if user is editing  run update
    if (isEditing) {
      await handleOnUpdate(formData._id, formData, resetForm);
      return;
    }

    // otherwise → add a new product
    try {
      const result = await axios.post(
        "http://localhost:3000/add-product",
        formData
      );

      // find new id if returned
      const newId =
        result.data?._id ||
        result.data?.product?._id ||
        formData._id ||
        "";

      // show success message
      if (newId) {
        setPostResponse(
          `Product added successfully with id: ${newId}`
        );
      } else {
        setPostResponse("Product added successfully");
      }

      await fetchProductsDB();  // refresh product list
      resetForm();              // clear form

    } catch (error) {
      console.log(error.message);
    }
  };

  //Handle Delete product
  const handleOnDelete = async (id) => {
    try {
      const result = await axios.delete(`http://localhost:3000/products/${id}`);
      alert(result.data.message);  // teacher-style alert for delete
      setProducts(products.filter((p) => p._id !== id)); // remove from UI
    } catch (error) {
      console.log(error.message);
    }
  };

  //Handle Edit → load product info into form
  const handleOnEdit = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3000/products/${id}`);

      // fill form with the selected product data
      setFormData({
        id: response.data.id || "",
        productName: response.data.productName,
        brand: response.data.brand,
        image: response.data.image,
        price: response.data.price,   // keep price string
        _id: response.data._id,
      });

      setIsEditing(true);     // change form to edit mode
      setPostResponse("");    // clear old success message

    } catch (error) {
      console.log(error.message);
    }
  };

  //Handle Update (PATCH)
  const handleOnUpdate = async (id, formData, resetFormFn) => {
    try {
      await axios.patch(
        `http://localhost:3000/products/${id}`,
        formData
      );

      setPostResponse(
        `Product updated successfully with id: ${id}`
      ); // success message

      await fetchProductsDB(); // refresh product list
      resetFormFn();           // clear form

    } catch (error) {
      console.log(error.message);
    }
  };

  //Increase quantity (product list or cart)
  const handleAddQuantity = (productId, mode) => {

    // if coming from cart → update cart quantity
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

    // otherwise update quantity in product list
    setProductQuantity((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, quantity: p.quantity + 1 } : p
      )
    );
  };

  //Decrease quantity (product list or cart)
  const handleRemoveQuantity = (productId, mode) => {

    // handle cart
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

    // handle product list
    setProductQuantity((prev) =>
      prev.map((p) =>
        p.id === productId && p.quantity > 0
          ? { ...p, quantity: p.quantity - 1 }
          : p
      )
    );
  };

  //Add product to cart
  const handleAddToCart = (productId) => {
    const product = products.find((p) => p._id === productId);      // find product
    const qty = productQuantity.find((p) => p.id === productId);    // find chosen quantity

    if (!qty || qty.quantity === 0) {
      alert(`Please select quantity for ${product.productName}`);   // ensure quantity selected
      return;
    }

    const existing = cartList.find((p) => p._id === productId);     // check if already in cart

    if (existing) {
      existing.quantity += qty.quantity;                            // increase quantity
      setCartList([...cartList]);
    } else {
      setCartList([...cartList, { ...product, quantity: qty.quantity }]); // add new
    }
  };

  //Remove item from cart
  const handleRemoveFromCart = (productId) => {
    setCartList(cartList.filter((product) => product._id !== productId));
  };

  //Clear all cart
  const handleClearCart = () => setCartList([]);


  //Render
  return (
    <div>
      <NavBar quantity={cartList.length} /> {/* show number of items in cart */}

      <div className="GroceriesApp-Container">

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

            {/* small success message under the button */}
            {postResponse && (
              <p style={{ color: "lightgreen" }}>{postResponse}</p>
            )}
          </form>

          {/* show when user is editing */}
          {isEditing && (
            <p style={{ color: "yellow" }}>
              Editing: {formData.productName}
              <br />
              ID: {formData._id}
            </p>
          )}
        </div>

        {/* show all products */}
        <ProductsContainer
          products={products}
          productQuantity={productQuantity}
          handleAddQuantity={handleAddQuantity}
          handleRemoveQuantity={handleRemoveQuantity}
          handleAddToCart={handleAddToCart}
          handleOnDelete={handleOnDelete}
          handleOnEdit={handleOnEdit}
        />

        {/* show cart */}
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
