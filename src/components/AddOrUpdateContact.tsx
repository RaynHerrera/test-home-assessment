import { ChangeEvent, useState } from 'react';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { db, storage } from '@/config/firebaseConfig';
import Spinner from './Spinner';
import type { Contact } from '@/types/contact';
import type { ModalType } from '@/types/modal';

interface ContactProps {
  onClose?: () => void;
  onChanged: (changed: boolean) => void;
  initialContact?: Contact;
}

const AddOrUpdateContact: React.FC<ContactProps> = ({ onClose, onChanged, initialContact }) => {
  const [modalStatus, setModalStatus] = useState<ModalType>(initialContact ? "View" : "Add");
  const [name, setName] = useState<string>(initialContact?.name || '');
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>(initialContact?.image || '');
  const [lastContactDate, setLastContactDate] = useState<string>(initialContact?.lastContactDate || '');
  const [uploadProgress, setUploadProgress] = useState<number>(-1);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setImage(file);
    const reader = new FileReader();

    reader.onload = () => {
      setImageUrl(reader.result as string);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSaveContact = async () => {
    try {
      if (!name || !lastContactDate || (modalStatus === 'Add' && !image)) {
        setError('All fields are required.');
        return;
      }
      if (image && !image.type.startsWith('image/')) {
        setError('Please select an image file.');
        return;
      }
      if (image && image.size > 10 * 1024 * 1024) {
        setError('Image size should be less than 10MB.');
        return;
      }
      setError('');
      setIsSaving(true);
      if (image) {
        const imageName = `${uuidv4()}.${image.name.split('.').pop()}`;
        const imageRef = ref(storage, `images/${imageName}`);
        const uploadTask = uploadBytesResumable(imageRef, image);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const percent = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setUploadProgress(percent);
          },
          (err) => {
            setIsSaving(false);
            setError('Error uploading image.');
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(async (_imageUrl) => {
              const contactData = {
                name,
                image: _imageUrl,
                lastContactDate
              };
              if (modalStatus && initialContact) {
                await updateDoc(doc(db, "contacts", initialContact.id), contactData);
              } else {
                await addDoc(collection(db, 'contacts'), contactData);
              }
              setIsSaving(false);
              onChanged(true);
              if (onClose) {
                onClose();
              }
            }).catch((err) => {
              console.log(err);
              setIsSaving(false);
              setError('Error adding contact.');
            });
          }
        );
      } else {
        const contactData = {
          name,
          lastContactDate
        };
        if (modalStatus && initialContact) {
          await updateDoc(doc(db, "contacts", initialContact.id), contactData);
        } else {
          await addDoc(collection(db, 'contacts'), contactData);
        }
        setIsSaving(false);
        onChanged(true);
        if (onClose) {
          onClose();
        }
      }
    } catch (error) {
      console.error('Error saving contact:', error);
      setIsSaving(false);
      setError('Error saving contact.');
    }
  };

  const isEdit = modalStatus !== 'View';
  const title = (modalStatus === "Add" ? "Create" : modalStatus === 'Update' ? "Update" : "View") + " a Contact";
  const buttonTitle = (modalStatus === "Add" ? "Save" : modalStatus === 'Update' ? "View" : "Update") + " Contact";

  return (
    <>
      <div className='rounded-md w-full md:w-[600px] p-6 md:p-8 bg-white flex flex-col items-center md:items-start'>
        <h2 className='font-bold text-2xl'>{title}</h2>
        <label className='text-[#666666] text-lg my-4 font-bold'>Contact Name</label>
        <input
          type='text'
          className='md:ml-4 p-4 font-bold'
          value={name}
          onChange={e => setName(e.target.value)}
          readOnly={!isEdit}
        />
        <label className='text-[#666666] text-lg my-4 font-bold'>Image</label>
        <div className='flex flex-col md:flex-row items-center'>
          {
            modalStatus !== "Add" ? <img
              className='w-[60px] h-[60px] rounded-full mr-4'
              src={imageUrl}
              alt={name}
            /> : <></>
          }
          {
            isEdit ? <input
              className='max-w-[260px]'
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            /> : <></>
          }
        </div>
        <label className='text-[#666666] text-lg my-4 font-bold'>Last Contact Date</label>
        <input
          type='date'
          value={lastContactDate}
          onChange={e => setLastContactDate(e.target.value)}
          readOnly={!isEdit}
        />
        {error && <p className="text-red-500 mt-4">{error}</p>}
        <div className='mx-2 md:mx-0 w-full mt-12 flex flex-wrap'>
          <button
            className='rounded-md w-full md:w-fit bg-[#1E7FDF] text-white font-bold text-xl py-2 px-4 flex justify-center'
            onClick={() => {
              if (modalStatus === "Add") {
                handleSaveContact();
              } else if (modalStatus === "Update") {
                setModalStatus("View");
              } else {
                setModalStatus("Update");
              }
            }}
          >
            {
              buttonTitle
            }
          </button>
          {
            modalStatus === 'Update' &&
            <button
              className='rounded-md w-full md:w-fit mt-4 ml-0 md:ml-4 md:mt-0 bg-[#1E7FDF] text-white font-bold text-xl py-2 px-4 flex justify-center'
              onClick={handleSaveContact}
            >
              Save
            </button>
          }
        </div>
      </div>
      {
        isSaving && <Spinner percent={uploadProgress} />
      }
    </>
  );
};

export default AddOrUpdateContact;
