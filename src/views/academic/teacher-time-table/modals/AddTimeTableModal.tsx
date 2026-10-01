import { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '@components/ui/Modal';
import { useForm } from '@hooks/useForm';
import {
  addDurations,
  addPeriodStartTimes,
  addRowSubjects,
  addRowTeachers,
  addRowTimeFrom,
  addRowTimeTo,
  addSections,
  addSubjectGroups,
  addTimetableTabs,
} from '../data/teacherTimeTable.data';

interface DayRow {
  key: number;
  subject: string;
  teacher: string;
  timeFrom: string;
  timeTo: string;
}

const emptyRow = (key: number): DayRow => ({
  key,
  subject: 'Select',
  teacher: 'Select',
  timeFrom: 'Select',
  timeTo: 'Select',
});

/** The template's own id sequence: `subject-3` … `subject-7`, `teacher` … `teacher-5`. */
const fieldId = (base: string, dayIndex: number, rowIndex: number, offset = 0) => {
  const suffix = dayIndex === 0 ? '' : `-${dayIndex + 1}`;
  const numbered = offset ? `${base}-${dayIndex + offset}` : `${base}${suffix}`;
  return rowIndex === 0 ? numbered : `${numbered}-row${rowIndex + 1}`;
};

export interface AddTimeTableModalProps {
  open: boolean;
  onClose: () => void;
  onToast: (message: string) => void;
}

const AddTimeTableModal = ({ open, onClose, onToast }: AddTimeTableModalProps) => {
  const [tab, setTab] = useState(addTimetableTabs[0].id);
  const [rows, setRows] = useState<Record<string, DayRow[]>>(() =>
    addTimetableTabs.reduce<Record<string, DayRow[]>>((acc, day) => {
      acc[day.id] = [emptyRow(0)];
      return acc;
    }, {}),
  );
  const [nextKey, setNextKey] = useState(1);

  const form = useForm<
    {
      className: string;
      section: string;
      subjectGroup: string;
      periodStart: string;
      duration: string;
    },
    string
  >({
    initialValues: {
      className: '',
      section: addSections[0],
      subjectGroup: addSubjectGroups[0],
      periodStart: addPeriodStartTimes[0],
      duration: addDurations[0],
    },
    onSubmit: async () => 'Time table added',
    onSuccess: (message) => {
      onToast(message);
      form.reset();
      setRows(
        addTimetableTabs.reduce<Record<string, DayRow[]>>((acc, day) => {
          acc[day.id] = [emptyRow(0)];
          return acc;
        }, {}),
      );
      setTab(addTimetableTabs[0].id);
      onClose();
    },
  });

  const addRow = (dayId: string) => {
    setRows((current) => ({ ...current, [dayId]: [...current[dayId], emptyRow(nextKey)] }));
    setNextKey((key) => key + 1);
  };

  const removeRow = (dayId: string, key: number) => {
    setRows((current) => ({
      ...current,
      [dayId]: current[dayId].filter((row) => row.key !== key),
    }));
  };

  const setRowValue = (dayId: string, key: number, field: keyof DayRow, value: string) => {
    setRows((current) => ({
      ...current,
      [dayId]: current[dayId].map((row) => (row.key === key ? { ...row, [field]: value } : row)),
    }));
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add Time Table"
      dialogClassName="modal-xl"
      onSubmit={form.handleSubmit}
      footer={
        <>
          <button type="button" className="btn btn-light me-2" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={form.isSubmitting}>
            Add Time Table
          </button>
        </>
      }
    >
      <div className="row">
        <div className="col-12 col-sm-6 col-lg-4">
          <div className="mb-3">
            <label className="form-label" htmlFor="class-2">
              Class
            </label>
            <input
              type="text"
              className="form-control"
              id="class-2"
              name="className"
              value={form.values.className}
              onChange={form.handleChange}
            />
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-4">
          <div className="mb-3">
            <label className="form-label" htmlFor="section">
              Section
            </label>
            {/* The template hands these to choices.js; Bootstrap's own
                `form-select` carries the look without the plugin. */}
            <select
              className="select form-select"
              id="section"
              name="section"
              value={form.values.section}
              onChange={form.handleChange}
            >
              {addSections.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-4">
          <div className="mb-3">
            <label className="form-label" htmlFor="subject-group">
              Subject Group
            </label>
            <select
              className="select form-select"
              id="subject-group"
              name="subjectGroup"
              value={form.values.subjectGroup}
              onChange={form.handleChange}
            >
              {addSubjectGroups.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-4">
          <div className="mb-3">
            <label className="form-label" htmlFor="period-start-time">
              Period Start Time
            </label>
            <select
              className="select form-select"
              id="period-start-time"
              name="periodStart"
              value={form.values.periodStart}
              onChange={form.handleChange}
            >
              {addPeriodStartTimes.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-4">
          <div className="mb-3">
            <label className="form-label" htmlFor="duration-min">
              Duration(min)
            </label>
            <select
              className="select form-select"
              id="duration-min"
              name="duration"
              value={form.values.duration}
              onChange={form.handleChange}
            >
              {addDurations.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="add-more-timetable">
        <ul className="tab-links nav nav-pills" id="pills-tab2" role="tablist">
          {addTimetableTabs.map((day) => (
            <li
              className={`nav-link${tab === day.id ? ' active' : ''}`}
              id={`pills-${day.id}-tab`}
              role="tab"
              aria-controls={`pills-${day.id}`}
              aria-selected={tab === day.id}
              tabIndex={tab === day.id ? undefined : -1}
              key={day.id}
            >
              <Link
                to="#"
                onClick={(event) => {
                  event.preventDefault();
                  setTab(day.id);
                }}
              >
                {day.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="tab-content pt-0 dashboard-tab">
          {addTimetableTabs.map((day, dayIndex) => (
            <div
              className={`tab-pane fade${tab === day.id ? ' show active' : ''}`}
              id={`pills-${day.id}`}
              role="tabpanel"
              aria-labelledby={`pills-${day.id}-tab`}
              key={day.id}
            >
              {rows[day.id].map((row, rowIndex) => (
                <div className="add-timetable-row" key={row.key}>
                  <div className="row timetable-count">
                    <div className="col-12 col-sm-6 col-lg-3">
                      <div className="mb-3">
                        <label
                          className="form-label"
                          htmlFor={fieldId('subject', dayIndex, rowIndex, 3)}
                        >
                          Subject
                        </label>
                        <select
                          className="select form-select"
                          id={fieldId('subject', dayIndex, rowIndex, 3)}
                          value={row.subject}
                          onChange={(event) =>
                            setRowValue(day.id, row.key, 'subject', event.target.value)
                          }
                        >
                          {addRowSubjects.map((option) => (
                            <option key={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-12 col-sm-6 col-lg-3">
                      <div className="mb-3">
                        <label className="form-label" htmlFor={fieldId('teacher', dayIndex, rowIndex)}>
                          Teacher
                        </label>
                        <select
                          className="select form-select"
                          id={fieldId('teacher', dayIndex, rowIndex)}
                          value={row.teacher}
                          onChange={(event) =>
                            setRowValue(day.id, row.key, 'teacher', event.target.value)
                          }
                        >
                          {addRowTeachers.map((option) => (
                            <option key={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-12 col-sm-6 col-lg-3">
                      <div className="mb-3">
                        <label
                          className="form-label"
                          htmlFor={fieldId('time-from', dayIndex, rowIndex)}
                        >
                          Time From
                        </label>
                        <select
                          className="select form-select"
                          id={fieldId('time-from', dayIndex, rowIndex)}
                          value={row.timeFrom}
                          onChange={(event) =>
                            setRowValue(day.id, row.key, 'timeFrom', event.target.value)
                          }
                        >
                          {addRowTimeFrom.map((option) => (
                            <option key={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-12 col-sm-6 col-lg-3">
                      <div className="d-flex align-items-end">
                        <div className="mb-3 flex-fill">
                          <label
                            className="form-label"
                            htmlFor={fieldId('time-to', dayIndex, rowIndex)}
                          >
                            Time To
                          </label>
                          <select
                            className="select form-select"
                            id={fieldId('time-to', dayIndex, rowIndex)}
                            value={row.timeTo}
                            onChange={(event) =>
                              setRowValue(day.id, row.key, 'timeTo', event.target.value)
                            }
                          >
                            {addRowTimeTo.map((option) => (
                              <option key={option}>{option}</option>
                            ))}
                          </select>
                        </div>
                        {rows[day.id].length > 1 ? (
                          <div className="mb-3 ms-2">
                            <button
                              type="button"
                              className="delete-time-table"
                              aria-label="Remove row"
                              onClick={() => removeRow(day.id, row.key)}
                            >
                              <i className="ti ti-trash" />
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div>
                <button
                  type="button"
                  className="btn btn-primary add-new-timetable"
                  onClick={() => addRow(day.id)}
                >
                  <i className="ti ti-square-rounded-plus-filled me-2" />
                  Add New
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default AddTimeTableModal;
