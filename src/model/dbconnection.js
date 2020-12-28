// import mongoose from "mongoose";

// const url = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.lkdbo.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`;

// export default async () => {
//   try {
//     const conn = await mongoose.connect(
//       url,
//       {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//         useCreateIndex: true,
//       },
//       () => console.log("Connected to database")
//     );
//     return conn;
//   } catch (err) {
//     console.log("Error : DB not connected");
//   }
// };
