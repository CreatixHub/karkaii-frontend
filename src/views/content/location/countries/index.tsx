import NameStatusModals from '../../shared/NameStatusModals';
import LocationPage from '../LocationPage';
import type { LocationRow } from '../LocationPage';
import {
  COUNTRIES,
  COUNTRY_REF_TOP,
  countryCodes,
  countryNames,
  refOf,
  STATUS_OPTIONS,
} from '../data/location.data';

const ROWS: LocationRow[] = COUNTRIES.map((country, index) => ({
  id: country.code.toLowerCase(),
  ref: refOf('CO', COUNTRY_REF_TOP, index),
  name: country.name,
  status: country.status,
  cells: [country.name, country.code],
}));

const Countries = () => (
  <LocationPage
    title="Countries"
    cardTitle="Countries List"
    noun="Country"
    plural="countries"
    scope="countries"
    columnLabels={['Country Name', 'Country Code']}
    rows={ROWS}
    fields={[
      { id: 'country', label: 'Country', options: countryNames },
      { id: 'code', label: 'Code', options: countryCodes },
      { id: 'status', label: 'Status', options: STATUS_OPTIONS },
    ]}
    matches={(row, filters) => {
      if (filters.country && row.name !== filters.country) return false;
      if (filters.code && row.cells[1] !== filters.code) return false;
      if (filters.status && row.status !== filters.status) return false;
      return true;
    }}
    renderDialog={({ open, row, onClose, onSaved }) => (
      <NameStatusModals
        open={open}
        noun="Country"
        value={row ? { name: row.name, active: row.status === 'Active' } : null}
        onClose={onClose}
        onSave={(draft) => onSaved(open === 'edit' ? `${draft.name} saved` : `${draft.name} added`)}
      />
    )}
  />
);

export default Countries;
