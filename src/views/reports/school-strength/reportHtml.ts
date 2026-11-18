import type { GenderCount, GenderKey, SchoolStrength, StudentMember } from '@services/reports/reports.api';

export interface ReportOptions {
  schoolName: string;
  preparedBy: string;
  summary: boolean;
  faculty: boolean;
  facultyList: boolean;
  studentsGender: boolean;
  classWise: boolean;
  studentList: boolean;
  classId: string; // 'all' or a class id
}

export const DEFAULT_OPTIONS: ReportOptions = {
  schoolName: 'Karkai School',
  preparedBy: '',
  summary: true,
  faculty: true,
  facultyList: true,
  studentsGender: true,
  classWise: true,
  studentList: true,
  classId: 'all',
};

const NAVY = '#1e3a8a';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const pct = (part: number, total: number) => (total > 0 ? `${((part / total) * 100).toFixed(1)}%` : '—');
const pctNum = (part: number, total: number) => (total > 0 ? (part / total) * 100 : 0);
const otherOf = (g: GenderCount) => g.other + g.unknown;
const sumOf = (g: GenderCount) => g.male + g.female + g.other + g.unknown;
const nice = (key: string) => {
  const text = key.replace(/_/g, ' ');
  return text.charAt(0).toUpperCase() + text.slice(1);
};
const genderLabel = (g: GenderKey) => (g === 'male' ? 'Male' : g === 'female' ? 'Female' : g === 'other' ? 'Other' : '—');
const roleLabel = (staffType: string) => (staffType === 'teaching' ? 'Teaching' : 'Non-teaching');

const stamp = (iso: string) =>
  new Date(iso).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

/* -------------------------------- html pieces ------------------------------- */
const th = (text: string, align = 'left') =>
  `<th style="text-align:${align};padding:8px 10px;background:${NAVY};color:#fff;font-size:12px;font-weight:600">${text}</th>`;
const td = (text: string | number, align = 'left', bold = false) =>
  `<td style="text-align:${align};padding:7px 10px;border-bottom:1px solid #e5e7eb;font-size:12px;${
    bold ? 'font-weight:700;background:#f3f4f6;' : ''
  }">${text}</td>`;
const table = (head: string, body: string) =>
  `<table style="width:100%;border-collapse:collapse;margin:8px 0 18px"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`;
const h2 = (text: string) =>
  `<h2 style="font-size:15px;color:${NAVY};border-bottom:2px solid ${NAVY};padding-bottom:4px;margin:22px 0 8px">${text}</h2>`;
const card = (label: string, value: string | number) =>
  `<div style="flex:1;min-width:130px;border:1px solid #e5e7eb;border-radius:8px;padding:10px 12px"><div style="font-size:11px;color:#6b7280">${label}</div><div style="font-size:22px;font-weight:700;color:${NAVY}">${value}</div></div>`;
const bar = (label: string, value: number, total: number, color: string) =>
  `<div style="margin:7px 0"><div style="display:flex;justify-content:space-between;font-size:12px"><span>${label}</span><span><b>${value}</b> (${pct(value, total)})</span></div><div style="background:#e5e7eb;height:8px;border-radius:4px"><div style="width:${pctNum(value, total).toFixed(1)}%;background:${color};height:8px;border-radius:4px"></div></div></div>`;
const rowAvoid = (cells: string) => `<tr style="page-break-inside:avoid">${cells}</tr>`;

/** The students of one class, plus the classes in the order they should print. */
function studentGroups(data: SchoolStrength, classId: string): { title: string; members: StudentMember[] }[] {
  const s = data.students;
  const classRows = classId === 'all' ? s.classes : s.classes.filter((c) => c.classId === classId);
  const byClass = new Map<string, StudentMember[]>();
  const noClass: StudentMember[] = [];
  for (const m of s.list) {
    if (m.classId === null) {
      noClass.push(m);
    } else {
      const list = byClass.get(m.classId) ?? [];
      list.push(m);
      byClass.set(m.classId, list);
    }
  }
  const groups: { title: string; members: StudentMember[] }[] = [];
  for (const c of classRows) {
    const members = byClass.get(c.classId) ?? [];
    if (members.length > 0) groups.push({ title: c.name, members });
  }
  if (classId === 'all' && noClass.length > 0) groups.push({ title: 'Not assigned to a class', members: noClass });
  return groups;
}

