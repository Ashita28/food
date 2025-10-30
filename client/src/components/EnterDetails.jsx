import React, { useState } from 'react';
import styles from './componentsStyles/details.module.css';
import { useCreateUserMutation } from '../redux/userApi';

const indianMobileRegex = /^[6-9]\d{9}$/;

const EnterDetails = ({ onClose }) => {
  const [form, setForm] = useState({
    name: '',
    numOfPerson: 1,
    address: '',
    contact: '',
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [createUser, { isLoading }] = useCreateUserMutation();

  const onChange = (key) => (e) => {
    const val = key === 'numOfPerson' ? Number(e.target.value) : e.target.value;
    setForm((f) => ({ ...f, [key]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!form.name || !form.numOfPerson || !form.address || !form.contact) {
      setErrorMsg('All fields are required.');
      return;
    }
    if (form.numOfPerson < 1) {
      setErrorMsg('Number of persons must be at least 1.');
      return;
    }
    if (!indianMobileRegex.test(String(form.contact).trim())) {
      setErrorMsg('Enter a valid 10-digit Indian mobile number.');
      return;
    }

    const res = await createUser(form);
    if ('error' in res) {
      setErrorMsg(res.error?.data?.error || 'Failed to save. Please try again.');
      return;
    }

    const id = res.data?.user?._id;
    if (id) localStorage.setItem('user_id', id);

    if (typeof onClose === 'function') onClose();
  };

  return (
    <div className={styles.popup}>
      <section className={styles.formContainer}>
        <h1>Enter Your Details</h1>

        <form onSubmit={handleSubmit} className={styles.detailsForm}>
          <div className={styles.ipFields}>
            <label>Name</label>
            <input
              type="text"
              placeholder="full name"
              value={form.name}
              onChange={onChange('name')}
              required
            />
          </div>

          <div className={styles.ipFields}>
            <label>Number of Person</label>
            <input
              type="number"
              min={1}
              placeholder="2, 4, 6"
              value={form.numOfPerson}
              onChange={onChange('numOfPerson')}
              required
            />
          </div>

          <div className={styles.ipFields}>
            <label>Address</label>
            <input
              type="text"
              placeholder="address"
              value={form.address}
              onChange={onChange('address')}
              required
            />
          </div>

          <div className={styles.ipFields}>
            <label>Contact</label>
            <input
              type="tel"
              placeholder="phone"
              value={form.contact}
              onChange={onChange('contact')}
              required
            />
          </div>

          {errorMsg && <p className={styles.error}>{errorMsg}</p>}

          <div className={styles.btnContainer}>
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving…' : 'Order Now'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default EnterDetails;
