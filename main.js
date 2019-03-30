class Contact {
    constructor(subject, massage, gender, phone, email) {
        this.subject = subject;
        this.massage = massage;
        this.gender = gender;
        this.phone = phone;
        this.email = email;
    }
}
class UI {

    static displayContact() {
        const contacts = Store.getContact();

        contacts.forEach(contact => UI.addContactToList(contact));
    }

    static addContactToList(contact) {
        const list = document.querySelector('#contact-list');

        const row = document.createElement('tr');

        row.innerHTML = `
        <td>${contact.subject}</td>
        <td>${contact.massage}</td>
        <td>${contact.gender}</td>
        <td>${contact.phone}</td>
        <td>${contact.email}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete"> X </a></td>
        `;

        list.appendChild(row);
    }

    static deleteContact(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#contact-form');
        container.insertBefore(div, form);

        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static clearFields() {
        document.querySelector('#subject').value = '';
        document.querySelector('#massage').value = '';
        document.querySelector('#genderm').checked = true;
        document.querySelector('#phone').value = '';
        document.querySelector('#email').value = '';
    }
}

class Store {

    static getContact() {
        let contacts;
        if (localStorage.getItem('contacts') == null) {
            contacts = [];
        } else {
            contacts = JSON.parse(localStorage.getItem('contacts'));
        }
        return contacts;
    }

    static addContact(contact) {
        const contacts = Store.getContact();
        contacts.push(contact);
        localStorage.setItem('contacts', JSON.stringify(contacts));
    }

    static removeContact(subject, massage) {
        const contacts = Store.getContact();

        contacts.forEach((contact, index) => {
            if (contact.subject === subject && contact.massage === massage) {
                contacts.splice(index, 1);
            }
        });

        localStorage.setItem('contacts', JSON.stringify(contacts));
    }
}

document.addEventListener('DOMContentLoaded', UI.displayContact);

document.querySelector('#contact-form').addEventListener('submit', (e) => {

    e.preventDefault();

    const subject = document.querySelector('#subject').value;
    const massage = document.querySelector('#massage').value;
    let gender = document.getElementById('genderm');
    if (gender.checked) {
        gender = document.querySelector('#genderm').value;
    } else {
        gender = document.querySelector('#genderf').value;
    }
    const phone = document.querySelector('#phone').value;
    const email = document.querySelector('#email').value;


    if (subject === '' || massage === '' || phone === '' || email === '') {
        UI.showAlert('Please fill in all fields', 'danger');
    } else {

        const contact = new Contact(subject, massage, gender, phone, email);
        UI.addContactToList(contact);

        Store.addContact(contact);

        UI.showAlert('Contact Added', 'success');

        UI.clearFields();
    }
});

document.querySelector('#contact-list').addEventListener('click', (e) => {

    //console.log(e.target.parentElement.previousElementSibling.previousElementSibling.textContent);

    UI.deleteContact(e.target);

    Store.removeContact(e.target.parentElement.previousElementSibling.previousElementSibling
        .previousElementSibling.previousElementSibling.previousElementSibling.textContent,
        e.target.parentElement.previousElementSibling.previousElementSibling
            .previousElementSibling.previousElementSibling.textContent);

    UI.showAlert('Contact Removed', 'success');
});