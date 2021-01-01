import slugify from "slugify";
import shortId from "shortid";
import Category from "../model/category.js";

export const addCategory = (req, res) => {
  try {
    const categoryObj = {
      name: req.body.name,
      slug: `${slugify(req.body.name)} - ${shortId.generate()}`, //unique
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
    /*
      Electronics
      Sports
      Men
      Women  
    */
  } else {
    category = categories.filter((cat) => cat.parentId == parentId);
    /*
      - Electronics
        - Mobile
        - Laptop
        - Camera
   */
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

export const updateCategories = async (req, res) => {
  const { _id, name, parentId, type } = req.body;
  const updatedCategories = [];
  if (name instanceof Array) {
    for (let i = 0; i < name.length; i++) {
      const category = {
        name: name[i],
        type: type[i],
      };
      if (parentId[i] !== "") {
        category.parentId = parentId[i];
      }
      const updatedCategory = await Category.findOneAndUpdate(
        { _id: _id[i] },
        category,
        {
          new: true,
        }
      );
      updatedCategories.push(updatedCategory);
    }
    return res.status(201).json({ updatedCategories });
  } else {
    const category = { name, type };
    if (parentId !== "") {
      category.parentId = parentId;
    }
    const updatedCategory = await Category.findOneAndUpdate({ _id }, category, {
      new: true,
    });
    res.status(201).json({ updatedCategory });
  }
};

export const deleteCategories = async (req, res) => {
  const { ids } = req.body.payload;
  const deletedCategoriesArray = [];

  for (let i = 0; i < ids.length; i++) {
    const deleted = await Category.findOneAndDelete({
      _id: ids[i]._id,
    });

    deletedCategoriesArray.push(deleted);
  }

  if (deletedCategoriesArray.length == ids.length) {
    res.status(200).json({ message: "Categories removed" });
  } else {
    res.status(400).json({ message: "Something went wrong" });
  }
};
