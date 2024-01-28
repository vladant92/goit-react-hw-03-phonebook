import { Component } from 'react';
import { nanoid } from 'nanoid';

import { saveLocalStorage, loadLocalStorage } from './Utils/localStorage';

import { Section } from './Section/Section';
import { ContactForm } from './ContactForm/ContactForm';
import { Filter } from './Filter/Filter';
import { ContactList } from './ContactList/ContactList';

const LS_CONTACTS_KEY = 'contacts';

export class App extends Component {
  state = {
    contacts: [],
    filter: '',
  };

  componentDidMount() {
    const localStorageContacts = loadLocalStorage(LS_CONTACTS_KEY);

    if (localStorageContacts) this.setState({ contacts: localStorageContacts });
  }

  componentDidUpdate(_, prevState) {
    const { contacts } = this.state;

    if (prevState.contacts !== contacts) {
      saveLocalStorage(LS_CONTACTS_KEY, contacts);
    }
  }

  addContact = data => {
    const { contacts } = this.state;
    const newContact = {
      id: nanoid(),
      ...data,
    };

    contacts.some(({ name }) => name === data.name)
      ? alert(`${data.name} is already in contacts`)
      : this.setState(prevState => ({
          contacts: [...prevState.contacts, newContact],
        }));
  };

  deleteContact = userId => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(contact => contact.id !== userId),
    }));
  };

  handleChangeFilter = ({ currentTarget: { value } }) => {
    this.setState({ filter: value });
  };

  getFilterContacts = () => {
    const { filter, contacts } = this.state;
    const FilterlowerCase = filter.toLowerCase();
    return contacts.filter(({ name }) =>
      name.toLowerCase().includes(FilterlowerCase)
    );
  };

  render() {
    const { filter } = this.state;

    return (
      <>
        <Section title="Phonebook">
          <ContactForm addContact={this.addContact} />
        </Section>
        <Section title="Contacts">
          <Filter value={filter} handleChangeFilter={this.handleChangeFilter} />

          <ContactList
            contacts={this.getFilterContacts()}
            deleteContact={this.deleteContact}
          />
        </Section>
      </>
    );
  }
}
