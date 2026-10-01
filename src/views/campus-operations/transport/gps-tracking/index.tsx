import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { ActionLink } from '@components/workspace';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import FleetMap from './components/FleetMap';
import TrackingModals from './modals/TrackingModals';
import type { TrackingModalId } from './modals/TrackingModals';
import type { FleetAlert, Vehicle } from './data/fleet.data';
import {
  alertTint, alerts as allAlerts, branchOptions, completionPct, driverOptions, fleet,
  fuelTint, gpsStatusOptions, isOnTrip, mapLayers, mapLegend, routeOptions, searchIndexOf,
  stateBadge, stopsRemaining, tripOptions, vehicleStatusOptions,
} from './data/fleet.data';

/**
 * The eight tiles of the template's Trip Information card, in its own order and
 * with its own icons and tints. Every value comes off the selected vehicle.
 */
const tripTiles = (vehicle: Vehicle) => [
  { label: 'Trip Start', value: vehicle.tripStart, icon: 'ti ti-clock-play', tint: 'primary' },
  { label: 'Est. Arrival', value: vehicle.estArrival, icon: 'ti ti-clock-check', tint: 'info' },
  { label: 'Delay', value: vehicle.delay, icon: 'ti ti-alarm', tint: 'warning' },
  { label: 'Total Distance', value: vehicle.totalDistance, icon: 'ti ti-route', tint: 'secondary' },
  { label: 'Stops Covered', value: String(vehicle.stopsCovered), icon: 'ti ti-map-pin-check', tint: 'success' },
  { label: 'Stops Remaining', value: String(stopsRemaining(vehicle)), icon: 'ti ti-map-pin', tint: 'danger' },
  { label: 'Avg Speed', value: vehicle.avgSpeed, icon: 'ti ti-gauge', tint: 'teal' },
  { label: 'Completion', value: `${completionPct(vehicle)}%`, icon: 'ti ti-progress', tint: 'primary' },
];

const routes = all_routes;

type DetailTab = 'vehicle' | 'route' | 'driver' | 'students';

interface Filters {
  route: string;
  driver: string;
  'vehicle-status': string;
  'gps-status': string;
  trip: string;
  'school-branch': string;
}

/** The template opens with three chips already on the rail. */
const initialFilters: Filters = {
  route: '',
  driver: '',
  'vehicle-status': '',
  'gps-status': 'Online',
  trip: 'Morning Pickup',
  'school-branch': 'Main Campus',
};

const blankFilters: Filters = {
  route: '', driver: '', 'vehicle-status': '', 'gps-status': '', trip: '', 'school-branch': '',
};

const chipTint: Record<string, string> = {
  'school-branch': 'primary',
  'gps-status': 'success',
  trip: 'info',
  route: 'secondary',
  driver: 'secondary',
  'vehicle-status': 'secondary',
};

const chipLabel: Record<string, string> = {
  route: 'Route',
  driver: 'Driver',
  'vehicle-status': 'Status',
  'gps-status': 'GPS',
  trip: 'Trip',
  'school-branch': 'Branch',
};