/** The report body. Used for the on-screen preview and for the printed PDF. */
export function buildReportHtml(data: SchoolStrength, o: ReportOptions): string {
  const f = data.faculty;
  const s = data.students;
  const classRows = o.classId === 'all' ? s.classes : s.classes.filter((c) => c.classId === o.classId);
  const selectedClass = o.classId === 'all' ? null : s.classes.find((c) => c.classId === o.classId);
  const showUnassigned = o.classId === 'all' && s.unassigned.total > 0;
  const ratio = f.teaching > 0 ? `${(s.total / f.teaching).toFixed(1)} : 1` : '—';

  let n = 0;
  const section = (title: string) => {
    n += 1;
    return h2(`${n}. ${title}`);
  };

  let html = `<div style="font-family:'Segoe UI',Arial,sans-serif;color:#111827">
    <div style="background:${NAVY};color:#fff;padding:18px 22px;border-radius:8px">
      <div style="font-size:22px;font-weight:700">${esc(o.schoolName || 'School')}</div>
      <div style="font-size:14px;margin-top:2px">School Strength Report${
        selectedClass ? ` — ${esc(selectedClass.name)}` : ''
      }</div>
      <div style="font-size:11px;margin-top:8px;opacity:.85">Generated on ${esc(stamp(data.generatedAt))}${
        o.preparedBy ? ` &nbsp;|&nbsp; Prepared by ${esc(o.preparedBy)}` : ''
      }</div>
    </div>`;

  if (o.summary) {
    html += section('Summary');
    html += `<div style="display:flex;flex-wrap:wrap;gap:10px">
      ${card('Total Faculty', f.total)}
      ${card('Teaching Staff', f.teaching)}
      ${card('Non-teaching Staff', f.nonTeaching)}
      ${card('Total Students', s.total)}
      ${card('Boys', s.byGender.male)}
      ${card('Girls', s.byGender.female)}
      ${card('Student : Teacher', ratio)}
    </div>`;
  }

  if (o.faculty) {
    html += section('Faculty');
    const row = (label: string, g: GenderCount) =>
      `<tr>${td(label)}${td(g.male, 'right')}${td(g.female, 'right')}${td(otherOf(g), 'right')}${td(sumOf(g), 'right', true)}</tr>`;
    html += table(
      th('Category') + th('Male', 'right') + th('Female', 'right') + th('Other / not stated', 'right') + th('Total', 'right'),
      row('Teaching', f.teachingByGender) + row('Non-teaching', f.nonTeachingByGender) + row('All faculty', f.byGender),
    );

    const employment = Object.entries(f.byEmploymentType);
    if (employment.length > 0) {
      html += table(
        th('Employment type') + th('Faculty', 'right') + th('Share', 'right'),
        employment
          .map(([k, v]) => `<tr>${td(nice(k))}${td(v, 'right')}${td(pct(v, f.total), 'right')}</tr>`)
          .join(''),
      );
    }

    const statuses = Object.entries(f.byStatus);
    if (statuses.length > 0) {
      html += table(
        th('Staff status (all records)') + th('Staff', 'right'),
        statuses.map(([k, v]) => `<tr>${td(nice(k))}${td(v, 'right')}</tr>`).join(''),
      );
    }
  }

  if (o.facultyList) {
    html += section('Faculty list');
    html +=
      f.list.length === 0
        ? `<p style="font-size:12px;color:#6b7280">No faculty found.</p>`
        : table(
            th('#', 'right') + th('Emp. no') + th('Name') + th('Role') + th('Employment') + th('Gender'),
            f.list
              .map((m, i) =>
                rowAvoid(
                  td(i + 1, 'right') +
                    td(esc(m.employeeNo)) +
                    td(esc(m.name)) +
                    td(roleLabel(m.staffType)) +
                    td(nice(m.employmentType)) +
                    td(genderLabel(m.gender)),
                ),
              )
              .join(''),
          );
  }

  if (o.studentsGender) {
    html += section('Students — gender-wise');
    const g = s.byGender;
    html += `<div style="max-width:520px">
      ${bar('Boys', g.male, s.total, '#2563eb')}
      ${bar('Girls', g.female, s.total, '#db2777')}
      ${otherOf(g) > 0 ? bar('Other / not stated', otherOf(g), s.total, '#6b7280') : ''}
    </div>`;
    const statuses = Object.entries(s.byStatus);
    if (statuses.length > 1) {
      html += table(
        th('Student status (all records)') + th('Students', 'right'),
        statuses.map(([k, v]) => `<tr>${td(nice(k))}${td(v, 'right')}</tr>`).join(''),
      );
    }
  }

  if (o.classWise) {
    html += section('Students — class-wise and gender-wise');
    const total = { male: 0, female: 0, other: 0, all: 0 };
    let body = '';
    for (const c of classRows) {
      total.male += c.male;
      total.female += c.female;
      total.other += otherOf(c);
      total.all += c.total;
      body += `<tr>${td(esc(c.name))}${td(c.male, 'right')}${td(c.female, 'right')}${td(otherOf(c), 'right')}${td(
        c.total,
        'right',
        true,
      )}${td(pct(c.female, c.total), 'right')}</tr>`;
    }
    if (showUnassigned) {
      const u = s.unassigned;
      total.male += u.male;
      total.female += u.female;
      total.other += otherOf(u);
      total.all += u.total;
      body += `<tr>${td('<i>Not assigned to a class</i>')}${td(u.male, 'right')}${td(u.female, 'right')}${td(
        otherOf(u),
        'right',
      )}${td(u.total, 'right', true)}${td(pct(u.female, u.total), 'right')}</tr>`;
    }
    body += `<tr>${td('Total', 'left', true)}${td(total.male, 'right', true)}${td(total.female, 'right', true)}${td(
      total.other,
      'right',
      true,
    )}${td(total.all, 'right', true)}${td(pct(total.female, total.all), 'right', true)}</tr>`;
    html += table(
      th('Class') + th('Boys', 'right') + th('Girls', 'right') + th('Other / not stated', 'right') + th('Total', 'right') + th('Girls %', 'right'),
      body,
    );
    html += `<div style="font-size:11px;color:#6b7280">Class is taken from each student's admission record. Active students only.</div>`;
  }

  if (o.studentList) {
    html += section('Student list');
    const groups = studentGroups(data, o.classId);
    if (groups.length === 0) {
      html += `<p style="font-size:12px;color:#6b7280">No students found.</p>`;
    }
    for (const group of groups) {
      const boys = group.members.filter((m) => m.gender === 'male').length;
      const girls = group.members.filter((m) => m.gender === 'female').length;
      html += `<div style="font-weight:600;font-size:13px;margin:14px 0 2px;color:#111827">${esc(group.title)}
        <span style="font-weight:400;color:#6b7280">— ${group.members.length} students (${boys} boys, ${girls} girls)</span></div>`;
      html += table(
        th('#', 'right') + th('Adm. no') + th('Name') + th('Gender'),
        group.members
          .map((m, i) => rowAvoid(td(i + 1, 'right') + td(esc(m.admissionNo)) + td(esc(m.name)) + td(genderLabel(m.gender))))
          .join(''),
      );
    }
  }

  html += `<div style="margin-top:26px;border-top:1px solid #e5e7eb;padding-top:8px;font-size:10px;color:#9ca3af">${esc(
    o.schoolName || 'School',
  )} — School Strength Report — computer generated</div></div>`;
  return html;
}

