// Переписать тудушку:

// 1. Get the item using GET request
// 2. Delete items using DELETE request
// 3. Create using POST
// 4. Edit using PUT/PATCH

const URL = "http://localhost:3000/todos";

// const toDoItem = {
//   isDone: false,
//   text: "Bread",
// };

// fetch(URL, {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify(toDoItem),
// });

//variables
let input, btn, list, form, clearBtn;

//create an array of todo list items
let items = [];
let listType = "all";

//create function
const createItem = (text) => {
  // const ids = [
  //   0,
  //   ...items.map((item) => {
  //     return item.id;
  //   }),
  // ];

  // const max = Math.max(...ids);

  // items.push({
  //   id: max + 1,
  //   text: text,
  //   isDone: false,
  // });

  toApiStorage({
    text: text,
    isDone: false,
  });

  renderList();
};

//delete function
const deleteItem = (id) => {
  // items = items.filter((item) => {
  //   return item.id !== id;
  // });
  // renderList();
  deleteApiStorage(id);
};

//checked function

//rewrite in new API way
const checkedItem = (id, checked) => {
  // items.forEach((item) => {
  //   if (item.id === id) {
  //     item.isDone = checked;
  //   }
  // });

  // renderList();

  patchApiStorage(id, {
    isDone: checked,
  });
};

//Render list

// API
const loadApiStorage = () => {
  // Piece of code below should be loaded once on page load and the data should be put into your items array
  fetch(URL)
    .then((response) => response.json())
    .then((data) => {
      items = data;
      renderList();
    });
};

const toApiStorage = (item) => {
  fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  }).then(loadApiStorage);
};

const deleteApiStorage = (id) => {
  fetch(`${URL}/${id}`, {
    method: "DELETE",
  }).then(loadApiStorage);
};

const patchApiStorage = (id, change) => {
  fetch(`${URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(change),
  }).then(loadApiStorage);
};

const deleteAllApiStorage = () => {
  const itemsIdsArray = items.map((item) => item.id);
  itemsIdsArray.forEach((id) => {
    deleteApiStorage(id);
  });
};

//Local storage

// const toLocalStorage = () => {
//   localStorage.setItem("data", JSON.stringify(items));
// };

// const loadLocalStorage = () => {
//   let rawData = localStorage.getItem("data");
//   if (rawData) {
//     items = JSON.parse(rawData);
//     renderList();
//   }
// };

// const deleteLocalStorage = () => {
//   localStorage.clear();
//   items = [];
//   renderList();
// };

const renderList = () => {
  list.textContent = "";

  items.forEach((item) => {
    if (
      (listType === "inprogress" && item.isDone) ||
      (listType === "completed" && !item.isDone)
    ) {
      return false;
    }

    const li = document.createElement("li");
    li.className = "li";
    list.appendChild(li);

    const div = document.createElement("div");
    div.className = "div";
    li.appendChild(div);

    const checkBox = document.createElement("input");
    checkBox.className = "check__box";
    checkBox.setAttribute("type", "checkbox");
    // If the item is done, set the checkbox to checked
    if (item.isDone) {
      checkBox.setAttribute("checked", "checked");
    }

    checkBox.addEventListener("change", () => {
      checkedItem(item.id, checkBox.checked);
    });

    div.appendChild(checkBox);

    const span = document.createElement("span");
    span.textContent = item.text;

    // If the item is done, add the 'crossed__text' class to the span
    if (item.isDone) {
      span.classList.add("crossed__text");
    }

    div.appendChild(span);

    const btn = document.createElement("i");
    btn.className = "fa-solid fa-trash-can";
    div.appendChild(btn);
    btn.addEventListener("click", (e) => {
      deleteItem(item.id);
    });
  });
};

//Add to list
const addToList = () => {
  if (input.value === "") return;
  createItem(input.value);
  input.value = "";
};

const makeBtnActive = (element) => {
  document.querySelectorAll(".menu .button").forEach((el) => {
    el.classList.remove("active");
  });
  element.classList.add("active");
};

window.addEventListener("DOMContentLoaded", () => {
  input = document.querySelector(".input__text");
  list = document.querySelector(".action__list");
  form = document.querySelector(".input__wrapper");
  clearBtn = document.querySelector(".btn__clear");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    addToList();
  });

  clearBtn.addEventListener("click", (e) => {
    e.preventDefault();
    deleteAllApiStorage();
  });
  //List type button click
  const listTypeBtn = document.querySelectorAll(".menu .button");

  listTypeBtn.forEach((listTypeBtn) => {
    listTypeBtn.addEventListener("click", (e) => {
      makeBtnActive(e.target);

      listType = e.target.dataset.type;

      renderList();
    });
  });
  loadApiStorage();
});
