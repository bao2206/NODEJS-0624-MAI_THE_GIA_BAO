// const { writeFile, readFile } = require("../utils/helper");
// const { v4: uuidv4 } = require("uuid");
const ItemModel = require("../models/item_model");
// let generateId = () => {
//   return Math.floor(Math.random() * 10000000000).toString();
// };
class ItemService {
  // findAll = async () => {
  //   return await readFile();
  // };
  // addElement = async (name, ordering, status) => {
  //   const id = generateId();
  //   // const idConvert = parseInt(id, 10);
  //   const newItem = { id, name, ordering, status };
  //   const data = await readFile();
  //   console.log("Data hien tai", data);
  //   data.push(newItem);
  //   console.log("Data da duoc them vao", data);
  //   await writeFile(data);
  //   return newItem;
  // };
  // getEleById = async (id) => {
  //   const data = await readFile();
  //   const updateItemIndex = data.findIndex((item) => item.id === id.toString());
  //   // if (updateItemIndex !== -1) {
  //   //   data[updateItemIndex] = { ...data[updateItemIndex], ...updatedData };
  //   //   await writeFile(data);
  //   //   return data[updateItemIndex];
  //   // }
  //   return updateItemIndex;
  // };
  // updateEleById = async (id, updatedData) => {
  //   const idStr = id.toString();

  //   const data = await readFile();

  //   const updateItemIndex = data.findIndex((item) => item.id === idStr);
  //   console.log(updateItemIndex);

  //   if (updateItemIndex !== -1) {
  //     data[updateItemIndex] = { ...data[updateItemIndex], ...updatedData };
  //     await writeFile(data);
  //     return data[updateItemIndex];
  //   }

  //   return null;
  // };
  // deleteEleById = async (id) => {
  //   const data = await readFile();
  //   const index = data.findIndex((item) => item.id === id.toString());
  //   if (index !== -1) {
  //     const deletedItem = data.splice(index, 1);
  //     await writeFile(data);
  //     return deletedItem;
  //   }
  //   return null;
  // };
  getEleById = async (id) => {
    return await ItemModel.findById(id);
  };
  saveUser = async (name, status, ordering) => {
    console.log(name, status, ordering);
    await ItemModel.create({
      name,
      ordering,
      status,
    });
  };
  getAllItems = async () => {
    return await ItemModel.find();
  };
  deleteItemById = async (id) => {
    return await ItemModel.findByIdAndDelete(id);
  };
  updateItemById = async (id, updatedData) => {
    const item = await ItemModel.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    console.log("item_service", item);
    return item;
  };
}
module.exports = new ItemService();
