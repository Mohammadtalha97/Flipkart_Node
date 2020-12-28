import slugify from "slugify";

import Category from "../model/category.js";

export const addCategory = (req, res) => {
  try {
    const categoryObj = {
      name: req.body.name,
      slug: slugify(req.body.name), //unique
    };

    if (req.file) {
      categoryObj.categoryImage =
        `${process.env.API}/public/` + req.file.filename;
    }

    if (req.body.parentId) {
      categoryObj.parentId = req.body.parentId;
    }

    const cat = new Category(categoryObj);
    cat.save((err, category) => {
      if (err) return res.status(400).json({ err });
      if (category) {
        return res.status(201).json({
          category,
          message: "category created successfully...!!",
        });
      }
    });
  } catch (err) {
    console.log("called");
    res.status(500).json({
      Error: err,
    });
  }
};

const createCategories = (categories, parentId = null) => {
  const categoryList = [];
  let category;

  if (parentId == null) {
    category = categories.filter((cat) => cat.parentId == undefined);
  } else {
    category = categories.filter((cat) => cat.parentId == parentId);
  }

  category.map((cate) => {
    categoryList.push({
      _id: cate._id,
      name: cate.name,
      slug: cate.slug,
      parentId: cate.parentId,
      children: createCategories(categories, cate._id),
    });
  });

  return categoryList;
};

export const getCategories = (req, res) => {
  Category.find({}).exec((err, categories) => {
    if (err) return res.status(400).json({ err });
    if (categories) {
      const categoryList = createCategories(categories);
      return res.status(200).json({ categoryList });
    }
  });
};
