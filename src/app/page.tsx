"use client";
import { useState } from 'react';
import ContactsList from '@/components/ContactsList';
import AddOrUpdateContact from '@/components/AddOrUpdateContact';
import Modal from '@/components/Modal';
import type { Contact } from '@/types/contact';

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isChangedContacts, setIsChangedContacts] = useState(true);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleOpenModal = (contact: Contact | null) => {
    setSelectedContact(contact);
    setShowModal(true);
  };

  return (
    <div>
      <ContactsList
        isChangedContacts={isChangedContacts}
        onChangedContacts={setIsChangedContacts}
        onViewContact={handleOpenModal}
      />
      {showModal && (
        <Modal 
          onClose={handleCloseModal}
        >
          <AddOrUpdateContact
            initialContact={selectedContact || undefined}
            onChanged={setIsChangedContacts}
            onClose={handleCloseModal}
          />
        </Modal>
      )}
    </div>
  );
}
