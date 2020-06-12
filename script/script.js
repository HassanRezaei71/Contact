const $modalElem = $("#modalForm");

renderTable();

function removeContact(id) {
  let contactList = JSON.parse(localStorage.getItem("contactList"));
  contactList = contactList.filter((item) => item.id != id);
  localStorage.setItem("contactList", JSON.stringify(contactList));
  renderTable();
}

function renderTable() {
  const contactList = JSON.parse(localStorage.getItem("contactList"));

  if (!contactList) {
    localStorage.setItem("contactList", JSON.stringify([]));
    return;
  }

  if ($("tbody").length > 0) {
    $("tbody").remove();
  }

  const tbody = $("<tbody></tbody>");

  contactList.map((contact) => {
    const tr = $("<tr></tr>").append(
      `<td class="text-dark">${contact.id}</td>
        <td class="text-dark">${contact.name}</td>
        <td class="text-dark">${contact.lastName}</td>
        <td class="text-dark">${contact.phone}</td>
        <td class="text-dark">${contact.email}</td>
        <td>
          <button onclick="deleteContact(${contact.id})" class="btn back-red text-moon"> <i class='fa fa-trash'></i></button>
          <button onclick="edit(${contact.id})" class="btn back-green text-moon"> <i class='fa fa-edit'></i></button>
        </td>`
    );
    tbody.append(tr);
  });

  $("#contact_table").append(tbody);
}

function showForm() {
  $modalElem.modal();
}

function resetInputs() {
  $(":input")
    .not(":button, :submit, :reset, :hidden, :checkbox, :radio")
    .val("");
}

function hideForm() {
  $modalElem.modal("hide");
  resetInputs();
}

$("#contact_form").on("submit", (event) => {
  event.preventDefault();

  let contactList = JSON.parse(localStorage.getItem("contactList"));

  const newContact = new FormData(event.target);

  const new_contact = new Object();
  for (item of newContact.entries()) {
    new_contact[item[0]] = item[1];
  }

  const contact = contactList.find((item) => item.id == new_contact.id);
  if (contact) {
    contactList = contactList.map((item) =>
      item.id == new_contact.id ? new_contact : item
    );
  } else {
    contactList.push(new_contact);
  }

  localStorage.setItem("contactList", JSON.stringify(contactList));

  hideForm();
  renderTable();
});

function deleteContact(id) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#14C2A3",
    cancelButtonColor: "#E82D62",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.value) {
      removeContact(id);
      Swal.fire({
        title: "Deleted!",
        text: "Your contact had been deleted.",
        icon: "success",
        confirmButtonColor: "#14C2A3",
        confirmButtonText: "Ok",
      });
    }
  });
}

function edit(id) {
  const contactList = JSON.parse(localStorage.getItem("contactList"));
  const contact = contactList.find((item) => item.id == id);
  showForm();
  $("#id_id").val(contact.id);
  $("#id_name").val(contact.name);
  $("#id_last_name").val(contact.lastName);
  $("#id_phone").val(contact.phone);
  $("#id_email").val(contact.email);
}

$modalElem.on("hidden.bs.modal", function (e) {
  resetInputs();
});
