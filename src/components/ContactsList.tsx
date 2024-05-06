import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';
import { Contact } from '@/types/contact';

interface ContactsListProps {
  isChangedContacts: boolean;
  onChangedContacts: (changed: boolean) => void;
  onViewContact: (contact: Contact | null) => void;
}

const ContactsList: React.FC<ContactsListProps> = ({ isChangedContacts, onChangedContacts, onViewContact }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const contactsCollection = await getDocs(query(collection(db, "contacts"), orderBy('lastContactDate', "asc")));
        const contactsData: Contact[] = contactsCollection.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Contact[];
        setContacts(contactsData);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };
    
    const loadData = async () => {
      if (isChangedContacts) {
        setIsLoading(true);
        await fetchContacts();
        setIsLoading(false);
        onChangedContacts(false);
      }
    };
  
    loadData();
  }, [isChangedContacts]);

  return (
    <div className='container mx-auto px-4'>
      <div className='flex justify-between items-center my-12'>
        <h3 className='text-2xl md:text-3xl font-bold'>Contacts</h3>
        <button
          className='text-white font-bold py-2 px-4 flex justify-center rounded-md bg-[#1E7FDF]'
          onClick={() => onViewContact(null)}
        >
          Add Contact
        </button>
      </div>
      {contacts.length === 0 ? (
        <p className='text-2xl font-bold text-center'>
          {
            isLoading ? "Fetching data..." : "No Contacts"
          }
        </p>
      ) : (
        <ul>
          {contacts.map(contact => (
            <li 
              key={contact.id} 
              className='flex flex-wrap md:items-center cursor-pointer rounded-md border-2 border-[#EEEEEE] my-2 py-2 px-4'
              onClick={() => onViewContact(contact)}
            >
              <div className='w-full md:w-[40%] ml-4 md:ml-0 flex items-center'>
                <img
                  className='w-[60px] h-[60px] rounded-full mr-4'
                  src={contact.image}
                  alt={contact.name}
                />
                <p className='text-xl text-[#555555] font-bold'>{contact.name}</p>
              </div>
              <p className='my-4 md:mt-0 w-full md:w-[60%] ml-12 md:ml-0 text-xl text-[#555555] font-bold'>{contact.lastContactDate}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ContactsList;