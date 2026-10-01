import { useEffect, useMemo, useState } from 'react';
import Modal from '@components/ui/Modal';
import { ActionLink } from '@components/workspace';
import LocationPage from '../LocationPage';
import type { LocationRow } from '../LocationPage';
import {
  CITIES,
  CITY_REF_TOP,
  cityNames,
  countryOfState,
  refOf,
  stateCountries,
  stateNames,
  STATUS_OPTIONS,
} from '../data/location.data';

const ROWS: LocationRow[] = CITIES.map((city, index) => ({
  id: city.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  ref: refOf('CI', CITY_REF_TOP, index),
  name: city.name,
  status: city.status,
  cells: [city.name, city.state, countryOfState(city.state)],
}));

/** The add/edit dialog: a city, its state, and the country that follows. */
const CityDialog = ({
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
  const [state, setState] = useState(stateNames[0]);

  useEffect(() => {
    if (!open) return;
    setName(open === 'edit' && row ? row.name : '');
    setState(open === 'edit' && row ? row.cells[1] : stateNames[0]);
  }, [open, row]);

  const country = useMemo(() => countryOfState(state), [state]);

  const body = (
    <div className="row">
      <div className="col-md-12">
        <div className="mb-3">
          <label className="form-label" htmlFor="city-name">
            City Name
          </label>
          <input
            type="text"
            className="form-control"
            id="city-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="city-state">
            State Name
          </label>
          <select
            className="form-select"
            id="city-state"
            value={state}
            onChange={(event) => setState(event.target.value)}
          >
            {stateNames.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="city-country">
            Country Name
          </label>
          <input type="text" className="form-control" id="city-country" value={country} readOnly />
          <small className="text-muted fs-12">Follows the state; it is not asked for twice.</small>
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
      <Modal open={open === 'add'} onClose={onClose} title="Add City" onSubmit={submit} footer={footer('Add City')}>
        {body}
      </Modal>
      <Modal open={open === 'edit'} onClose={onClose} title="Edit City" onSubmit={submit} footer={footer('Save Changes')}>
        {body}
      </Modal>
    </>
  );
};

const Cities = () => (
  <LocationPage
    title="Cities"
    cardTitle="Cities List"
    noun="City"
    plural="cities"
    scope="cities"
    columnLabels={['City Name', 'State Name', 'Country Name']}
    rows={ROWS}
    fields={[
      { id: 'city', label: 'City', options: cityNames },
      { id: 'state', label: 'State', options: stateNames },
      { id: 'country', label: 'Country', options: stateCountries },
      { id: 'status', label: 'Status', options: STATUS_OPTIONS },
    ]}
    matches={(row, filters) => {
      if (filters.city && row.name !== filters.city) return false;
      if (filters.state && row.cells[1] !== filters.state) return false;
      if (filters.country && row.cells[2] !== filters.country) return false;
      if (filters.status && row.status !== filters.status) return false;
      return true;
    }}
    renderDialog={(args) => <CityDialog {...args} />}
  />
);

export default Cities;
