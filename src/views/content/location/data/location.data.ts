export type LocationStatus = 'Active' | 'Inactive';

/* ------------------------------------------------------------------ *
 * The register                                                       *
 * ------------------------------------------------------------------ */

export interface Country {
  name: string;
  code: string;
  status: LocationStatus;
}

export interface State {
  name: string;
  country: string;
  status: LocationStatus;
}

export interface City {
  name: string;
  state: string;
  status: LocationStatus;
}

export const COUNTRIES: Country[] = [
  { name: 'United States', code: 'US', status: 'Active' },
  { name: 'Canada', code: 'CA', status: 'Active' },
  { name: 'United Kingdom', code: 'UK', status: 'Active' },
  { name: 'Germany', code: 'DE', status: 'Active' },
  { name: 'France', code: 'FR', status: 'Active' },
  { name: 'Argentina', code: 'AR', status: 'Active' },
  { name: 'India', code: 'IN', status: 'Active' },
  { name: 'Italy', code: 'IT', status: 'Active' },
  { name: 'New Zealand', code: 'NZ', status: 'Active' },
  { name: 'Australia', code: 'AU', status: 'Active' },
];

export const STATES: State[] = [
  { name: 'California', country: 'United States', status: 'Active' },
  { name: 'New York', country: 'United States', status: 'Active' },
  { name: 'Texas', country: 'United States', status: 'Active' },
  { name: 'Bavaria', country: 'Germany', status: 'Active' },
  { name: 'Quebec', country: 'Canada', status: 'Active' },
  { name: 'Ontario', country: 'Canada', status: 'Active' },
  { name: 'Florida', country: 'United States', status: 'Active' },
  { name: 'Berlin', country: 'Germany', status: 'Active' },
  { name: 'Victoria', country: 'Australia', status: 'Active' },
  { name: 'Gauteng', country: 'Egypt', status: 'Active' },
];

export const CITIES: City[] = [
  { name: 'Los Angeles', state: 'California', status: 'Active' },
  { name: 'New York City', state: 'New York', status: 'Active' },
  { name: 'Houston', state: 'Texas', status: 'Active' },
  { name: 'Munich', state: 'Bavaria', status: 'Active' },
  { name: 'Montreal', state: 'Quebec', status: 'Active' },
  { name: 'Toronto', state: 'Ontario', status: 'Active' },
  { name: 'Miami', state: 'Florida', status: 'Active' },
  { name: 'Calgary', state: 'Berlin', status: 'Active' },
  { name: 'Melbourne', state: 'Victoria', status: 'Active' },
  { name: 'Johannesburg', state: 'Gauteng', status: 'Active' },
];

/* ------------------------------------------------------------------ *
 * What follows from it                                               *
 * ------------------------------------------------------------------ */

/** A city's country is its state's country; it is not stored twice. */
export const countryOfState = (stateName: string) =>
  STATES.find((state) => state.name === stateName)?.country ?? '';

/** The reference numbers each template counts down from, newest row first. */
export const COUNTRY_REF_TOP = 378258;
export const STATE_REF_TOP = 364285;
export const CITY_REF_TOP = 357268;

export const refOf = (prefix: string, top: number, index: number) => `${prefix}${top - index}`;

export const statusTint = (status: LocationStatus) =>
  status === 'Active' ? 'success' : 'danger';

export const STATUS_OPTIONS: LocationStatus[] = ['Active', 'Inactive'];

/** Each facet offers what the register holds rather than a list beside it. */
export const countryNames = COUNTRIES.map((row) => row.name);
export const countryCodes = COUNTRIES.map((row) => row.code);
export const stateNames = STATES.map((row) => row.name);
export const cityNames = CITIES.map((row) => row.name);
/** Every country a state is filed under, including any the country list omits. */
export const stateCountries = [...new Set(STATES.map((row) => row.country))];
