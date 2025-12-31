
import axios from "axios";
import fs from "fs";

const API_URL = "http://localhost:5000/api/v1/products";

const fetchProducts = async () => {
    try {
        const response = await axios.get(API_URL);
        const products = response.data.data;
        let output = "";
        products.forEach(p => {
            output += `Product ID: ${p.id}\n`;
            output += `Image URLs: ${JSON.stringify(p.image_urls)}\n`;
            output += "-------------------------\n";
        });
        fs.writeFileSync("products_dump.txt", output);
        console.log("Dumped to products_dump.txt");
    } catch (error) {
        console.error("Error:", error.message);
    }
};

fetchProducts();
