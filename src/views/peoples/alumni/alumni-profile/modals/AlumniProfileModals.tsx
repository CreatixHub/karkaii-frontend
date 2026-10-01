import { useState } from 'react';
import DateField from '@components/ui/DateField';
import Modal from '@components/ui/Modal';
import CommonSelect from '@core/common/commonSelect';
import type { AlumniProfileModalId } from '../data/alumniProfile.data';

const paymentModes = ['Card', 'Bank Transfer', 'Cash'].map((value) => ({ value, label: value }));

export interface AlumniProfileModalsProps {
  active: AlumniProfileModalId | null;
  onClose: () => void;
  onToast: (message: string) => void;
}

const AlumniProfileModals = ({ active, onClose, onToast }: AlumniProfileModalsProps) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [date, setDate] = useState('');
  const [paymentMode, setPaymentMode] = useState('Card');

  const submitEmail = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onToast('Email sent successfully');
    setSubject('');
    setMessage('');
    onClose();
  };

  const submitDonation = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onToast('Donation saved successfully');
    setAmount('');
    setPurpose('');
    setDate('');
    onClose();
  };

  return (
    <>
      <Modal
        open={active === 'sendEmail'}
        onClose={onClose}
        title="Send Email"
        dialogClassName="modal-lg"
        onSubmit={submitEmail}
        footer={
          <>
            <a href="#" className="btn btn-light me-2" onClick={(event) => { event.preventDefault(); onClose(); }}>
              Cancel
            </a>
            <button type="submit" className="btn btn-primary">
              Send Email
            </button>
          </>
        }
      >
        <div className="mb-3">
          <label className="form-label" htmlFor="subject">
            Subject
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter subject"
            id="subject"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
          />
        </div>
        <div className="mb-0">
          <label className="form-label" htmlFor="message">
            Message
          </label>
          <textarea
            rows={5}
            className="form-control"
            placeholder="Write your message"
            id="message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
        </div>
      </Modal>

      <Modal
        open={active === 'addDonation'}
        onClose={onClose}
        title="Add Donation"
        onSubmit={submitDonation}
        footer={
          <>
            <a href="#" className="btn btn-light me-2" onClick={(event) => { event.preventDefault(); onClose(); }}>
              Cancel
            </a>
            <button type="submit" className="btn btn-primary">
              Save Donation
            </button>
          </>
        }
      >
        <div className="mb-3">
          <label className="form-label" htmlFor="amount">
            Amount <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter amount"
            required
            id="amount"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="purpose">
            Purpose
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Scholarship Fund"
            id="purpose"
            value={purpose}
            onChange={(event) => setPurpose(event.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="date">
            Date
          </label>
          <div className="date-pic">
            <DateField
              placeholder="Select"
              id="date"
              value={date}
              onChange={(dateString) => setDate(dateString as string)}
            />
            <span className="cal-icon">
              <i className="ti ti-calendar" />
            </span>
          </div>
        </div>
        <div className="mb-0">
          <label className="form-label" htmlFor="payment-mode">
            Payment Mode
          </label>
          <CommonSelect
            inputId="payment-mode"
            options={paymentModes}
            value={{ value: paymentMode, label: paymentMode }}
            onChange={(option) => setPaymentMode(option?.value ?? 'Card')}
          />
        </div>
      </Modal>
    </>
  );
};

export default AlumniProfileModals;