const GpsTracking = () => {
  const [selectedId, setSelectedId] = useState<string>(fleet[0].id);
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [draft, setDraft] = useState<Filters>(initialFilters);
  const [search, setSearch] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [mapView, setMapView] = useState<'Map' | 'Satellite'>('Map');
  const [traffic, setTraffic] = useState(true);
  const [tab, setTab] = useState<DetailTab>('vehicle');
  const [activeModal, setActiveModal] = useState<TrackingModalId | null>(null);
  const [layers, setLayers] = useState<string[]>(mapLayers.map((layer) => layer.id));
  const [layerMenu, setLayerMenu] = useState(false);
  const [zoom, setZoom] = useState(1);
  const layerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const { toasts, push, dismiss } = useToasts();

  /* -------------------------------- Narrowing ------------------------------- */

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return fleet.filter((vehicle) => {
      if (term && !searchIndexOf(vehicle).includes(term)) return false;
      if (filters.route && vehicle.route !== filters.route) return false;
      if (filters.driver && vehicle.driver !== filters.driver) return false;
      if (filters['vehicle-status']) {
        // "On Trip" in the filter covers the template's On Trip and Active cards.
        const wanted = filters['vehicle-status'];
        const matches = wanted === 'On Trip' ? isOnTrip(vehicle) : vehicle.state === wanted;
        if (!matches) return false;
      }
      if (filters['gps-status'] && vehicle.gps !== filters['gps-status']) return false;
      if (filters.trip && vehicle.trip !== filters.trip) return false;
      if (filters['school-branch'] && vehicle.branch !== filters['school-branch']) return false;
      return true;
    });
  }, [filters, search]);

  /** Keep a selection that survives filtering; fall back to the first match. */
  const selected: Vehicle | null =
    visible.find((vehicle) => vehicle.id === selectedId) ?? visible[0] ?? null;

  const onlineCount = fleet.filter((vehicle) => vehicle.gps === 'Online').length;

  const chips = useMemo(
    () =>
      (Object.keys(filters) as (keyof Filters)[])
        .filter((key) => filters[key] !== '')
        .map((key) => ({ id: key, label: chipLabel[key], value: filters[key] })),
    [filters],
  );

  const visibleAlerts = useMemo<FleetAlert[]>(
    () => allAlerts.filter((alert) => visible.some((vehicle) => vehicle.name === alert.vehicle)),
    [visible],
  );

  const criticalCount = visibleAlerts.filter((alert) => alert.level === 'Critical').length;

  /* --------------------------------- Handlers ------------------------------- */

  const clearChip = useCallback((id: string) => {
    setFilters((current) => ({ ...current, [id]: '' }));
    setDraft((current) => ({ ...current, [id]: '' }));
  }, []);

  const resetAll = useCallback(() => {
    setFilters(blankFilters);
    setDraft(blankFilters);
    setSearch('');
    push('Filters cleared');
  }, [push]);

  const select = useCallback((id: string) => {
    setSelectedId(id);
    setTab('vehicle');
  }, []);

  const openModal = useCallback((modal: TrackingModalId) => setActiveModal(modal), []);

  // Outside click and Escape close the layers menu, as Bootstrap's own does.
  useEffect(() => {
    if (!layerMenu) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!layerRef.current?.contains(event.target as Node)) setLayerMenu(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLayerMenu(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [layerMenu]);

  /** The map card's own fullscreen button, separate from the toolbar's. */
  const toggleMapFullscreen = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen();
    else mapRef.current?.requestFullscreen();
  }, []);

  const toggleLayer = useCallback((id: string) => {
    setLayers((current) =>
      current.includes(id) ? current.filter((layer) => layer !== id) : [...current, id],
    );
  }, []);

  const filterField = (id: keyof Filters, label: string, options: string[], blank: string) => (
    <div className="col-6" key={id}>
      <label className="form-label mb-1" htmlFor={id}>{label}</label>
      <select
        className="form-select"
        id={id}
        value={draft[id]}
        onChange={(event) => setDraft((current) => ({ ...current, [id]: event.target.value }))}
      >
        <option value="">{blank}</option>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </div>
  );

  const pair = (label: string, value: string) => (
    <li className="d-flex align-items-center justify-content-between py-1" key={label}>
      <span className="fs-13 text-muted">{label}</span>
      <span className="fs-13 fw-medium text-end">{value}</span>
    </li>
  );

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Fleet GPS Command Center</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item"><Link to={routes.adminDashboard}>Dashboard</Link></li>
                  <li className="breadcrumb-item"><Link to="#">Campus Operations</Link></li>
                  <li className="breadcrumb-item active" aria-current="page">Transport GPS Tracking</li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <span className="badge badge-soft-success d-inline-flex align-items-center me-2 mb-2">
                <i className="ti ti-circle-filled fs-6 me-1" />{onlineCount} Online
              </span>
              <button
                type="button"
                className="btn btn-outline-light bg-white me-2 mb-2 d-inline-flex align-items-center"
                onClick={() => push('Fleet positions refreshed')}
              >
                <i className="ti ti-refresh me-1" />Refresh
              </button>
            </div>
          </div>
          {/* /Page Header */}

          <div className="card mb-0 data-workspace">
            {/* Sticky Toolbar */}
            <div className="card-header border-bottom sticky-top bg-white">
              <div className="page-toolbar">
                <div className="search-toolbar">
                  <i className="ti ti-search search-toolbar-icon" />
                  <input
                    type="text"
                    placeholder="Search vehicle, route or driver…"
                    aria-label="Search vehicle"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                  <span className="search-toolbar-kbd">⌘K</span>
                </div>

                <div className="dropdown">
                  <button
                    type="button"
                    className="workspace-button dropdown-toggle"
                    aria-expanded={filterOpen}
                    onClick={() => setFilterOpen((current) => !current)}
                  >
                    <i className="ti ti-adjustments-horizontal" />Filters
                  </button>
                  <div className={`dropdown-menu p-3 filter-menu${filterOpen ? ' show' : ''}`}>
                    <div className="row g-3">
                      {filterField('route', 'Route', routeOptions, 'All Routes')}
                      {filterField('driver', 'Driver', driverOptions, 'All Drivers')}
                      {filterField('vehicle-status', 'Vehicle Status', vehicleStatusOptions, 'All')}
                      {filterField('gps-status', 'GPS Status', gpsStatusOptions, 'All')}
                      {filterField('trip', 'Trip', tripOptions, 'All')}
                      {filterField('school-branch', 'School Branch', branchOptions, 'All')}
                    </div>
                    <div className="d-flex align-items-center justify-content-end gap-2 mt-3 pt-3 border-top">
                      <button
                        type="button" className="btn btn-light btn-sm"
                        onClick={() => { setDraft(blankFilters); setFilters(blankFilters); setFilterOpen(false); push('Filters cleared'); }}
                      >
                        Reset
                      </button>
                      <button
                        type="button" className="btn btn-primary btn-sm"
                        onClick={() => { setFilters(draft); setFilterOpen(false); push('Filters applied'); }}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>

                <span className="flex-grow-1" />

                <div className="custom-btn-group custom-btn-group-sm" role="group" aria-label="Map view">
                  {(['Map', 'Satellite'] as const).map((view) => (
                    <button
                      type="button"
                      className={`btn${mapView === view ? ' active' : ''}`}
                      key={view}
                      onClick={() => setMapView(view)}
                    >
                      <i className={`ti ti-${view === 'Map' ? 'map' : 'satellite'} me-1`} />{view}
                    </button>
                  ))}
                </div>

                <div className="form-check form-switch mb-0 ms-1 d-flex align-items-center">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="lpTraffic"
                    checked={traffic} onChange={(event) => setTraffic(event.target.checked)}
                  />
                  <label className="form-check-label fs-13 text-muted ms-1" htmlFor="lpTraffic">Traffic</label>
                </div>

                <button
                  type="button" className="workspace-button workspace-button-icon"
                  title="Refresh" aria-label="Refresh"
                  onClick={() => push('Fleet positions refreshed')}
                >
                  <i className="ti ti-refresh" />
                </button>
              </div>

              <div className="quick-filters">
                <span className="text-muted fs-12 fw-semibold me-1">
                  <i className="ti ti-filter me-1" />Filters:
                </span>
                {chips.length === 0 ? (
                  <span className="fs-12 text-muted">None applied</span>
                ) : (
                  chips.map((chip) => (
                    <span
                      className={`badge badge-soft-${chipTint[chip.id]} d-inline-flex align-items-center`}
                      key={chip.id}
                    >
                      {chip.label} : {chip.value}
                      <ActionLink
                        className={`ms-1 text-${chipTint[chip.id]}`}
                        ariaLabel={`Remove ${chip.label} filter`}
                        onClick={() => clearChip(chip.id)}
                      >
                        <i className="ti ti-x" />
                      </ActionLink>
                    </span>
                  ))
                )}
                {chips.length > 0 ? (
                  <ActionLink className="btn btn-link btn-sm text-primary" onClick={resetAll}>
                    Clear all
                  </ActionLink>
                ) : null}
              </div>
            </div>
            {/* /Sticky Toolbar */}

            <div className="card-body">
              <div className="row g-3">
                {/* LEFT: Fleet Explorer */}
                <div className="col-xl-3 col-xxl-3">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <h5 className="mb-0 fs-15">Fleet Explorer</h5>
                    <span className="badge badge-soft-primary">{visible.length} Vehicles</span>
                  </div>

                  {visible.length === 0 ? (
                    <div className="text-center py-5">
                      <span className="avatar avatar-lg bg-primary-transparent text-primary rounded-circle mb-2">
                        <i className="ti ti-bus-off fs-20" />
                      </span>
                      <h6 className="mb-1">No vehicles match</h6>
                      <p className="fs-12 text-muted mb-0">Clear a filter to see the rest of the fleet.</p>
                    </div>
                  ) : (
                    visible.map((vehicle) => (
                      <div
                        className={`card card-hover mb-2${selected?.id === vehicle.id ? ' border-primary' : ''}`}
                        key={vehicle.id}
                      >
                        <div className="card-body p-3">
                          <div className="d-flex align-items-start">
                            <span className={`avatar avatar-lg bg-${vehicle.tint}-transparent text-${vehicle.tint} rounded me-2 flex-shrink-0`}>
                              <i className="ti ti-bus fs-24" />
                            </span>
                            <div className="flex-fill overflow-hidden">
                              <div className="d-flex align-items-center justify-content-between">
                                <h6 className="mb-0 text-truncate">{vehicle.name}</h6>
                                <span className={stateBadge[vehicle.state]}>{vehicle.state}</span>
                              </div>
                              <span className="fs-12 text-muted d-block text-truncate">
                                {vehicle.route} · {vehicle.driver}
                              </span>
                              <div className="d-flex align-items-center flex-wrap gap-2 mt-2">
                                <span className={`badge badge-soft-${vehicle.gps === 'Online' ? 'success' : 'danger'} d-inline-flex align-items-center`}>
                                  <i className="ti ti-circle-filled fs-5 me-1" />{vehicle.gps}
                                </span>
                                <span className="badge badge-soft-secondary d-inline-flex align-items-center">
                                  <i className="ti ti-gauge me-1" />{vehicle.speed} km/h
                                </span>
                                <span className="badge badge-soft-secondary d-inline-flex align-items-center">
                                  <i className="ti ti-users me-1" />{vehicle.students}
                                </span>
                              </div>
                            </div>
                          </div>

                          <ul className="list-unstyled mb-2 mt-3 fs-12">
                            <li className="d-flex align-items-center justify-content-between py-1">
                              <span className="text-muted"><i className="ti ti-map-pin me-1" />Location</span>
                              <span className="text-dark text-truncate ms-2">{vehicle.location}</span>
                            </li>
                            <li className="d-flex align-items-center justify-content-between py-1">
                              <span className="text-muted"><i className="ti ti-flag-3 me-1" />Next Stop</span>
                              <span className="text-dark ms-2">
                                {vehicle.nextStop === '—' ? '—' : `${vehicle.nextStop} · ${vehicle.nextStopEta}`}
                              </span>
                            </li>
                          </ul>

                          <div className="d-flex align-items-center justify-content-between mb-1">
                            <span className="fs-11 text-muted"><i className="ti ti-gas-station me-1" />Fuel</span>
                            <span className="fs-11 fw-semibold text-dark">{vehicle.fuel}%</span>
                          </div>
                          <div
                            className="progress progress-sm mb-3" role="progressbar" aria-label="Fuel level"
                            aria-valuenow={vehicle.fuel} aria-valuemin={0} aria-valuemax={100}
                          >
                            <div className={`progress-bar bg-${fuelTint(vehicle.fuel)}`} style={{ width: `${vehicle.fuel}%` }} />
                          </div>

                          <div className="d-flex align-items-center gap-2">
                            <ActionLink
                              className="btn btn-light btn-sm flex-fill"
                              onClick={() => { select(vehicle.id); openModal('vehicle'); }}
                            >
                              <i className="ti ti-info-circle me-1" />Details
                            </ActionLink>
                            <ActionLink
                              className="btn btn-primary btn-sm flex-fill"
                              onClick={() => select(vehicle.id)}
                            >
                              <i className="ti ti-map-2 me-1" />Track
                            </ActionLink>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {/* CENTER: Map + Trip + Alerts */}
                <div className="col-xl-6 col-xxl-6">
                  {selected ? (
                    <>
                      {/* Live Fleet Map */}
                      <div className="card mb-3">
                        <div className="card-header d-flex align-items-center justify-content-between flex-wrap gap-2">
                          <h6 className="mb-0 d-inline-flex align-items-center">
                            <i className="ti ti-map-2 text-primary me-2" />
                            Live Fleet Map
                            <span className="badge badge-soft-success d-inline-flex align-items-center ms-2">
                              <i className="ti ti-circle-filled fs-6 me-1" />Live
                            </span>
                          </h6>
                          <div className="d-flex align-items-center gap-1">
                            <div className="dropdown" ref={layerRef}>
                              <button
                                type="button"
                                className="btn btn-outline-light bg-white btn-icon btn-sm"
                                title="Map layers"
                                aria-label="Map layers"
                                aria-expanded={layerMenu}
                                onClick={() => setLayerMenu((current) => !current)}
                              >
                                <i className="ti ti-stack-2" />
                              </button>
                              <ul className={`dropdown-menu dropdown-menu-end p-2${layerMenu ? ' show' : ''}`}>
                                {mapLayers.map((layer) => (
                                  <li key={layer.id}>
                                    <label className="dropdown-item">
                                      <input
                                        className="form-check-input me-2 mt-0"
                                        type="checkbox"
                                        checked={layers.includes(layer.id)}
                                        onChange={() => toggleLayer(layer.id)}
                                      />
                                      {layer.label}
                                    </label>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="btn-group btn-group-sm" role="group" aria-label="Zoom">
                              <button
                                type="button"
                                className="btn btn-outline-light bg-white btn-icon btn-sm"
                                title="Zoom out"
                                aria-label="Zoom out"
                                disabled={zoom <= 1}
                                onClick={() => setZoom((current) => Math.max(1, current - 0.2))}
                              >
                                <i className="ti ti-minus" />
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-light bg-white btn-icon btn-sm"
                                title="Zoom in"
                                aria-label="Zoom in"
                                disabled={zoom >= 2}
                                onClick={() => setZoom((current) => Math.min(2, current + 0.2))}
                              >
                                <i className="ti ti-plus" />
                              </button>
                            </div>
                            <button
                              type="button"
                              className="btn btn-outline-light bg-white btn-icon btn-sm"
                              title="Fullscreen"
                              aria-label="Fullscreen"
                              onClick={toggleMapFullscreen}
                            >
                              <i className="ti ti-arrows-maximize" />
                            </button>
                          </div>
                        </div>
                        <div
                          className="card-body p-0 position-relative overflow-hidden rounded-bottom"
                          ref={mapRef}
                        >
                          {/*
                            The template's own SVG. Zoom scales it in place, which is
                            what its inert +/- buttons were reaching for; the layer
                            toggles hide the marker groups they name.
                          */}
                          <div
                            style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
                            className={layers.length === mapLayers.length ? undefined : 'map-layers-partial'}
                          >
                            <FleetMap />
                          </div>

                          <div className="position-absolute top-0 end-0 m-3 d-flex flex-column gap-2">
                            <button
                              type="button"
                              className="btn btn-white bg-white btn-icon btn-sm rounded-circle flex-shrink-0 shadow-sm"
                              title="Recenter"
                              aria-label="Recenter"
                              onClick={() => { setZoom(1); push('Map recentred'); }}
                            >
                              <i className="ti ti-current-location" />
                            </button>
                            <button
                              type="button"
                              className="btn btn-white bg-white btn-icon btn-sm rounded-circle flex-shrink-0 shadow-sm"
                              title="My location"
                              aria-label="My location"
                              onClick={() => push(`Centred on ${selected.name}`)}
                            >
                              <i className="ti ti-gps" />
                            </button>
                          </div>

                          <div className="position-absolute bottom-0 start-0 m-3 bg-white rounded shadow-sm p-2">
                            <div className="d-flex flex-wrap gap-3 fs-12">
                              {mapLegend.map((item) => (
                                <span className="d-inline-flex align-items-center" key={item.label}>
                                  <i className={`ti ti-circle-filled text-${item.tint} me-1`} />
                                  {item.label}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* /Live Fleet Map */}

                      {/* Trip Information */}
                      <div className="card mb-3">
                        <div className="card-header d-flex align-items-center justify-content-between">
                          <h6 className="mb-0">Trip Information</h6>
                          <span className="badge badge-soft-primary">{selected.trip}</span>
                        </div>
                        <div className="card-body">
                          <div className="row g-3">
                            {tripTiles(selected).map((tile) => (
                              <div className="col-xl-6 col-lg-4 col-sm-6" key={tile.label}>
                                <div className="border rounded p-3 h-100">
                                  <div className="d-flex align-items-center gap-2 mb-1">
                                    <span className={`avatar avatar-sm bg-${tile.tint}-transparent text-${tile.tint} rounded`}>
                                      <i className={tile.icon} />
                                    </span>
                                    <span className="fs-12 text-muted">{tile.label}</span>
                                  </div>
                                  <h5 className="mb-0">{tile.value}</h5>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-3">
                            <div className="d-flex align-items-center justify-content-between mb-1">
                              <span className="fs-13 fw-semibold">Route Completion</span>
                              <span className="fs-13 fw-semibold text-success">
                                {completionPct(selected)}%
                              </span>
                            </div>
                            <div
                              className="progress progress-sm"
                              role="progressbar"
                              aria-label="Route completion"
                              aria-valuenow={completionPct(selected)}
                              aria-valuemin={0}
                              aria-valuemax={100}
                            >
                              <div
                                className="progress-bar bg-success"
                                style={{ width: `${completionPct(selected)}%` }}
                              />
                            </div>
                          </div>
                          <div className="d-flex gap-2 mt-3">
                            <button
                              type="button"
                              className="btn btn-outline-light bg-white btn-sm"
                              onClick={() => openModal('trip')}
                            >
                              <i className="ti ti-report me-1" />Trip Summary
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-light bg-white btn-sm"
                              onClick={() => openModal('route')}
                            >
                              <i className="ti ti-route me-1" />Route Details
                            </button>
                          </div>
                        </div>
                      </div>
                      {/* /Trip Information */}

                      {/* Operational Alerts */}
                      <div className="card mb-0">
                        <div className="card-header d-flex align-items-center justify-content-between">
                          <h6 className="mb-0">
                            <i className="ti ti-bell-ringing text-danger me-1" />Operational Alerts
                          </h6>
                          <span className="badge badge-soft-danger">{criticalCount} Critical</span>
                        </div>
                        <div className="card-body pb-1">
                          {visibleAlerts.length === 0 ? (
                            <p className="fs-13 text-muted mb-2">No alerts for the vehicles in view.</p>
                          ) : (
                            visibleAlerts.map((alert) => (
                              <ActionLink
                                className="d-flex align-items-center gap-2 border rounded p-2 mb-2 text-reset"
                                key={alert.id}
                                ariaLabel={`Select ${alert.vehicle}`}
                                onClick={() => select(fleet.find((v) => v.name === alert.vehicle)?.id ?? selected.id)}
                              >
                                <span className={`avatar avatar-sm bg-${alertTint[alert.level]}-transparent text-${alertTint[alert.level]} rounded flex-shrink-0`}>
                                  <i className={alert.icon} />
                                </span>
                                <div className="flex-fill overflow-hidden">
                                  <h6 className="fs-13 mb-0 text-truncate">{alert.title}</h6>
                                  <span className="fs-12 text-muted text-truncate d-block">{alert.detail}</span>
                                </div>
                                <span className={`badge badge-soft-${alertTint[alert.level]}`}>{alert.level}</span>
                              </ActionLink>
                            ))
                          )}
                        </div>
                      </div>
                      {/* /Operational Alerts */}
                    </>
                  ) : (
                    /* Empty state (no active trips) */
                    <div className="card mb-0">
                      <div className="card-body text-center py-5">
                        <span className="avatar avatar-xxl bg-primary-transparent text-primary rounded-circle mb-3">
                          <i className="ti ti-bus-off fs-36" />
                        </span>
                        <h5 className="mb-1">No Active Trips</h5>
                        <p className="text-muted mb-3">
                          There are no vehicles currently on a trip. Select a vehicle from the fleet
                          explorer to view its live location and details.
                        </p>
                        <button type="button" className="btn btn-primary" onClick={resetAll}>
                          <i className="ti ti-rotate me-1" />Select Vehicle
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                {/* /CENTER */}

                {/* RIGHT: Live Vehicle Details */}
                <div className="col-xl-3 col-xxl-3">
                  <div className="card mb-0">
                    <div className="card-header">
                      <h5 className="mb-0 fs-15">Live Vehicle Details</h5>
                    </div>
                    <div className="card-body">
                      {selected ? (
                        <>
                          <div className="d-flex align-items-center mb-3">
                            <span className={`avatar avatar-lg bg-${selected.tint}-transparent text-${selected.tint} rounded flex-shrink-0`}>
                              <i className="ti ti-bus fs-20" />
                            </span>
                            <div className="ms-2 overflow-hidden">
                              <h5 className="mb-0 fs-15 d-flex align-items-center gap-2">
                                {selected.name}
                                <span className={stateBadge[selected.state]}>{selected.state}</span>
                              </h5>
                              <span className="fs-12 text-muted d-block text-truncate">
                                {selected.registration} · {selected.route}
                              </span>
                            </div>
                          </div>

                          <div className="d-flex flex-wrap gap-2 mb-3">
                            <button type="button" className="btn btn-outline-light bg-white btn-sm" onClick={() => openModal('gps')}>
                              <i className="ti ti-satellite me-1" />GPS Information
                            </button>
                            <button type="button" className="btn btn-outline-light bg-white btn-sm" onClick={() => openModal('driver')}>
                              <i className="ti ti-user me-1" />Driver Details
                            </button>
                            <button
                              type="button" className="btn btn-outline-light bg-white btn-sm"
                              onClick={() => push(`Live location for ${selected.name} shared`)}
                            >
                              <i className="ti ti-share me-1" />Share Location
                            </button>
                          </div>

                          <ul className="nav nav-tabs nav-tabs-bottom mb-3">
                            {(['vehicle', 'route', 'driver', 'students'] as DetailTab[]).map((id) => (
                              <li className="nav-item" key={id}>
                                <ActionLink
                                  className={`nav-link${tab === id ? ' active' : ''}`}
                                  onClick={() => setTab(id)}
                                >
                                  {id.charAt(0).toUpperCase() + id.slice(1)}
                                </ActionLink>
                              </li>
                            ))}
                          </ul>

                          {tab === 'vehicle' ? (
                            <ul className="list-unstyled mb-0">
                              {pair('Route', selected.route)}
                              {pair('Driver', selected.driver)}
                              {pair('Assistant', selected.assistant)}
                              {pair('Current Address', selected.address)}
                              {pair('Last GPS Update', selected.lastUpdate)}
                              {pair('Current Speed', `${selected.speed} km/h`)}
                              {pair('Odometer', selected.odometer)}
                              {pair("Today's Distance", selected.todayDistance)}
                              {pair('Engine', selected.engine)}
                              {pair('AC', selected.ac)}
                              {pair('Trip Status', `${selected.state} · ${selected.trip}`)}
                              {pair('Fuel Level', `${selected.fuel}%`)}
                            </ul>
                          ) : null}

                          {tab === 'route' ? (
                            <>
                              <ul className="list-unstyled mb-3">
                                {pair('Route Name', selected.route)}
                                {pair('Total Stops', String(selected.totalStops))}
                                {pair('Distance', selected.routeDistance)}
                                {pair('Est. Duration', selected.estDuration)}
                              </ul>
                              <h6 className="fs-14 mb-2">Upcoming Stops</h6>
                              {selected.upcoming.length === 0 ? (
                                <p className="fs-13 text-muted mb-0">No upcoming stops on this trip.</p>
                              ) : (
                                selected.upcoming.map((stop) => (
                                  <div className="d-flex align-items-center justify-content-between border rounded p-2 mb-2" key={stop.name}>
                                    <span className="fs-13"><i className="ti ti-map-pin text-muted me-2" />{stop.name}</span>
                                    <span className="fs-12 text-muted">{stop.eta}</span>
                                  </div>
                                ))
                              )}
                            </>
                          ) : null}

                          {tab === 'driver' ? (
                            <>
                              <div className="d-flex align-items-center mb-3">
                                <span className="avatar avatar-lg bg-info-transparent text-info rounded flex-shrink-0">
                                  <i className="ti ti-user fs-20" />
                                </span>
                                <div className="ms-2">
                                  <h6 className="mb-0">{selected.driver}</h6>
                                  <span className="fs-12 text-muted">Driver · {selected.driverExperience}</span>
                                </div>
                              </div>
                              <ul className="list-unstyled mb-3">
                                {pair('Phone', selected.driverPhone)}
                                {pair('License', `${selected.driverLicence} · ${selected.driverLicenceYear}`)}
                                {pair('Assistant', selected.assistant)}
                                {pair('Rating', selected.driverRating)}
                              </ul>
                              <div className="d-flex gap-2">
                                <button
                                  type="button" className="btn btn-outline-light bg-white btn-sm flex-fill"
                                  onClick={() => push(`Calling ${selected.driver}`)}
                                >
                                  <i className="ti ti-phone me-1" />Call
                                </button>
                                <button
                                  type="button" className="btn btn-outline-light bg-white btn-sm flex-fill"
                                  onClick={() => push(`Message sent to ${selected.driver}`)}
                                >
                                  <i className="ti ti-message me-1" />Message
                                </button>
                              </div>
                            </>
                          ) : null}

                          {tab === 'students' ? (
                            <>
                              <div className="row g-2 mb-3">
                                <div className="col-6">
                                  <div className="border rounded p-3 text-center">
                                    <span className="fs-12 text-muted d-block mb-1">Picked Up</span>
                                    <h5 className="mb-0 text-success">{selected.pickedUp}</h5>
                                  </div>
                                </div>
                                <div className="col-6">
                                  <div className="border rounded p-3 text-center">
                                    <span className="fs-12 text-muted d-block mb-1">Remaining</span>
                                    <h5 className="mb-0 text-warning">{selected.remaining}</h5>
                                  </div>
                                </div>
                              </div>
                              <ul className="list-unstyled mb-3">
                                {pair('Next Student', selected.nextStudent)}
                                {pair('Next Stop', selected.nextStop)}
                                {pair('Arrival Time', selected.arrivalTime)}
                                {pair('Parent Notification', selected.parentNotification)}
                              </ul>
                              <button
                                type="button" className="btn btn-primary w-100"
                                onClick={() => openModal('students')}
                              >
                                <i className="ti ti-users me-1" />Full Pickup List
                              </button>
                            </>
                          ) : null}
                        </>
                      ) : (
                        <p className="fs-13 text-muted mb-0">
                          Select a vehicle from the fleet explorer to see its live details.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}

      <TrackingModals
        active={activeModal}
        vehicle={selected}
        onClose={() => setActiveModal(null)}
        onToast={push}
        onOpen={(modal) => setActiveModal(modal)}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="lpToasts" />
    </>
  );
};

export default GpsTracking;
