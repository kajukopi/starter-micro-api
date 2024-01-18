function moduleForm(form) {
  return {
    push: async (url) => {
      const formData = new FormData(form);
      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      const data = Object.fromEntries(formData);
      try {
        const response = await fetch(`http://localhost:3000/api/push/${url}`, {
          method: "POST",
          headers: headers,
          body: JSON.stringify(data),
        });
        const result = response.json();
        return result;
      } catch (error) {
        return error;
      }
    },
    get: async (url) => {
      try {
        const response = await fetch(`http://localhost:3000/api/${url}`, {
          method: "GET",
        });
        const result = response.json();
        return result;
      } catch (error) {
        return error;
      }
    },
    delete: (data) => {
      console.log(data);
    },
  };
}

const form = document.querySelector("[data-mdb-form]");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  moduleForm(form)
    .push()
    .then((result) => {
      console.log(result);
      form.reset();
    })
    .catch((error) => {
      console.log(error);
    });
});

moduleForm()
  .get("items")
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.log(error);
  });
