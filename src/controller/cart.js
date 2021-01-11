import Cart from "../model/cart.js";

// export const addItemToCart = (req, res) => {
//   //(1)
//   Cart.findOne({ user: req.user._id }).exec((error, cart) => {
//     if (error) return res.status(400).json({ error });
//     //(3)
//     if (cart) {
//       const product = req.body.cartItems.product;
//       //(4)
//       const item = cart.cartItems.find((c) => c.product == product);

//       let condition, update;

//       //(6)
//       if (item) {
//         condition = { user: req.user._id, "cartItems.product": product };
//         update = {
//           $set: {
//             "cartItems.$": {
//               ...req.body.cartItems,
//               quantity: item.quantity + req.body.cartItems.quantity,
//             },
//           },
//         };
//       }
//       //(5)
//       else {
//         condition = { user: req.user._id };
//         update = {
//           $push: {
//             cartItems: req.body.cartItems,
//           },
//         };
//       }
//       Cart.findOneAndUpdate(condition, update).exec((error, cart) => {
//         if (error) return res.status(400).json({ error });
//         if (cart) {
//           return res.status(201).json({ cart: cart });
//         }
//       });
//     } //(2)
//     else {
//       const cart = new Cart({
//         user: req.user._id,
//         cartItems: [req.body.cartItems],
//       });

//       cart.save((error, cart) => {
//         if (error) return res.status(400).json({ error });
//         if (cart) {
//           return res.status(201).json({ cart });
//         }
//       });
//     }
//   });
// };

function runUpdate(condition, updateData) {
  return new Promise((resolve, reject) => {
    Cart.findOneAndUpdate(condition, updateData, { upsert: true })
      .then((result) => resolve())
      .catch((err) => reject(err));
  });
}

export const addItemToCart = (req, res) => {
  Cart.findOne({ user: req.user._id }).exec((error, cart) => {
    if (error) return res.status(400).json({ error });
    if (cart) {
      let promiseArray = [];

      req.body.cartItems.forEach((cartItem) => {
        const product = cartItem.product;
        const item = cart.cartItems.find((c) => c.product == product);
        let condition, update;
        if (item) {
          condition = { user: req.user._id, "cartItems.product": product };
          update = {
            $set: {
              "cartItems.$": cartItem,
            },
          };
        } else {
          condition = { user: req.user._id };
          update = {
            $push: {
              cartItems: cartItem,
            },
          };
        }
        promiseArray.push(runUpdate(condition, update));
      });
      Promise.all(promiseArray)
        .then((response) => res.status(201).json({ response }))
        .catch((error) => res.status(400).json({ error }));
    } else {
      const cart = new Cart({
        user: req.user._id,
        cartItems: req.body.cartItems,
      });
      cart.save((error, cart) => {
        if (error) return res.status(400).json({ error });
        if (cart) {
          return res.status(201).json({ cart });
        }
      });
    }
  });
};

export const getCartItems = (req, res) => {
  Cart.findOne({ user: req.user._id })
    .populate("cartItems.product", "_id name price productPictures")
    .exec((error, cart) => {
      if (error) return res.status(400).json({ error });
      if (cart) {
        let cartItems = {};
        cart.cartItems.forEach((item, index) => {
          cartItems[item.product._id.toString()] = {
            _id: item.product._id.toString(),
            name: item.product.name,
            img: item.product.productPictures[0].img,
            price: item.product.price,
            qty: item.quantity,
          };
        });
        res.status(200).json({ cartItems });
      }
    });
};

/*

(1) find that any cart is added or not
(2) if cart is not there then add into database
(3) if cart is there then...
(4) check the userInput product is already there...?
(5) No..? then find with userId and push into array
(6) Yes..? then find with userId and product for incresing quantity

*/
