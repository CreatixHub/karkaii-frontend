import { useEffect, useState } from 'react';
import Modal from '@components/ui/Modal';
import { ActionLink } from '@components/workspace';
import LocationPage from '../LocationPage';
import type { LocationRow } from '../LocationPage';
import {
  countryNames,
  refOf,
  STATE_REF_TOP,
  STATES,
  stateCountries,
  stateNames,
  STATUS_OPTIONS,
} from '../data/location.data';

const ROWS: LocationRow[] = STATES.map((state, index) => ({
  id: state.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  ref: refOf('ST', STATE_REF_TOP, index),
  name: state.name,
  status: state.status,
  cells: [state.name, state.country],
}));

/** The add/edit dialog the template ships: a state name and its country. */
const StateDialog = ({
  open,
  row,
  onClose,
  onSaved,
}: {
  open: 'add' | 'edit' | null;
  row: LocationRow | null;
  onClose: () => void;
  onSaved: (message: string) => void;
}) => {
  const [name, setName] = useState('');
  const [country, setCountry] = useState(countryNames[0]);

  useEffect(() => {
    if (!open) return;
    setName(open === 'edit' && row ? row.name : '');
    setCountry(open === 'edit' && row ? row.cells[1] : countryNames[0]);
  }, [open, row]);

  const body = (
    <div className="row">
      <div className="col-md-12">
        <div className="mb-3">
          <label className="form-label" htmlFor="state-name">
            State Name
          </label>
          <input
            type="text"
            className="form-control"
            id="state-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="state-country">
            Country Name
          </label>
          <select
            className="form-select"
            id="state-country"
            value={country}
            onChange={(event) => setCountry(event.target.value)}
          >
            {countryNames.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  const footer = (label: string) => (
    <>
      <ActionLink className="btn btn-light me-2" onClick={onClose}>
        Cancel
      </ActionLink>
      <button type="submit" className="btn btn-primary">
        {label}
      </button>
    </>
  );

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    onSaved(open === 'edit' ? `${name} saved` : `${name} added`);
  };

  return (
    <>
      <Modal open={open === 'add'} onClose={onClose} title="Add State" onSubmit={submit} footer={footer('Add State')}>
        {body}
      </Modal>
      <Modal open={open === 'edit'} onClose={onClose} title="Edit State" onSubmit={submit} footer={footer('Save Changes')}>
        {body}
      </Modal>
    </>
  );
};

const States = () => (
  <LocationPage
    title="States"
    cardTitle="States List"
    noun="State"
    plural="states"
    scope="states"
    columnLabels={['State Name', 'Country Name']}
    rows={ROWS}
    fields={[
      { id: 'state', label: 'States', options: stateNames },
      { id: 'country', label: 'Country', options: stateCountries },
      { id: 'status', label: 'Status', options: STATUS_OPTIONS },
    ]}
    matches={(row, filters) => {
      if (filters.state && row.name !== filters.state) return false;
      if (filters.country && row.cells[1] !== filters.country) return false;
      if (filters.status && row.status !== filters.status) return false;
      return true;
    }}
    renderDialog={(args) => <StateDialog {...args} />}
  />
);

export default States;
