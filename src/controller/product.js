import Product from "../model/product.js";
// import sortid from "shortid";
import slugify from "slugify";
import Category from "../model/category.js";

export const createProduct = (req, res) => {
  const { name, price, description, quantity, category, createdBy } = req.body;

  let productPictures = [];

  if (req.files.length > 0) {
    productPictures = req.files.map((file) => {
      return {
        img: file.filename,
      };
    });
  }

  const product = new Product({
    name: name,
    slug: slugify(name),
    price,
    description,
    productPictures,
    category,
    quantity,
    createdBy: req.user._id,
  });

  product.save((error, product) => {
    if (error) return res.status(400).json({ error });
    if (product) {
      res.status(201).json({ product });
    }
  });

  // res.status(200).json({ file: req.files, body: req.body });
};

export const getProductBySlug = (req, res) => {
  const { slug } = req.params;

  Category.findOne({ slug: slug })
    .select("_id")
    .exec((error, category) => {
      if (error) {
        return res.status(400).json({ error });
      }

      if (category) {
        Product.find({ category: category._id }).exec((error, products) => {
          if (error) {
            return res.status(400).json({ error });
          }

          if (products.length > 0) {
            res.status(200).json({
              products,
              productByPrice: {
                under5k: products.filter((x) => x.price <= 5000),
                under10k: products.filter(
                  (x) => x.price >= 5000 && x.price <= 10000
                ),
                under15k: products.filter(
                  (x) => x.price >= 10000 && x.price <= 15000
                ),
                under20k: products.filter(
                  (x) => x.price >= 15000 && x.price <= 20000
                ),
                under30k: products.filter(
                  (x) => x.price >= 20000 && x.price <= 30000
                ),
              },
            });
          }
        });
      }
    });
};

export const getProductDetailsById = (req, res) => {
  const { productId } = req.params;
  if (productId) {
    Product.findOne({
      _id: productId,
    }).exec((error, product) => {
      if (error) return res.status(400).json({ error });
      if (product) {
        res.status(200).json({ product });
      }
    });
  } else {
    return res.status(400).json({
      error: "Parmas Required",
    });
  }
};
