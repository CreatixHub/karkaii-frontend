import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import ActionGrid from './components/ActionGrid';
import AlumniSkeleton from './components/AlumniSkeleton';
import ChapterGrid from './components/ChapterGrid';
import EventGrid from './components/EventGrid';
import MemberGrid from './components/MemberGrid';
import MemberPreviewPanel from './components/MemberPreviewPanel';
import OpportunityGrid from './components/OpportunityGrid';
import ResourceGrid from './components/ResourceGrid';
import RosterGrid from './components/RosterGrid';
import SpotlightGrid from './components/SpotlightGrid';
import type { ToolbarMenu } from './components/WorkspaceToolbar';
import WorkspaceToolbar from './components/WorkspaceToolbar';
import type { AlumniFilterState, AlumniModalId, MemberTile } from './data/alumni.data';
import { emptyFilters, memberTiles } from './data/alumni.data';
import AlumniModals from './modals/AlumniModals';

const routes = all_routes;

type SortKey = 'recent' | 'name' | 'year' | 'connections';

const matchesFilters = (
  member: MemberTile,
  search: string,
  batch: string,
  year: string,
  filters: AlumniFilterState,
) => {
  const term = search.trim().toLowerCase();
  if (term) {
    const haystack = [member.name, member.company, member.chapter, member.role, ...member.tags].join(' ').toLowerCase();
    if (!haystack.includes(term)) return false;
  }
  if (batch !== 'all' && member.batchRange !== batch) return false;
  if (year !== 'any' && String(member.graduationYear) !== year) return false;
  if (filters.department && member.department !== filters.department) return false;
  if (filters.profession && member.profession !== filters.profession) return false;
  if (filters.country && member.country !== filters.country) return false;
  if (filters.chapter && member.chapter !== filters.chapter) return false;
  if (filters.industry && member.industry !== filters.industry) return false;
  if (filters.openTo === 'mentor' && !member.intents.mentor) return false;
  if (filters.openTo === 'recruit' && !member.intents.recruit) return false;
  if (filters.openTo === 'speak' && !member.intents.speak) return false;
  return true;
};

const sortValue = (member: MemberTile, key: SortKey) => {
  switch (key) {
    case 'name':
      return member.name.toLowerCase();
    case 'year':
      return member.graduationYear;
    case 'connections':
      return member.connections;
    default:
      return 0;
  }
};

