import type { RoutineDay, RoutineSlot } from '../../data/teacherRoutine.data';

const RoutineSlotCard = ({ slot }: { slot: RoutineSlot }) => (
  <div className="rounded p-3 mb-4 border">
    <div className="pb-3 border-bottom">
      <span className="text-danger badge bg-transparent-danger text-nowrap ">{slot.room}</span>
    </div>
    {slot.spanMarkup ? (
      <>
        <span className="text-dark d-block py-2">Class : {slot.classSection}</span>
        <span className="text-dark d-block pb-2">Subject : {slot.subject}</span>
        <p className="text-dark">
          <i className="ti ti-clock me-1" />
          {slot.time}
        </p>
      </>
    ) : (
      <>
        <p className="text-dark d-block py-2 m-0">Class : {slot.classSection}</p>
        <p className="text-dark d-block pb-2 m-0">Subject : {slot.subject}</p>
        <p className="text-dark text-nowrap m-0">
          <i className="ti ti-clock me-1" />
          {slot.time}
        </p>
      </>
    )}
  </div>
);

const RoutineDayColumn = ({ day }: { day: RoutineDay }) => (
  <div className="d-flex flex-column me-4 flex-fill">
    <div className="mb-3">
      {day.headingLevel === 'h5' ? (
        <h5 className="fs-15">{day.label}</h5>
      ) : (
        <h6>{day.label}</h6>
      )}
    </div>
    {day.slots.map((slot) => (
      <RoutineSlotCard slot={slot} key={slot.id} />
    ))}
  </div>
);

export default RoutineDayColumn;
