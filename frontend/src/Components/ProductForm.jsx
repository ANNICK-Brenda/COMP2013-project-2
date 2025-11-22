import { useState, useEffect } from "react";
import axios from "axios";

export default function ProductForm({
  handleOnUpdate,
  setProducts,
  editData,
  clearEditMode,
}) {
  const [formData, setFormData] = useState({
    productName: "",
    brand: "",
    image: "",
    price: "",
    _id: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (editData) {
      setFormData({
        productName: editData.productName,
        brand: editData.brand,
        image: editData.image,
        price: editData.price,
        _id: editData._id,
      });
      setIsEditing(true);
    }
  }, [editData]);

  const resetForm = () => {
    setFormData({
      productName: "",
      brand: "",
      image: "",
      price: "",
      _id: "",
    });
    setIsEditing(false);
    clearEditMode && clearEditMode();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEditing) {
      await handleOnUpdate(formData._id, formData, resetForm);
      setMessage(`Updated: ${formData.productName}`);
      return;
    }

    try {
      const result = await axios.post(
        "http://localhost:3000/add-product",
        formData
      );

      setMessage(`Added: ${formData.productName}`);

      const updatedList = await axios.get("http://localhost:3000/products");
      setProducts(updatedList.data);

      resetForm();
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="ProductForm">
      <form onSubmit={handleSubmit}>
        <input
          name="productName"
          placeholder="Product Name"
          value={formData.productName}
          onChange={handleChange}
        />

        <input
          name="brand"
          placeholder="Brand"
          value={formData.brand}
          onChange={handleChange}
        />

        <input
          name="image"
          placeholder="Image Link"
          value={formData.image}
          onChange={handleChange}
        />

        <input
          name="price"
          placeholder="Price (ex: $3.50)"
          value={formData.price}
          onChange={handleChange}
        />

        <button type="submit">
          {isEditing ? "Update" : "Submit"}
        </button>
      </form>

      {isEditing && (
        <p style={{ color: "yellow" }}>
          Editing product with ID: <br />
          {formData._id}
        </p>
      )}

      {!isEditing && message && (
        <p style={{ color: "lightgreen" }}>{message}</p>
      )}
    </div>
  );
}