const AlumniGrid = () => {
  const { toasts, push, dismiss } = useToasts();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState('');
  const [batch, setBatch] = useState('all');
  const [year, setYear] = useState('any');
  const [filters, setFilters] = useState<AlumniFilterState>(emptyFilters);
  const [sort, setSort] = useState<SortKey>('recent');
  const [openMenu, setOpenMenu] = useState<ToolbarMenu>(null);

  const [selectedMember, setSelectedMember] = useState<MemberTile | null>(null);
  const [activeModal, setActiveModal] = useState<AlumniModalId | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 850);
    return () => window.clearTimeout(timer);
  }, []);

  const filteredMembers = useMemo(() => {
    const matches = memberTiles.filter((member) => matchesFilters(member, search, batch, year, filters));
    if (sort === 'recent') return matches;
    return [...matches].sort((a, b) => {
      const left = sortValue(a, sort);
      const right = sortValue(b, sort);
      if (left < right) return sort === 'year' || sort === 'connections' ? 1 : -1;
      if (left > right) return sort === 'year' || sort === 'connections' ? -1 : 1;
      return 0;
    });
  }, [search, batch, year, filters, sort]);

  const chips = useMemo(() => {
    const list: { key: string; label: string }[] = [];
    if (batch !== 'all') {
      const label = batch.replace('-', '–');
      list.push({ key: 'batch', label: `Batch of ${label}` });
    }
    if (year !== 'any') list.push({ key: 'year', label: `Year: ${year}` });
    if (filters.department) list.push({ key: 'department', label: filters.department });
    if (filters.profession) list.push({ key: 'profession', label: filters.profession });
    if (filters.country) list.push({ key: 'country', label: filters.country });
    if (filters.chapter) list.push({ key: 'chapter', label: filters.chapter });
    if (filters.industry) list.push({ key: 'industry', label: filters.industry });
    if (filters.openTo) list.push({ key: 'openTo', label: `Open to: ${filters.openTo}` });
    return list;
  }, [batch, year, filters]);

  const clearChip = useCallback((key: string) => {
    if (key === 'batch') return setBatch('all');
    if (key === 'year') return setYear('any');
    setFilters((current) => ({ ...current, [key]: '' }));
  }, []);

  const clearAll = useCallback(() => {
    setSearch('');
    setBatch('all');
    setYear('any');
    setFilters(emptyFilters);
    push('Filters cleared.');
  }, [push]);

  const refresh = useCallback(() => {
    setRefreshing(true);
    window.setTimeout(() => {
      setRefreshing(false);
      push('Alumni directory refreshed.');
    }, 700);
  }, [push]);

  const exportCsv = useCallback(() => {
    const header = ['Name', 'Batch', 'Company', 'Industry', 'Country', 'Chapter', 'Connections'];
    const lines = [
      header,
      ...filteredMembers.map((member) => [
        member.name,
        member.batchLabel,
        member.company,
        member.industry,
        member.country,
        member.chapter,
        String(member.connections),
      ]),
    ];
    const csv = lines.map((line) => line.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'alumni.csv';
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1500);
  }, [filteredMembers]);

  const handleExport = useCallback(
    (kind: 'pdf' | 'excel' | 'csv') => {
      if (kind === 'csv') {
        exportCsv();
        push('Alumni directory exported as CSV.');
        return;
      }
      push(`Alumni directory exported as ${kind === 'pdf' ? 'PDF' : 'Excel'}.`);
    },
    [exportCsv, push],
  );

  const openModal = useCallback((modal: AlumniModalId) => setActiveModal(modal), []);

  const openProfile = useCallback((member: MemberTile) => setSelectedMember(member), []);

  const openRelated = useCallback(
    (name: string) => {
      const match = memberTiles.find((member) => member.name === name);
      if (match) setSelectedMember(match);
      else push(`${name}’s profile is outside the current alumni directory sample.`, 'info');
    },
    [push],
  );

  const readStory = useCallback(
    (storyId: string) => {
      const nameById: Record<string, string> = {
        'spot-arun': 'Arun Krishnan',
        'spot-divya': 'Divya Menon',
        'spot-rahul': 'Rahul Sharma',
      };
      const match = memberTiles.find((member) => member.name === nameById[storyId]);
      if (match) setSelectedMember(match);
    },
    [],
  );

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content content-two">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Alumni Network</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">Community</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Alumni
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <div className="me-2 mb-2">
                <button
                  type="button"
                  className="btn btn-outline-light bg-white btn-sm fw-medium d-inline-flex align-items-center"
                  onClick={() => openModal('invite')}
                >
                  <i className="ti ti-user-plus me-2" />
                  Invite Alumni
                </button>
              </div>
              <div className="me-2 mb-2">
                <button
                  type="button"
                  className="btn btn-outline-light bg-white btn-sm fw-medium d-inline-flex align-items-center"
                  onClick={() => openModal('chapter')}
                >
                  <i className="ti ti-flag-3 me-2" />
                  Create Chapter
                </button>
              </div>
              <div className="me-2 mb-2">
                <button
                  type="button"
                  className="btn btn-outline-light bg-white btn-sm fw-medium d-inline-flex align-items-center"
                  onClick={() => openModal('event')}
                >
                  <i className="ti ti-calendar-plus me-2" />
                  Create Event
                </button>
              </div>
              <div className="mb-2">
                <button type="button" className="btn btn-primary btn-sm d-flex align-items-center" onClick={() => openModal('register')}>
                  <i className="ti ti-square-rounded-plus me-2" />
                  Register Alumni
                </button>
              </div>
            </div>
          </div>
          {/* /Page Header */}

          {/* Sticky Toolbar */}
          <div className="toolbar-sticky mb-4">
            <div className="card mb-0">
              <div className="data-workspace">
                {loading ? (
                  <AlumniSkeleton />
                ) : (
                  <>
                    <WorkspaceToolbar
                      search={search}
                      onSearch={setSearch}
                      batch={batch}
                      onBatch={setBatch}
                      year={year}
                      onYear={setYear}
                      filters={filters}
                      onApplyFilters={(next) => {
                        setFilters(next);
                        push('Filters applied.', 'info');
                      }}
                      sort={sort}
                      onSort={(key) => {
                        setSort(key);
                        push('Sort order updated.', 'info');
                      }}
                      onRefresh={refresh}
                      onExport={handleExport}
                      chips={chips}
                      onClearChip={clearChip}
                      onClearAll={clearAll}
                      matchCount={filteredMembers.length}
                      openMenu={openMenu}
                      onOpenMenu={setOpenMenu}
                    />
                    {refreshing ? <AlumniSkeleton /> : null}
                  </>
                )}
              </div>
            </div>
          </div>
          {/* /Sticky Toolbar */}

          {!loading && !refreshing ? (
            <MemberGrid members={filteredMembers} onOpenProfile={openProfile} onViewAll={clearAll} />
          ) : null}

          <ChapterGrid onNewChapter={() => openModal('chapter')} />

          <RosterGrid onRequestMentor={() => openModal('mentor')} />

          <OpportunityGrid onPostOpportunity={() => openModal('opportunity')} />

          <EventGrid
            onCreateEvent={() => openModal('event')}
            onDetails={() => push('Opening event details.', 'info')}
            onRsvp={() => push('RSVP confirmed.')}
          />

          <SpotlightGrid onShareStory={() => openModal('story')} onReadStory={readStory} />

          <ResourceGrid onOpen={(id) => push(`Opening ${id.replace('-', ' ')}.`, 'info')} />

          <ActionGrid onAction={openModal} />
        </div>
      </div>
      {/* /Page Wrapper */}

      <MemberPreviewPanel
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
        onMessage={() => push('Message thread opened.', 'info')}
        onEdit={() => openModal('edit')}
        onConnect={() => push('Connection request sent.')}
        onRequestMentor={() => openModal('mentor')}
        onSaveNote={() => push('Note saved.')}
        onOpenRelated={openRelated}
      />

      <AlumniModals active={activeModal} onClose={() => setActiveModal(null)} onToast={push} />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="alumniToasts" />
    </>
  );
};

export default AlumniGrid;
