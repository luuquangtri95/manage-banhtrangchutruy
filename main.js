import { useState } from "react";

const obj = {
  title: {
    name: "Order",
    value: "Dat banh trang",
  },
  fullname: {
    name: "Tai",
    value: "Phamtai",
  },
  address: {
    name: "Viet nam",
    value: "Hiep binh chanh",
  },
  status: {
    name: "status",
    type: "select",
    select: [
      { value: "pending", label: "Pending" },
      { value: "active", label: "Active" },
    ],
  },
};

const objCategories = [
  { label: "xike", quantity: 5, value: "7c6fb6a1-2ab1-4d47-bad3-1ff621aa1ab6" },
  {
    label: "muoi bo",
    quantity: 3,
    value: "7c6fb6a1-2ab1-4d47-bad3-1ff634a1ab6",
  },
];

const myObj = {};

Object.keys(obj).forEach((item) => {
  if (obj[item].type === "select") {
    myObj[item] = obj[item].select[0].value;
  } else {
    myObj[item] = obj[item].value;
  }
});

myObj.data_json = {
  item: objCategories.map((_item) => {
    return { name: _item.label, quantity: _item.quantity };
  }),
};

// console.log("myObj", JSON.stringify(myObj));

// {
//   title: "Dat banh trang",
//   fullname: "Phamtai",
//   address: "Hiep binh chanh",
//   data_json: {
//     item: [
//       {name: "xike", quantity: 5},
//       {name: "muoi bo", quantity: 3}
//     ]
//   },
//   status: "pending",
// }

const datePicker = function (value) {
  const date = new Date(value);
  const dateEmpty = new Date();
  console.log("date", date);
  console.log("dateEmpty", dateEmpty);
  console.log("first", date.getTime());
  console.log("Empty", dateEmpty);
  // if (date < dateEmpty) {
  //   return "Loi roi";
  // }
};
console.log("datePicker", datePicker("2025-02-06"));

// function Student(name, age) {
//   this.ten = name;
//   this.age = age;
// }
// let first = new Student("tai", 30);
// let second = new Student("pham", 29);
// console.log("first", first);
// console.log("second", second);
// console.log("Student", Student.prototype);