/* ----------------------------------- csv ----------------------------------- */
const cell = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
const line = (...cells: (string | number)[]) => cells.map(cell).join(',');

export function buildCsv(data: SchoolStrength, o: ReportOptions): string {
  const f = data.faculty;
  const s = data.students;
  const rows: string[] = [
    line(o.schoolName || 'School', 'School Strength Report'),
    line('Generated on', stamp(data.generatedAt)),
  ];
  if (o.preparedBy) rows.push(line('Prepared by', o.preparedBy));

  if (o.summary) {
    rows.push('', line('SUMMARY'));
    rows.push(line('Total faculty', f.total), line('Teaching staff', f.teaching), line('Non-teaching staff', f.nonTeaching));
    rows.push(line('Total students', s.total), line('Boys', s.byGender.male), line('Girls', s.byGender.female));
  }

  if (o.faculty) {
    rows.push('', line('FACULTY'), line('Category', 'Male', 'Female', 'Other / not stated', 'Total'));
    const add = (label: string, g: GenderCount) => rows.push(line(label, g.male, g.female, otherOf(g), sumOf(g)));
    add('Teaching', f.teachingByGender);
    add('Non-teaching', f.nonTeachingByGender);
    add('All faculty', f.byGender);
    rows.push('', line('Employment type', 'Faculty'));
    for (const [k, v] of Object.entries(f.byEmploymentType)) rows.push(line(nice(k), v));
  }

  if (o.facultyList) {
    rows.push('', line('FACULTY LIST'), line('#', 'Emp. no', 'Name', 'Role', 'Employment', 'Gender'));
    f.list.forEach((m, i) =>
      rows.push(line(i + 1, m.employeeNo, m.name, roleLabel(m.staffType), nice(m.employmentType), genderLabel(m.gender))),
    );
  }

  if (o.studentsGender) {
    rows.push('', line('STUDENTS - GENDER-WISE'), line('Gender', 'Students'));
    rows.push(line('Boys', s.byGender.male), line('Girls', s.byGender.female), line('Other / not stated', otherOf(s.byGender)));
  }

  if (o.classWise) {
    const classRows = o.classId === 'all' ? s.classes : s.classes.filter((c) => c.classId === o.classId);
    rows.push('', line('STUDENTS - CLASS-WISE'), line('Class', 'Boys', 'Girls', 'Other / not stated', 'Total'));
    let m = 0;
    let fe = 0;
    let ot = 0;
    let all = 0;
    for (const c of classRows) {
      rows.push(line(c.name, c.male, c.female, otherOf(c), c.total));
      m += c.male;
      fe += c.female;
      ot += otherOf(c);
      all += c.total;
    }
    if (o.classId === 'all' && s.unassigned.total > 0) {
      const u = s.unassigned;
      rows.push(line('Not assigned to a class', u.male, u.female, otherOf(u), u.total));
      m += u.male;
      fe += u.female;
      ot += otherOf(u);
      all += u.total;
    }
    rows.push(line('Total', m, fe, ot, all));
  }

  if (o.studentList) {
    rows.push('', line('STUDENT LIST'), line('Class', '#', 'Adm. no', 'Name', 'Gender'));
    for (const group of studentGroups(data, o.classId)) {
      group.members.forEach((m, i) => rows.push(line(group.title, i + 1, m.admissionNo, m.name, genderLabel(m.gender))));
    }
  }

  return rows.join('\r\n');
}