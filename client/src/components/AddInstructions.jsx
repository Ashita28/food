import React, { useEffect, useRef, useState } from 'react';
import { closePopup_icon } from '../assets';
import styles from './componentsStyles/instructions.module.css';

const AddInstructions = ({ id, initialValue = '', onClose, onCancel, onSubmit }) => {
  const [value, setValue] = useState(initialValue);
  const textareaRef = useRef(null);
  const sheetRef = useRef(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const handleBackdrop = (e) => {
    if (sheetRef.current && !sheetRef.current.contains(e.target)) onClose?.();
  };

  return (
    <div
      id={id}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${id}-title`}
      className={styles.backdrop}
      onMouseDown={handleBackdrop}
      onTouchStart={handleBackdrop}
    >
      <div className={styles.sheet} ref={sheetRef} onMouseDown={(e) => e.stopPropagation()}>
        <button
          type="button"
          aria-label="Close"
          className={styles.closeBtn}
          onClick={onClose}
        >
          <img src={closePopup_icon} alt="" />
        </button>

        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit?.(value.trim());
          }}
        >
          <h1 id={`${id}-title`} className={styles.title}>
            Add Cooking instructions
          </h1>

          <div className={styles.ipArea}>

          <div className={styles.textareaBorder}>
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              rows={4}
              inputMode="text"
            />
            </div>

            <p className={styles.note}>
              The restaurant will try its best to follow your request. However, refunds or
              cancellations in this regard won’t be possible.
            </p>
          </div>

          <section className={styles.btns}>
            <button
              type="button"
              className={styles.btnLight}
              onClick={onCancel}
            >
              Cancel
            </button>
            <button type="submit" className={styles.btnDark}>
              Next
            </button>
          </section>
        </form>
      </div>
    </div>
  );
};

export default AddInstructions;
