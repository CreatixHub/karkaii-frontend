import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { all_routes } from '@/routes/all_routes';

const StatusCardsShowcase = () => (
  <>
<div className="page-wrapper">
			<div className="content">

				<div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
					<div className="my-auto mb-2">
						<h3 className="page-title mb-1">Status Cards — Design System</h3>
						<nav><ol className="breadcrumb mb-0"><li className="breadcrumb-item"><Link to={all_routes.adminDashboard}>Dashboard</Link></li><li className="breadcrumb-item active">Status Cards</li></ol></nav>
					</div>
					<div className="d-flex my-xl-auto right-content align-items-center flex-wrap"><span className="badge badge-soft-primary fs-13 mb-2"><i className="ti ti-palette me-1"></i>48 card styles</span></div>
				</div>
				<div className="alert alert-info d-flex align-items-center" role="alert"><i className="ti ti-info-circle me-2 fs-16"></i><span>Each module has its own distinct status-card identity while sharing one cohesive system. Toggle dark mode to preview both themes.</span></div>

				{/* STUDENTS */}
				<h4 className="mb-2 mt-2 fs-16 fw-medium">Students <span className="text-muted fs-13">— gradient band + overlapping icon</span></h4>
				<div className="row g-3 mb-3">
					<div className="col-xl-3 col-md-6 d-flex"><div className="status-card status-card-students primary"><span className="status-card-icon"><i className="ti ti-users"></i></span><p className="status-card-label">Total Students</p><h3 className="status-card-value">3,654</h3><span className="status-card-trend up"><i className="ti ti-arrow-up-right"></i>+2.1%</span></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="status-card status-card-students success"><span className="status-card-icon"><i className="ti ti-user-check"></i></span><p className="status-card-label">Active</p><h3 className="status-card-value">3,540</h3><span className="status-card-trend up"><i className="ti ti-arrow-up-right"></i>+1.4%</span></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="status-card status-card-students warning"><span className="status-card-icon"><i className="ti ti-user-plus"></i></span><p className="status-card-label">New Admissions</p><h3 className="status-card-value">218</h3><span className="status-card-trend flat">This term</span></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="status-card status-card-students danger"><span className="status-card-icon"><i className="ti ti-user-x"></i></span><p className="status-card-label">Inactive</p><h3 className="status-card-value">114</h3><span className="status-card-trend down"><i className="ti ti-arrow-down-right"></i>-0.6%</span></div></div>
				</div>

				{/* TEACHERS */}
				<h4 className="mb-2 fs-16 fw-medium">Teachers <span className="text-muted fs-13">— split card with colored rail</span></h4>
				<div className="row g-3 mb-3">
					<div className="col-xl-3 col-md-6 d-flex"><div className="status-card status-card-teachers primary"><div className="status-card-rail"><i className="ti ti-users-group"></i></div><div className="status-card-body"><p className="status-card-label">Total Teachers</p><h3 className="status-card-value">412</h3></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="status-card status-card-teachers success"><div className="status-card-rail"><i className="ti ti-calendar-check"></i></div><div className="status-card-body"><p className="status-card-label">Present Today</p><h3 className="status-card-value">388</h3></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="status-card status-card-teachers info"><div className="status-card-rail"><i className="ti ti-notebook"></i></div><div className="status-card-body"><p className="status-card-label">Lesson Plans</p><h3 className="status-card-value">1,204</h3></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="status-card status-card-teachers warning"><div className="status-card-rail"><i className="ti ti-star"></i></div><div className="status-card-body"><p className="status-card-label">Avg Rating</p><h3 className="status-card-value">4.5</h3></div></div></div>
				</div>

				{/* FEES */}
				<h4 className="mb-2 fs-16 fw-medium">Fees / Finance <span className="text-muted fs-13">— conic progress ring</span></h4>
				<div className="row g-3 mb-3">
					<div className="col-xl-3 col-md-6 d-flex"><div className="status-card status-card-fees success" style={{ '--sc-pct': '88' } as CSSProperties}><div className="status-card-ring"><span className="status-card-icon"><i className="ti ti-cash"></i></span></div><div><p className="status-card-label">Collected</p><h3 className="status-card-value">88%</h3></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="status-card status-card-fees danger" style={{ '--sc-pct': '12' } as CSSProperties}><div className="status-card-ring"><span className="status-card-icon"><i className="ti ti-alert-triangle"></i></span></div><div><p className="status-card-label">Outstanding</p><h3 className="status-card-value">12%</h3></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="status-card status-card-fees primary" style={{ '--sc-pct': '64' } as CSSProperties}><div className="status-card-ring"><span className="status-card-icon"><i className="ti ti-receipt"></i></span></div><div><p className="status-card-label">Receipts</p><h3 className="status-card-value">1,240</h3></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="status-card status-card-fees warning" style={{ '--sc-pct': '40' } as CSSProperties}><div className="status-card-ring"><span className="status-card-icon"><i className="ti ti-clock"></i></span></div><div><p className="status-card-label">Pending</p><h3 className="status-card-value">$48K</h3></div></div></div>
				</div>

				{/* EXAMS */}
				<h4 className="mb-2 fs-16 fw-medium">Exams <span className="text-muted fs-13">— value + mini sparkline</span></h4>
				<div className="row g-3 mb-3">
					<div className="col-xl-3 col-md-6 d-flex"><div className="status-card status-card-exams primary"><div className="status-card-top"><div><p className="status-card-label">Exams Held</p><h3 className="status-card-value">128</h3></div><span className="status-card-icon"><i className="ti ti-file-check"></i></span></div><div className="status-card-spark"><span style={{ height: '40%' }}></span><span style={{ height: '60%' }}></span><span style={{ height: '45%' }}></span><span style={{ height: '80%' }}></span><span style={{ height: '65%' }}></span><span style={{ height: '90%' }}></span></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="status-card status-card-exams success"><div className="status-card-top"><div><p className="status-card-label">Pass %</p><h3 className="status-card-value">91.2%</h3></div><span className="status-card-icon"><i className="ti ti-award"></i></span></div><div className="status-card-spark"><span style={{ height: '70%' }}></span><span style={{ height: '75%' }}></span><span style={{ height: '72%' }}></span><span style={{ height: '85%' }}></span><span style={{ height: '88%' }}></span><span style={{ height: '92%' }}></span></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="status-card status-card-exams info"><div className="status-card-top"><div><p className="status-card-label">Avg Score</p><h3 className="status-card-value">76.4</h3></div><span className="status-card-icon"><i className="ti ti-chart-bar"></i></span></div><div className="status-card-spark"><span style={{ height: '55%' }}></span><span style={{ height: '50%' }}></span><span style={{ height: '65%' }}></span><span style={{ height: '60%' }}></span><span style={{ height: '72%' }}></span><span style={{ height: '78%' }}></span></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="status-card status-card-exams danger"><div className="status-card-top"><div><p className="status-card-label">Failed</p><h3 className="status-card-value">8.8%</h3></div><span className="status-card-icon"><i className="ti ti-circle-x"></i></span></div><div className="status-card-spark"><span style={{ height: '40%' }}></span><span style={{ height: '35%' }}></span><span style={{ height: '38%' }}></span><span style={{ height: '28%' }}></span><span style={{ height: '24%' }}></span><span style={{ height: '20%' }}></span></div></div></div>
				</div>

				{/* LIBRARY */}
				<h4 className="mb-2 fs-16 fw-medium">Library <span className="text-muted fs-13">— minimalist outlined</span></h4>
				<div className="row g-3 mb-3">
					<div className="col-xl-3 col-md-6 d-flex"><div className="status-card status-card-library primary"><span className="status-card-icon"><i className="ti ti-books"></i></span><p className="status-card-label">Total Books</p><h3 className="status-card-value">12,480</h3></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="status-card status-card-library info"><span className="status-card-icon"><i className="ti ti-book-upload"></i></span><p className="status-card-label">Issued</p><h3 className="status-card-value">1,204</h3></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="status-card status-card-library warning"><span className="status-card-icon"><i className="ti ti-clock-hour-4"></i></span><p className="status-card-label">Overdue</p><h3 className="status-card-value">86</h3></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="status-card status-card-library success"><span className="status-card-icon"><i className="ti ti-users"></i></span><p className="status-card-label">Members</p><h3 className="status-card-value">3,540</h3></div></div>
				</div>

				{/* TRANSPORT */}
				<h4 className="mb-2 fs-16 fw-medium">Transport <span className="text-muted fs-13">— diagonal corner accent</span></h4>
				<div className="row g-3 mb-3">
					<div className="col-xl-3 col-md-6 d-flex"><div className="status-card status-card-transport primary"><span className="status-card-icon"><i className="ti ti-bus"></i></span><p className="status-card-label">Buses Running</p><h3 className="status-card-value">18</h3></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="status-card status-card-transport success"><span className="status-card-icon"><i className="ti ti-route"></i></span><p className="status-card-label">On-Route</p><h3 className="status-card-value">15</h3></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="status-card status-card-transport warning"><span className="status-card-icon"><i className="ti ti-clock-exclamation"></i></span><p className="status-card-label">Delayed</p><h3 className="status-card-value">2</h3></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="status-card status-card-transport info"><span className="status-card-icon"><i className="ti ti-users"></i></span><p className="status-card-label">Onboard</p><h3 className="status-card-value">642</h3></div></div>
				</div>

				{/* HOSTEL */}
				<h4 className="mb-2 fs-16 fw-medium">Hostel <span className="text-muted fs-13">— dotted pattern panel</span></h4>
				<div className="row g-3 mb-3">
					<div className="col-xl-3 col-md-6 d-flex"><div className="status-card status-card-hostel primary"><div className="status-card-inner"><div><p className="status-card-label">Total Rooms</p><h3 className="status-card-value">240</h3></div><span className="status-card-icon"><i className="ti ti-building-fortress"></i></span></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="status-card status-card-hostel success"><div className="status-card-inner"><div><p className="status-card-label">Occupied</p><h3 className="status-card-value">198</h3></div><span className="status-card-icon"><i className="ti ti-bed"></i></span></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="status-card status-card-hostel info"><div className="status-card-inner"><div><p className="status-card-label">Available</p><h3 className="status-card-value">42</h3></div><span className="status-card-icon"><i className="ti ti-door"></i></span></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="status-card status-card-hostel warning"><div className="status-card-inner"><div><p className="status-card-label">Maintenance</p><h3 className="status-card-value">6</h3></div><span className="status-card-icon"><i className="ti ti-tools"></i></span></div></div></div>
				</div>

				{/* HR */}
				<h4 className="mb-2 fs-16 fw-medium">HR / Staff <span className="text-muted fs-13">— inline + animated underline (hover)</span></h4>
				<div className="row g-3 mb-2">
					<div className="col-xl-3 col-md-6 d-flex"><div className="status-card status-card-hr primary"><span className="status-card-icon"><i className="ti ti-users-group"></i></span><div><p className="status-card-label">Total Staff</p><h3 className="status-card-value">412</h3></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="status-card status-card-hr success"><span className="status-card-icon"><i className="ti ti-calendar-check"></i></span><div><p className="status-card-label">Present</p><h3 className="status-card-value">386</h3></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="status-card status-card-hr warning"><span className="status-card-icon"><i className="ti ti-plane-departure"></i></span><div><p className="status-card-label">On Leave</p><h3 className="status-card-value">18</h3></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="status-card status-card-hr purple"><span className="status-card-icon"><i className="ti ti-moneybag"></i></span><div><p className="status-card-label">Payroll</p><h3 className="status-card-value">$482K</h3></div></div></div>
				</div>

				<hr className="my-4" />
				<h4 className="mb-1">Extra Card Styles</h4>
				<p className="text-muted mb-3">8 additional premium stat-card designs (showcase only).</p>

				{/* 9. GLASS */}
				<h5 className="mb-2">Glassmorphism <span className="text-muted fs-13">— translucent blur + gradient border</span></h5>
				<div className="row g-3 mb-3">
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-glass a-primary"><span className="scx-ic"><i className="ti ti-users"></i></span><p className="scx-label">Total Students</p><h3 className="scx-value">3,654</h3></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-glass a-success"><span className="scx-ic"><i className="ti ti-user-check"></i></span><p className="scx-label">Active</p><h3 className="scx-value">3,540</h3></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-glass a-warning"><span className="scx-ic"><i className="ti ti-clock-hour-4"></i></span><p className="scx-label">Pending</p><h3 className="scx-value">218</h3></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-glass a-purple"><span className="scx-ic"><i className="ti ti-award"></i></span><p className="scx-label">Toppers</p><h3 className="scx-value">96</h3></div></div>
				</div>

				{/* 10. GRADIENT FILL */}
				<h4 className="mb-2 fs-16 fw-medium">Gradient Fill <span className="text-muted fs-13">— solid gradient, white content</span></h4>
				<div className="row g-3 mb-3">
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-grad a-primary"><div className="d-flex align-items-start justify-content-between"><span className="scx-ic"><i className="ti ti-cash"></i></span><span className="scx-chip"><i className="ti ti-arrow-up-right"></i>8%</span></div><h3 className="scx-value mt-3">$1.9M</h3><p className="scx-label">Fees Collected</p></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-grad a-success"><div className="d-flex align-items-start justify-content-between"><span className="scx-ic"><i className="ti ti-calendar-check"></i></span><span className="scx-chip"><i className="ti ti-arrow-up-right"></i>1%</span></div><h3 className="scx-value mt-3">93.7%</h3><p className="scx-label">Attendance</p></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-grad a-purple"><div className="d-flex align-items-start justify-content-between"><span className="scx-ic"><i className="ti ti-school"></i></span><span className="scx-chip"><i className="ti ti-arrow-up-right"></i>5%</span></div><h3 className="scx-value mt-3">6,248</h3><p className="scx-label">Enrollment</p></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-grad a-teal"><div className="d-flex align-items-start justify-content-between"><span className="scx-ic"><i className="ti ti-briefcase"></i></span><span className="scx-chip">Staff</span></div><h3 className="scx-value mt-3">412</h3><p className="scx-label">Employees</p></div></div>
				</div>

				{/* 11. NEUMORPHIC */}
				<h4 className="mb-2 fs-16 fw-medium">Neumorphic <span className="text-muted fs-13">— soft embossed surface</span></h4>
				<div className="row g-3 mb-3">
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-neu a-primary"><span className="scx-ic"><i className="ti ti-books"></i></span><p className="scx-label">Library Books</p><h3 className="scx-value">12,480</h3></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-neu a-info"><span className="scx-ic"><i className="ti ti-bus"></i></span><p className="scx-label">Buses</p><h3 className="scx-value">18</h3></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-neu a-warning"><span className="scx-ic"><i className="ti ti-building-fortress"></i></span><p className="scx-label">Hostel Rooms</p><h3 className="scx-value">240</h3></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-neu a-danger"><span className="scx-ic"><i className="ti ti-first-aid-kit"></i></span><p className="scx-label">Infirmary</p><h3 className="scx-value">12</h3></div></div>
				</div>

				{/* 12. WATERMARK */}
				<h4 className="mb-2 fs-16 fw-medium">Watermark Icon <span className="text-muted fs-13">— oversized faded background glyph</span></h4>
				<div className="row g-3 mb-3">
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-water a-primary"><p className="scx-label">Total Students</p><h3 className="scx-value">3,654</h3><span className="scx-chip"><i className="ti ti-arrow-up-right"></i>2.1%</span><i className="ti ti-users scx-bg"></i></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-water a-success"><p className="scx-label">Revenue</p><h3 className="scx-value">$482K</h3><span className="scx-chip"><i className="ti ti-arrow-up-right"></i>6%</span><i className="ti ti-cash scx-bg"></i></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-water a-warning"><p className="scx-label">Pending Fees</p><h3 className="scx-value">$248K</h3><span className="scx-chip"><i className="ti ti-clock"></i>Due</span><i className="ti ti-receipt-tax scx-bg"></i></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-water a-danger"><p className="scx-label">At Risk</p><h3 className="scx-value">128</h3><span className="scx-chip">Review</span><i className="ti ti-alert-triangle scx-bg"></i></div></div>
				</div>

				{/* 13. DONUT PROGRESS */}
				<h4 className="mb-2 fs-16 fw-medium">Donut Progress <span className="text-muted fs-13">— conic ring with % center</span></h4>
				<div className="row g-3 mb-3">
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-donut a-success" style={{ '--p': '88' } as CSSProperties}><div className="scx-ring"><b>88%</b></div><div><p className="scx-label">Fees Collected</p><h3 className="scx-value">$1.9M</h3></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-donut a-primary" style={{ '--p': '94' } as CSSProperties}><div className="scx-ring"><b>94%</b></div><div><p className="scx-label">Attendance</p><h3 className="scx-value">93.7%</h3></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-donut a-warning" style={{ '--p': '72' } as CSSProperties}><div className="scx-ring"><b>72%</b></div><div><p className="scx-label">Syllabus</p><h3 className="scx-value">72%</h3></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-donut a-danger" style={{ '--p': '9' } as CSSProperties}><div className="scx-ring"><b>9%</b></div><div><p className="scx-label">Defaulters</p><h3 className="scx-value">84</h3></div></div></div>
				</div>

				{/* 14. SPARKLINE */}
				<h4 className="mb-2 fs-16 fw-medium">Sparkline <span className="text-muted fs-13">— value + gradient mini bars</span></h4>
				<div className="row g-3 mb-3">
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-spark a-primary"><div className="d-flex align-items-center justify-content-between"><div><p className="scx-label">Applications</p><h3 className="scx-value">3,654</h3></div><span className="scx-chip"><i className="ti ti-arrow-up-right"></i>2.1%</span></div><div className="scx-bars"><span style={{ height: '40%' }}></span><span style={{ height: '65%' }}></span><span style={{ height: '50%' }}></span><span style={{ height: '80%' }}></span><span style={{ height: '60%' }}></span><span style={{ height: '95%' }}></span></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-spark a-success"><div className="d-flex align-items-center justify-content-between"><div><p className="scx-label">Pass %</p><h3 className="scx-value">91.2%</h3></div><span className="scx-chip"><i className="ti ti-arrow-up-right"></i>1.4</span></div><div className="scx-bars"><span style={{ height: '70%' }}></span><span style={{ height: '74%' }}></span><span style={{ height: '72%' }}></span><span style={{ height: '85%' }}></span><span style={{ height: '88%' }}></span><span style={{ height: '92%' }}></span></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-spark a-info"><div className="d-flex align-items-center justify-content-between"><div><p className="scx-label">Avg Score</p><h3 className="scx-value">76.4</h3></div><span className="scx-chip">B+</span></div><div className="scx-bars"><span style={{ height: '55%' }}></span><span style={{ height: '50%' }}></span><span style={{ height: '65%' }}></span><span style={{ height: '60%' }}></span><span style={{ height: '72%' }}></span><span style={{ height: '78%' }}></span></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-spark a-danger"><div className="d-flex align-items-center justify-content-between"><div><p className="scx-label">Absentees</p><h3 className="scx-value">8.8%</h3></div><span className="scx-chip"><i className="ti ti-arrow-down-right"></i>0.6</span></div><div className="scx-bars"><span style={{ height: '60%' }}></span><span style={{ height: '50%' }}></span><span style={{ height: '45%' }}></span><span style={{ height: '35%' }}></span><span style={{ height: '28%' }}></span><span style={{ height: '22%' }}></span></div></div></div>
				</div>

				{/* 15. GRADIENT BORDER */}
				<h4 className="mb-2 fs-16 fw-medium">Gradient Border <span className="text-muted fs-13">— outlined with gradient stroke</span></h4>
				<div className="row g-3 mb-3">
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-gborder a-primary"><span className="scx-ic"><i className="ti ti-file-description"></i></span><p className="scx-label">Applications</p><h3 className="scx-value">3,654</h3></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-gborder a-success"><span className="scx-ic"><i className="ti ti-checks"></i></span><p className="scx-label">Approved</p><h3 className="scx-value">2,845</h3></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-gborder a-warning"><span className="scx-ic"><i className="ti ti-hourglass"></i></span><p className="scx-label">Waitlisted</p><h3 className="scx-value">217</h3></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-gborder a-purple"><span className="scx-ic"><i className="ti ti-user-check"></i></span><p className="scx-label">Enrolled</p><h3 className="scx-value">32</h3></div></div>
				</div>

				{/* 16. SPLIT DUAL-METRIC */}
				<h4 className="mb-2 fs-16 fw-medium">Dual Metric <span className="text-muted fs-13">— primary value + split sub-metrics</span></h4>
				<div className="row g-3 mb-2">
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-split a-primary"><div className="d-flex align-items-center justify-content-between"><div><p className="scx-label">Total Students</p><h3 className="scx-value">3,654</h3></div><span className="scx-ic"><i className="ti ti-users"></i></span></div><div className="scx-sub"><span className="fs-12"><span className="text-dark fw-semibold">3,643</span> Active</span><span className="fs-12 text-muted">11 Inactive</span></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-split a-success"><div className="d-flex align-items-center justify-content-between"><div><p className="scx-label">Teachers</p><h3 className="scx-value">284</h3></div><span className="scx-ic"><i className="ti ti-users-group"></i></span></div><div className="scx-sub"><span className="fs-12"><span className="text-dark fw-semibold">254</span> Active</span><span className="fs-12 text-muted">30 Leave</span></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-split a-warning"><div className="d-flex align-items-center justify-content-between"><div><p className="scx-label">Fees</p><h3 className="scx-value">$1.9M</h3></div><span className="scx-ic"><i className="ti ti-report-money"></i></span></div><div className="scx-sub"><span className="fs-12"><span className="text-dark fw-semibold">88%</span> Paid</span><span className="fs-12 text-muted">12% Due</span></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-split a-info"><div className="d-flex align-items-center justify-content-between"><div><p className="scx-label">Transport</p><h3 className="scx-value">18</h3></div><span className="scx-ic"><i className="ti ti-bus"></i></span></div><div className="scx-sub"><span className="fs-12"><span className="text-dark fw-semibold">15</span> On-route</span><span className="fs-12 text-muted">3 Idle</span></div></div></div>
				</div>
.
				<hr className="my-4" />
				<h4 className="mb-1">Premium Card Styles</h4>
				<p className="text-muted mb-3">8 more advanced designs — gauges, trends, avatars, leaderboards &amp; more.</p>

				{/* 17. GAUGE KPI */}
				<h5 className="mb-2">Gauge KPI <span className="text-muted fs-13">— conic gauge + icon</span></h5>
				<div className="row g-3 mb-3">
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-gauge a-primary" style={{ '--p': '82' } as CSSProperties}><div><p className="scx-label">Attendance</p><h3 className="scx-value">82%</h3></div><span className="scx-g"><i className="ti ti-calendar-check"></i></span></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-gauge a-success" style={{ '--p': '88' } as CSSProperties}><div><p className="scx-label">Fees Paid</p><h3 className="scx-value">88%</h3></div><span className="scx-g"><i className="ti ti-cash"></i></span></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-gauge a-warning" style={{ '--p': '64' } as CSSProperties}><div><p className="scx-label">Syllabus</p><h3 className="scx-value">64%</h3></div><span className="scx-g"><i className="ti ti-book"></i></span></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-gauge a-purple" style={{ '--p': '91' } as CSSProperties}><div><p className="scx-label">Pass Rate</p><h3 className="scx-value">91%</h3></div><span className="scx-g"><i className="ti ti-award"></i></span></div></div>
				</div>

				{/* 18. TREND LINE */}
				<h4 className="mb-2 fs-16 fw-medium">Trend Line <span className="text-muted fs-13">— value + inline area line</span></h4>
				<div className="row g-3 mb-3">
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-tline a-primary"><div className="d-flex align-items-center justify-content-between"><div><p className="scx-label">Enrollment</p><h3 className="scx-value">6,248</h3></div><span className="scx-chip"><i className="ti ti-arrow-up-right"></i>5%</span></div><div className="scx-line"><svg viewBox="0 0 100 40" preserveAspectRatio="none"><polyline fill="rgba(var(--scx-rgb),.12)" points="0,30 20,24 40,26 60,14 80,18 100,6 100,40 0,40" /><polyline fill="none" stroke="var(--scx)" strokeWidth="2.5" points="0,30 20,24 40,26 60,14 80,18 100,6" /></svg></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-tline a-success"><div className="d-flex align-items-center justify-content-between"><div><p className="scx-label">Revenue</p><h3 className="scx-value">$482K</h3></div><span className="scx-chip"><i className="ti ti-arrow-up-right"></i>6%</span></div><div className="scx-line"><svg viewBox="0 0 100 40" preserveAspectRatio="none"><polyline fill="rgba(var(--scx-rgb),.12)" points="0,32 20,28 40,20 60,22 80,12 100,8 100,40 0,40" /><polyline fill="none" stroke="var(--scx)" strokeWidth="2.5" points="0,32 20,28 40,20 60,22 80,12 100,8" /></svg></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-tline a-info"><div className="d-flex align-items-center justify-content-between"><div><p className="scx-label">Applications</p><h3 className="scx-value">3,654</h3></div><span className="scx-chip"><i className="ti ti-arrow-up-right"></i>2%</span></div><div className="scx-line"><svg viewBox="0 0 100 40" preserveAspectRatio="none"><polyline fill="rgba(var(--scx-rgb),.12)" points="0,26 20,30 40,22 60,24 80,16 100,18 100,40 0,40" /><polyline fill="none" stroke="var(--scx)" strokeWidth="2.5" points="0,26 20,30 40,22 60,24 80,16 100,18" /></svg></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-tline a-danger"><div className="d-flex align-items-center justify-content-between"><div><p className="scx-label">Dropouts</p><h3 className="scx-value">1.2%</h3></div><span className="scx-chip"><i className="ti ti-arrow-down-right"></i>0.3</span></div><div className="scx-line"><svg viewBox="0 0 100 40" preserveAspectRatio="none"><polyline fill="rgba(var(--scx-rgb),.12)" points="0,14 20,18 40,16 60,24 80,26 100,32 100,40 0,40" /><polyline fill="none" stroke="var(--scx)" strokeWidth="2.5" points="0,14 20,18 40,16 60,24 80,26 100,32" /></svg></div></div></div>
				</div>

				{/* 19. AVATAR GROUP */}
				<h4 className="mb-2 fs-16 fw-medium">Avatar Group <span className="text-muted fs-13">— people-based metric</span></h4>
				<div className="row g-3 mb-3">
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-people a-primary"><div className="d-flex align-items-center justify-content-between"><div><p className="scx-label">New Enrollments</p><h3 className="scx-value">48</h3></div><span className="scx-chip">This week</span></div><div className="scx-ppl"><img src="assets/img/students/student-01.jpg" alt="" /><img src="assets/img/students/student-02.jpg" alt="" /><img src="assets/img/students/student-03.jpg" alt="" /><img src="assets/img/students/student-04.jpg" alt="" /><span className="more">+44</span></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-people a-success"><div className="d-flex align-items-center justify-content-between"><div><p className="scx-label">Online Now</p><h3 className="scx-value">126</h3></div><span className="scx-chip">Live</span></div><div className="scx-ppl"><img src="assets/img/profiles/avatar-27.jpg" alt="" /><img src="assets/img/profiles/avatar-23.jpg" alt="" /><img src="assets/img/profiles/avatar-25.jpg" alt="" /><span className="more">+123</span></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-people a-warning"><div className="d-flex align-items-center justify-content-between"><div><p className="scx-label">Absent Today</p><h3 className="scx-value">14</h3></div><span className="scx-chip">Flagged</span></div><div className="scx-ppl"><img src="assets/img/students/student-05.jpg" alt="" /><img src="assets/img/students/student-09.jpg" alt="" /><span className="more">+12</span></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-people a-purple"><div className="d-flex align-items-center justify-content-between"><div><p className="scx-label">Toppers</p><h3 className="scx-value">18</h3></div><span className="scx-chip">Term 2</span></div><div className="scx-ppl"><img src="assets/img/students/student-10.jpg" alt="" /><img src="assets/img/students/student-11.jpg" alt="" /><img src="assets/img/students/student-12.jpg" alt="" /><span className="more">+15</span></div></div></div>
				</div>

				{/* 20. LEADERBOARD */}
				<h4 className="mb-2 fs-16 fw-medium">Leaderboard <span className="text-muted fs-13">— ranked mini-list</span></h4>
				<div className="row g-3 mb-3">
					<div className="col-xl-4 col-md-6 d-flex"><div className="scx scx-rank a-warning"><div className="d-flex align-items-center justify-content-between mb-2"><p className="scx-label mb-0">Top Classes</p><span className="scx-ic"><i className="ti ti-trophy"></i></span></div><div className="rankrow"><span className="rk">1</span><span className="flex-grow-1 fs-13 text-truncate">Class III-A</span><span className="fw-semibold">94.2%</span></div><div className="rankrow"><span className="rk">2</span><span className="flex-grow-1 fs-13 text-truncate">Class V-B</span><span className="fw-semibold">92.8%</span></div><div className="rankrow"><span className="rk">3</span><span className="flex-grow-1 fs-13 text-truncate">Class IV-C</span><span className="fw-semibold">90.6%</span></div></div></div>
					<div className="col-xl-4 col-md-6 d-flex"><div className="scx scx-rank a-primary"><div className="d-flex align-items-center justify-content-between mb-2"><p className="scx-label mb-0">Top Students</p><span className="scx-ic"><i className="ti ti-medal"></i></span></div><div className="rankrow"><span className="rk">1</span><img src="assets/img/students/student-01.jpg" alt="" /><span className="flex-grow-1 fs-13 text-truncate">Janet Daniel</span><span className="fw-semibold">2,480</span></div><div className="rankrow"><span className="rk">2</span><img src="assets/img/students/student-03.jpg" alt="" /><span className="flex-grow-1 fs-13 text-truncate">Sophia Reyes</span><span className="fw-semibold">2,210</span></div><div className="rankrow"><span className="rk">3</span><img src="assets/img/students/student-05.jpg" alt="" /><span className="flex-grow-1 fs-13 text-truncate">Mia Bennett</span><span className="fw-semibold">1,980</span></div></div></div>
					<div className="col-xl-4 col-md-6 d-flex"><div className="scx scx-rank a-success"><div className="d-flex align-items-center justify-content-between mb-2"><p className="scx-label mb-0">Fee Collection</p><span className="scx-ic"><i className="ti ti-report-money"></i></span></div><div className="rankrow"><span className="rk">1</span><span className="flex-grow-1 fs-13 text-truncate">Main Campus</span><span className="fw-semibold">$1.2M</span></div><div className="rankrow"><span className="rk">2</span><span className="flex-grow-1 fs-13 text-truncate">North Branch</span><span className="fw-semibold">$480K</span></div><div className="rankrow"><span className="rk">3</span><span className="flex-grow-1 fs-13 text-truncate">City Annexe</span><span className="fw-semibold">$210K</span></div></div></div>
				</div>

				{/* 21. BIG GRADIENT TILE */}
				<h5 className="mb-2">Big Gradient Tile <span className="text-muted fs-13">— large icon + metric</span></h5>
				<div className="row g-3 mb-3">
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-bigtile a-primary"><span className="bt"><i className="ti ti-users"></i></span><div><p className="scx-label">Students</p><h3 className="scx-value">3,654</h3></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-bigtile a-success"><span className="bt"><i className="ti ti-users-group"></i></span><div><p className="scx-label">Teachers</p><h3 className="scx-value">284</h3></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-bigtile a-warning"><span className="bt"><i className="ti ti-briefcase"></i></span><div><p className="scx-label">Staff</p><h3 className="scx-value">162</h3></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-bigtile a-teal"><span className="bt"><i className="ti ti-book"></i></span><div><p className="scx-label">Subjects</p><h3 className="scx-value">82</h3></div></div></div>
				</div>

				{/* 22. COMPARE */}
				<h4 className="mb-2 fs-16 fw-medium">Comparison <span className="text-muted fs-13">— vs previous period</span></h4>
				<div className="row g-3 mb-3">
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-compare a-primary"><div className="d-flex align-items-start justify-content-between"><div><p className="scx-label">Applications</p><h3 className="scx-value">3,654</h3></div><span className="scx-ic"><i className="ti ti-file-description"></i></span></div><div className="cmp"><span className="up"><i className="ti ti-arrow-up-right"></i>12.4%</span><span className="text-muted">vs last month (3,250)</span></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-compare a-success"><div className="d-flex align-items-start justify-content-between"><div><p className="scx-label">Revenue</p><h3 className="scx-value">$482K</h3></div><span className="scx-ic"><i className="ti ti-cash"></i></span></div><div className="cmp"><span className="up"><i className="ti ti-arrow-up-right"></i>6.1%</span><span className="text-muted">vs last month</span></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-compare a-danger"><div className="d-flex align-items-start justify-content-between"><div><p className="scx-label">Outstanding</p><h3 className="scx-value">$248K</h3></div><span className="scx-ic"><i className="ti ti-alert-triangle"></i></span></div><div className="cmp"><span className="down"><i className="ti ti-arrow-down-right"></i>3.0%</span><span className="text-muted">vs last month</span></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-compare a-info"><div className="d-flex align-items-start justify-content-between"><div><p className="scx-label">Attendance</p><h3 className="scx-value">93.7%</h3></div><span className="scx-ic"><i className="ti ti-calendar-check"></i></span></div><div className="cmp"><span className="up"><i className="ti ti-arrow-up-right"></i>1.1%</span><span className="text-muted">vs last week</span></div></div></div>
				</div>

				{/* 23. PULSE STATUS */}
				<h4 className="mb-2 fs-16 fw-medium">Live Status <span className="text-muted fs-13">— pulsing indicator</span></h4>
				<div className="row g-3 mb-3">
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-pulse a-success"><div className="d-flex align-items-center justify-content-between"><div><p className="scx-label"><span className="dot"></span>Buses Running</p><h3 className="scx-value">18</h3></div><span className="scx-ic"><i className="ti ti-bus"></i></span></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-pulse a-primary"><div className="d-flex align-items-center justify-content-between"><div><p className="scx-label"><span className="dot"></span>Online Classes</p><h3 className="scx-value">6</h3></div><span className="scx-ic"><i className="ti ti-video"></i></span></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-pulse a-warning"><div className="d-flex align-items-center justify-content-between"><div><p className="scx-label"><span className="dot"></span>Pending Approvals</p><h3 className="scx-value">12</h3></div><span className="scx-ic"><i className="ti ti-checks"></i></span></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-pulse a-danger"><div className="d-flex align-items-center justify-content-between"><div><p className="scx-label"><span className="dot"></span>Active Alerts</p><h3 className="scx-value">3</h3></div><span className="scx-ic"><i className="ti ti-bell-ringing"></i></span></div></div></div>
				</div>

				{/* 24. DISTRIBUTION */}
				<h4 className="mb-2 fs-16 fw-medium">Distribution <span className="text-muted fs-13">— segmented multi-metric bar</span></h4>
				<div className="row g-3 mb-2">
					<div className="col-xl-6 d-flex"><div className="scx a-primary scx-dist"><div className="d-flex align-items-center justify-content-between"><div><p className="scx-label">Attendance Breakdown</p><h3 className="scx-value">3,654</h3></div><span className="scx-ic"><i className="ti ti-users"></i></span></div><div className="distbar"><span style={{ width: '82%', background: '#0ca678' }}></span><span style={{ width: '8%', background: '#e7515a' }}></span><span style={{ width: '6%', background: '#f39c12' }}></span><span style={{ width: '4%', background: '#3b7ddd' }}></span></div><div className="distlegend"><span><i className="ti ti-circle-filled" style={{ color: '#0ca678' }}></i>Present 82%</span><span><i className="ti ti-circle-filled" style={{ color: '#e7515a' }}></i>Absent 8%</span><span><i className="ti ti-circle-filled" style={{ color: '#f39c12' }}></i>Late 6%</span><span><i className="ti ti-circle-filled" style={{ color: '#3b7ddd' }}></i>Leave 4%</span></div></div></div>
					<div className="col-xl-6 d-flex"><div className="scx a-primary scx-dist"><div className="d-flex align-items-center justify-content-between"><div><p className="scx-label">Fee Status</p><h3 className="scx-value">$2.15M</h3></div><span className="scx-ic"><i className="ti ti-report-money"></i></span></div><div className="distbar"><span style={{ width: '70%', background: '#0ca678' }}></span><span style={{ width: '18%', background: '#f39c12' }}></span><span style={{ width: '12%', background: '#e7515a' }}></span></div><div className="distlegend"><span><i className="ti ti-circle-filled" style={{ color: '#0ca678' }}></i>Paid 70%</span><span><i className="ti ti-circle-filled" style={{ color: '#f39c12' }}></i>Partial 18%</span><span><i className="ti ti-circle-filled" style={{ color: '#e7515a' }}></i>Unpaid 12%</span></div></div></div>
				</div>
.
				<hr className="my-4" />
				<h4 className="mb-1">Advanced Card Styles</h4>
				<p className="text-muted mb-3">8 more variants — goals, heatmaps, rings, ribbons &amp; more.</p>

				{/* 25. GOAL TARGET */}
				<h5 className="mb-2">Goal Target <span className="text-muted fs-13">— progress toward a goal</span></h5>
				<div className="row g-3 mb-3">
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-goal a-primary"><div className="d-flex align-items-center justify-content-between"><div><p className="scx-label">Enrollment</p><h3 className="scx-value">6,248</h3></div><span className="scx-ic"><i className="ti ti-target-arrow"></i></span></div><div className="goalbar"><span style={{ width: '83%' }}></span></div><div className="goaltxt"><span>83% of goal</span><span>Goal 7,500</span></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-goal a-success"><div className="d-flex align-items-center justify-content-between"><div><p className="scx-label">Fees Collected</p><h3 className="scx-value">$1.9M</h3></div><span className="scx-ic"><i className="ti ti-cash"></i></span></div><div className="goalbar"><span style={{ width: '88%' }}></span></div><div className="goaltxt"><span>88% of target</span><span>Target $2.15M</span></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-goal a-warning"><div className="d-flex align-items-center justify-content-between"><div><p className="scx-label">Admissions</p><h3 className="scx-value">2,410</h3></div><span className="scx-ic"><i className="ti ti-user-plus"></i></span></div><div className="goalbar"><span style={{ width: '60%' }}></span></div><div className="goaltxt"><span>60% of goal</span><span>Goal 4,000</span></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-goal a-purple"><div className="d-flex align-items-center justify-content-between"><div><p className="scx-label">Library Issued</p><h3 className="scx-value">1,204</h3></div><span className="scx-ic"><i className="ti ti-book-upload"></i></span></div><div className="goalbar"><span style={{ width: '48%' }}></span></div><div className="goaltxt"><span>48% of capacity</span><span>Cap 2,500</span></div></div></div>
				</div>

				{/* 26. HEATMAP */}
				<h4 className="mb-2 fs-16 fw-medium">Heatmap Tile <span className="text-muted fs-13">— activity intensity grid</span></h4>
				<div className="row g-3 mb-3">
					<div className="col-xl-4 col-md-6 d-flex"><div className="scx scx-heat a-success"><div className="d-flex align-items-center justify-content-between"><div><p className="scx-label">Attendance (30 days)</p><h3 className="scx-value">93.7%</h3></div><span className="scx-chip">Month</span></div><div className="hm"><i className="l4"></i><i className="l3"></i><i className="l4"></i><i className="l2"></i><i className="l4"></i><i className="l3"></i><i className="l4"></i><i className="l1"></i><i className="l4"></i><i className="l3"></i><i className="l4"></i><i className="l4"></i><i className="l2"></i><i className="l4"></i><i className="l3"></i><i className="l4"></i><i className="l4"></i><i className="l1"></i><i className="l3"></i><i className="l4"></i></div></div></div>
					<div className="col-xl-4 col-md-6 d-flex"><div className="scx scx-heat a-primary"><div className="d-flex align-items-center justify-content-between"><div><p className="scx-label">Logins</p><h3 className="scx-value">18.4K</h3></div><span className="scx-chip">Active</span></div><div className="hm"><i className="l2"></i><i className="l4"></i><i className="l3"></i><i className="l4"></i><i className="l1"></i><i className="l4"></i><i className="l3"></i><i className="l4"></i><i className="l2"></i><i className="l3"></i><i className="l4"></i><i className="l1"></i><i className="l4"></i><i className="l3"></i><i className="l4"></i><i className="l2"></i><i className="l4"></i><i className="l4"></i><i className="l3"></i><i className="l4"></i></div></div></div>
					<div className="col-xl-4 col-md-6 d-flex"><div className="scx scx-heat a-warning"><div className="d-flex align-items-center justify-content-between"><div><p className="scx-label">Late Arrivals</p><h3 className="scx-value">142</h3></div><span className="scx-chip">Month</span></div><div className="hm"><i className="l1"></i><i className="l2"></i><i></i><i className="l3"></i><i className="l1"></i><i className="l2"></i><i></i><i className="l4"></i><i className="l1"></i><i></i><i className="l2"></i><i className="l3"></i><i></i><i className="l1"></i><i className="l2"></i><i></i><i className="l3"></i><i className="l1"></i><i></i><i className="l2"></i></div></div></div>
				</div>

				{/* 27. CONCENTRIC RINGS */}
				<h4 className="mb-2 fs-16 fw-medium">Concentric Rings <span className="text-muted fs-13">— dual-metric radial</span></h4>
				<div className="row g-3 mb-3">
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-rings a-primary" style={{ '--p1': '88', '--p2': '64' } as CSSProperties}><div className="ring"></div><div><p className="scx-label">Attendance / Syllabus</p><h3 className="scx-value">88%</h3><span className="fs-12" style={{ color: '#f39c12' }}>64% syllabus</span></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-rings a-success" style={{ '--p1': '92', '--p2': '70' } as CSSProperties}><div className="ring"></div><div><p className="scx-label">Pass / Distinction</p><h3 className="scx-value">92%</h3><span className="fs-12" style={{ color: '#f39c12' }}>70% distinction</span></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-rings a-info" style={{ '--p1': '76', '--p2': '52' } as CSSProperties}><div className="ring"></div><div><p className="scx-label">Collected / Target</p><h3 className="scx-value">76%</h3><span className="fs-12" style={{ color: '#f39c12' }}>52% advance</span></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-rings a-purple" style={{ '--p1': '60', '--p2': '35' } as CSSProperties}><div className="ring"></div><div><p className="scx-label">Occupancy / Booked</p><h3 className="scx-value">60%</h3><span className="fs-12" style={{ color: '#f39c12' }}>35% booked</span></div></div></div>
				</div>

				{/* 28. RIBBON CORNER */}
				<h4 className="mb-2 fs-16 fw-medium">Ribbon Corner <span className="text-muted fs-13">— corner status ribbon</span></h4>
				<div className="row g-3 mb-3">
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-ribbon a-success"><span className="rib">NEW</span><span className="scx-ic"><i className="ti ti-user-plus"></i></span><p className="scx-label">Admissions</p><h3 className="scx-value">218</h3></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-ribbon a-danger"><span className="rib">URGENT</span><span className="scx-ic"><i className="ti ti-alert-triangle"></i></span><p className="scx-label">Overdue Fees</p><h3 className="scx-value">$248K</h3></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-ribbon a-primary"><span className="rib">TOP</span><span className="scx-ic"><i className="ti ti-award"></i></span><p className="scx-label">Best Class</p><h3 className="scx-value">III-A</h3></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-ribbon a-warning"><span className="rib">LIVE</span><span className="scx-ic"><i className="ti ti-broadcast"></i></span><p className="scx-label">Online Exams</p><h3 className="scx-value">3</h3></div></div>
				</div>

				{/* 29. DIAGONAL TWO-TONE */}
				<h4 className="mb-2 fs-16 fw-medium">Diagonal Two-Tone <span className="text-muted fs-13">— angled split fill</span></h4>
				<div className="row g-3 mb-3">
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-diag a-primary"><div className="d-flex align-items-start justify-content-between"><span className="scx-ic"><i className="ti ti-users"></i></span><span className="scx-chip"><i className="ti ti-arrow-up-right"></i>2%</span></div><h3 className="scx-value mt-3">3,654</h3><p className="scx-label">Students</p></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-diag a-success"><div className="d-flex align-items-start justify-content-between"><span className="scx-ic"><i className="ti ti-cash"></i></span><span className="scx-chip"><i className="ti ti-arrow-up-right"></i>6%</span></div><h3 className="scx-value mt-3">$482K</h3><p className="scx-label">Revenue</p></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-diag a-purple"><div className="d-flex align-items-start justify-content-between"><span className="scx-ic"><i className="ti ti-calendar-check"></i></span><span className="scx-chip"><i className="ti ti-arrow-up-right"></i>1%</span></div><h3 className="scx-value mt-3">93.7%</h3><p className="scx-label">Attendance</p></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-diag a-teal"><div className="d-flex align-items-start justify-content-between"><span className="scx-ic"><i className="ti ti-award"></i></span><span className="scx-chip">A+</span></div><h3 className="scx-value mt-3">91.2%</h3><p className="scx-label">Pass Rate</p></div></div>
				</div>

				{/* 30. FOOTER ACTION */}
				<h4 className="mb-2 fs-16 fw-medium">Footer Action <span className="text-muted fs-13">— metric + inline link</span></h4>
				<div className="row g-3 mb-3">
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-action a-primary"><div className="d-flex align-items-center justify-content-between"><div><p className="scx-label">Pending Review</p><h3 className="scx-value">218</h3></div><span className="scx-ic"><i className="ti ti-clock-hour-4"></i></span></div><div className="act"><span className="fs-12 text-muted">Needs action</span><a role="button" tabIndex={0}>Review <i className="ti ti-arrow-right"></i></a></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-action a-danger"><div className="d-flex align-items-center justify-content-between"><div><p className="scx-label">Defaulters</p><h3 className="scx-value">84</h3></div><span className="scx-ic"><i className="ti ti-user-x"></i></span></div><div className="act"><span className="fs-12 text-muted">Send reminders</span><a role="button" tabIndex={0}>Notify <i className="ti ti-arrow-right"></i></a></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-action a-success"><div className="d-flex align-items-center justify-content-between"><div><p className="scx-label">Applications</p><h3 className="scx-value">3,654</h3></div><span className="scx-ic"><i className="ti ti-file-description"></i></span></div><div className="act"><span className="fs-12 text-muted">This term</span><a role="button" tabIndex={0}>View all <i className="ti ti-arrow-right"></i></a></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-action a-info"><div className="d-flex align-items-center justify-content-between"><div><p className="scx-label">Messages</p><h3 className="scx-value">42</h3></div><span className="scx-ic"><i className="ti ti-mail"></i></span></div><div className="act"><span className="fs-12 text-muted">Unread</span><a role="button" tabIndex={0}>Open <i className="ti ti-arrow-right"></i></a></div></div></div>
				</div>

				{/* 31. VERTICAL BAR + BIG NUMBER */}
				<h4 className="mb-2 fs-16 fw-medium">Vertical Accent <span className="text-muted fs-13">— gradient bar + oversized value</span></h4>
				<div className="row g-3 mb-3">
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-vbar a-primary"><p className="scx-label">Total Students</p><h3 className="scx-value">3,654</h3><span className="scx-chip"><i className="ti ti-arrow-up-right"></i>2.1%</span></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-vbar a-success"><p className="scx-label">Revenue</p><h3 className="scx-value">$482K</h3><span className="scx-chip"><i className="ti ti-arrow-up-right"></i>6%</span></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-vbar a-warning"><p className="scx-label">Staff</p><h3 className="scx-value">412</h3><span className="scx-chip">HR</span></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-vbar a-purple"><p className="scx-label">Subjects</p><h3 className="scx-value">82</h3><span className="scx-chip">Academic</span></div></div>
				</div>

				{/* 32. CHIP STACK */}
				<h4 className="mb-2 fs-16 fw-medium">Chip Stack <span className="text-muted fs-13">— metric + status breakdown chips</span></h4>
				<div className="row g-3 mb-2">
					<div className="col-xl-4 col-md-6 d-flex"><div className="scx scx-chips a-primary"><div className="d-flex align-items-center justify-content-between"><div><p className="scx-label">Admissions</p><h3 className="scx-value">3,654</h3></div><span className="scx-ic"><i className="ti ti-file-description"></i></span></div><div className="cs"><span className="b">Approved 2,845</span><span className="b">Pending 218</span><span className="b">Waitlist 217</span><span className="b">Rejected 374</span></div></div></div>
					<div className="col-xl-4 col-md-6 d-flex"><div className="scx scx-chips a-success"><div className="d-flex align-items-center justify-content-between"><div><p className="scx-label">Documents</p><h3 className="scx-value">9,842</h3></div><span className="scx-ic"><i className="ti ti-files"></i></span></div><div className="cs"><span className="b">Verified 8,120</span><span className="b">Pending 1,240</span><span className="b">Expired 92</span></div></div></div>
					<div className="col-xl-4 col-md-6 d-flex"><div className="scx scx-chips a-warning"><div className="d-flex align-items-center justify-content-between"><div><p className="scx-label">Tickets</p><h3 className="scx-value">168</h3></div><span className="scx-ic"><i className="ti ti-ticket"></i></span></div><div className="cs"><span className="b">Open 42</span><span className="b">In Progress 30</span><span className="b">Resolved 96</span></div></div></div>
				</div>
.
				<hr className="my-4" />
				<h4 className="mb-1">Creative Card Styles</h4>
				<p className="text-muted mb-3">8 more variants — gradient text, neon, gauges, bullet charts &amp; more.</p>

				{/* 33. GRADIENT TEXT */}
				<h5 className="mb-2">Gradient Text <span className="text-muted fs-13">— gradient-filled value</span></h5>
				<div className="row g-3 mb-3">
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-gtext a-primary"><span className="scx-ic"><i className="ti ti-users"></i></span><h3 className="scx-value">3,654</h3><p className="scx-label">Total Students</p></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-gtext a-success"><span className="scx-ic"><i className="ti ti-cash"></i></span><h3 className="scx-value">$482K</h3><p className="scx-label">Revenue</p></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-gtext a-info"><span className="scx-ic"><i className="ti ti-calendar-check"></i></span><h3 className="scx-value">93.7%</h3><p className="scx-label">Attendance</p></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-gtext a-danger"><span className="scx-ic"><i className="ti ti-award"></i></span><h3 className="scx-value">91.2%</h3><p className="scx-label">Pass Rate</p></div></div>
				</div>

				{/* 34. NEON GLOW */}
				<h4 className="mb-2 fs-16 fw-medium">Neon Glow <span className="text-muted fs-13">— dark premium with glow</span></h4>
				<div className="row g-3 mb-3">
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-neon a-primary"><div className="d-flex align-items-start justify-content-between"><span className="scx-ic"><i className="ti ti-robot"></i></span><span className="scx-chip">Live</span></div><h3 className="scx-value mt-3">9</h3><p className="scx-label">AI Models</p></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-neon a-success"><div className="d-flex align-items-start justify-content-between"><span className="scx-ic"><i className="ti ti-bolt"></i></span><span className="scx-chip">On</span></div><h3 className="scx-value mt-3">142</h3><p className="scx-label">Insights Today</p></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-neon a-teal"><div className="d-flex align-items-start justify-content-between"><span className="scx-ic"><i className="ti ti-target-arrow"></i></span><span className="scx-chip">94%</span></div><h3 className="scx-value mt-3">94.2%</h3><p className="scx-label">Accuracy</p></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-neon a-danger"><div className="d-flex align-items-start justify-content-between"><span className="scx-ic"><i className="ti ti-alert-triangle"></i></span><span className="scx-chip">Review</span></div><h3 className="scx-value mt-3">7</h3><p className="scx-label">Alerts</p></div></div>
				</div>

				{/* 35. STEPPED GAUGE */}
				<h4 className="mb-2 fs-16 fw-medium">Stepped Gauge <span className="text-muted fs-13">— segmented level bars</span></h4>
				<div className="row g-3 mb-3">
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-steps a-success"><div className="d-flex align-items-center justify-content-between"><div><p className="scx-label">Server Health</p><h3 className="scx-value">Good</h3></div><span className="scx-chip">92%</span></div><div className="st"><span className="on"></span><span className="on"></span><span className="on"></span><span className="on"></span><span className="on"></span><span></span></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-steps a-primary"><div className="d-flex align-items-center justify-content-between"><div><p className="scx-label">Syllabus</p><h3 className="scx-value">4 / 6</h3></div><span className="scx-chip">Units</span></div><div className="st"><span className="on"></span><span className="on"></span><span className="on"></span><span className="on"></span><span></span><span></span></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-steps a-warning"><div className="d-flex align-items-center justify-content-between"><div><p className="scx-label">Fee Term</p><h3 className="scx-value">2 / 3</h3></div><span className="scx-chip">Paid</span></div><div className="st"><span className="on"></span><span className="on"></span><span></span></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-steps a-danger"><div className="d-flex align-items-center justify-content-between"><div><p className="scx-label">Capacity</p><h3 className="scx-value">High</h3></div><span className="scx-chip">88%</span></div><div className="st"><span className="on"></span><span className="on"></span><span className="on"></span><span className="on"></span><span className="on"></span></div></div></div>
				</div>

				{/* 36. BULLET CHART */}
				<h4 className="mb-2 fs-16 fw-medium">Bullet Chart <span className="text-muted fs-13">— actual vs target marker</span></h4>
				<div className="row g-3 mb-3">
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-bullet a-primary"><div className="d-flex align-items-center justify-content-between"><div><p className="scx-label">Enrollment</p><h3 className="scx-value">6,248</h3></div><span className="scx-ic"><i className="ti ti-users"></i></span></div><div className="bl"><div className="fill" style={{ width: '83%' }}></div><div className="tgt" style={{ left: '92%' }}></div></div><div className="blt"><span>Actual 83%</span><span>Target 7,500</span></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-bullet a-success"><div className="d-flex align-items-center justify-content-between"><div><p className="scx-label">Fees</p><h3 className="scx-value">$1.9M</h3></div><span className="scx-ic"><i className="ti ti-cash"></i></span></div><div className="bl"><div className="fill" style={{ width: '88%' }}></div><div className="tgt" style={{ left: '100%' }}></div></div><div className="blt"><span>Actual 88%</span><span>Target $2.15M</span></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-bullet a-warning"><div className="d-flex align-items-center justify-content-between"><div><p className="scx-label">Attendance</p><h3 className="scx-value">93.7%</h3></div><span className="scx-ic"><i className="ti ti-calendar-check"></i></span></div><div className="bl"><div className="fill" style={{ width: '94%' }}></div><div className="tgt" style={{ left: '95%' }}></div></div><div className="blt"><span>Actual 94%</span><span>Target 95%</span></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-bullet a-info"><div className="d-flex align-items-center justify-content-between"><div><p className="scx-label">Placements</p><h3 className="scx-value">312</h3></div><span className="scx-ic"><i className="ti ti-briefcase"></i></span></div><div className="bl"><div className="fill" style={{ width: '62%' }}></div><div className="tgt" style={{ left: '80%' }}></div></div><div className="blt"><span>Actual 62%</span><span>Target 500</span></div></div></div>
				</div>

				{/* 37. AVATAR IN RING */}
				<h4 className="mb-2 fs-16 fw-medium">Avatar Ring <span className="text-muted fs-13">— avatar inside progress ring</span></h4>
				<div className="row g-3 mb-3">
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-avring a-primary" style={{ '--p': '82' } as CSSProperties}><div className="ar"><img src="assets/img/students/student-01.jpg" alt="" /><b>82%</b></div><div><p className="scx-label">Top Student</p><h3 className="scx-value">Janet</h3><span className="fs-12 text-muted">Class III-A</span></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-avring a-success" style={{ '--p': '96' } as CSSProperties}><div className="ar"><img src="assets/img/profiles/avatar-27.jpg" alt="" /><b>96%</b></div><div><p className="scx-label">Top Teacher</p><h3 className="scx-value">Teena</h3><span className="fs-12 text-muted">Mathematics</span></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-avring a-warning" style={{ '--p': '74' } as CSSProperties}><div className="ar"><img src="assets/img/students/student-03.jpg" alt="" /><b>74%</b></div><div><p className="scx-label">Attendance</p><h3 className="scx-value">Sophia</h3><span className="fs-12 text-muted">Class III-A</span></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-avring a-purple" style={{ '--p': '88' } as CSSProperties}><div className="ar"><img src="assets/img/students/student-05.jpg" alt="" /><b>88%</b></div><div><p className="scx-label">Best Sports</p><h3 className="scx-value">Mia</h3><span className="fs-12 text-muted">Class II-A</span></div></div></div>
				</div>

				{/* 38. CALENDAR TILE */}
				<h4 className="mb-2 fs-16 fw-medium">Calendar Tile <span className="text-muted fs-13">— date-based metric</span></h4>
				<div className="row g-3 mb-3">
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-cal a-primary"><div className="cal"><div className="m">Jul</div><div className="d">15</div></div><div><p className="scx-label">Next Exam</p><h3 className="scx-value">Maths</h3><span className="fs-12 text-muted">Class III-A</span></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-cal a-danger"><div className="cal"><div className="m">Jul</div><div className="d">20</div></div><div><p className="scx-label">Fee Due</p><h3 className="scx-value">Term 2</h3><span className="fs-12 text-muted">$1,050</span></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-cal a-success"><div className="cal"><div className="m">Jul</div><div className="d">22</div></div><div><p className="scx-label">Event</p><h3 className="scx-value">Annual Day</h3><span className="fs-12 text-muted">Auditorium</span></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-cal a-warning"><div className="cal"><div className="m">Jul</div><div className="d">28</div></div><div><p className="scx-label">Holiday</p><h3 className="scx-value">Break</h3><span className="fs-12 text-muted">Summer</span></div></div></div>
				</div>

				{/* 39. SPLIT DUO */}
				<h4 className="mb-2 fs-16 fw-medium">Split Duo <span className="text-muted fs-13">— two metrics in one card</span></h4>
				<div className="row g-3 mb-3">
					<div className="col-xl-4 col-md-6 d-flex"><div className="scx scx-duo a-primary"><div><p className="scx-label">Present</p><h3 className="scx-value text-success">3,540</h3></div><div className="sep"></div><div><p className="scx-label">Absent</p><h3 className="scx-value text-danger">114</h3></div></div></div>
					<div className="col-xl-4 col-md-6 d-flex"><div className="scx scx-duo a-success"><div><p className="scx-label">Paid</p><h3 className="scx-value text-success">$1.9M</h3></div><div className="sep"></div><div><p className="scx-label">Due</p><h3 className="scx-value text-warning">$248K</h3></div></div></div>
					<div className="col-xl-4 col-md-6 d-flex"><div className="scx scx-duo a-info"><div><p className="scx-label">Male</p><h3 className="scx-value">1,980</h3></div><div className="sep"></div><div><p className="scx-label">Female</p><h3 className="scx-value">1,674</h3></div></div></div>
				</div>

				{/* 40. PROGRESS STACK */}
				<h4 className="mb-2 fs-16 fw-medium">Progress Stack <span className="text-muted fs-13">— multiple labeled bars</span></h4>
				<div className="row g-3 mb-2">
					<div className="col-xl-4 col-md-6 d-flex"><div className="scx scx-pstack a-primary"><div className="d-flex align-items-center justify-content-between"><div><p className="scx-label">Class Performance</p><h3 className="scx-value">Grade Avg</h3></div><span className="scx-ic"><i className="ti ti-chart-bar"></i></span></div><div className="pr"><div className="lbl"><span>Maths</span><span>92%</span></div><div className="bar"><span style={{ width: '92%', background: '#3577f1' }}></span></div></div><div className="pr"><div className="lbl"><span>Science</span><span>85%</span></div><div className="bar"><span style={{ width: '85%', background: '#0ca678' }}></span></div></div><div className="pr"><div className="lbl"><span>English</span><span>78%</span></div><div className="bar"><span style={{ width: '78%', background: '#f39c12' }}></span></div></div></div></div>
					<div className="col-xl-4 col-md-6 d-flex"><div className="scx scx-pstack a-success"><div className="d-flex align-items-center justify-content-between"><div><p className="scx-label">Fee Collection</p><h3 className="scx-value">By Class</h3></div><span className="scx-ic"><i className="ti ti-report-money"></i></span></div><div className="pr"><div className="lbl"><span>Class I</span><span>95%</span></div><div className="bar"><span style={{ width: '95%', background: '#0ca678' }}></span></div></div><div className="pr"><div className="lbl"><span>Class II</span><span>82%</span></div><div className="bar"><span style={{ width: '82%', background: '#3577f1' }}></span></div></div><div className="pr"><div className="lbl"><span>Class III</span><span>70%</span></div><div className="bar"><span style={{ width: '70%', background: '#f39c12' }}></span></div></div></div></div>
					<div className="col-xl-4 col-md-6 d-flex"><div className="scx scx-pstack a-info"><div className="d-flex align-items-center justify-content-between"><div><p className="scx-label">Transport Usage</p><h3 className="scx-value">By Route</h3></div><span className="scx-ic"><i className="ti ti-bus"></i></span></div><div className="pr"><div className="lbl"><span>Route 12</span><span>88%</span></div><div className="bar"><span style={{ width: '88%', background: '#3577f1' }}></span></div></div><div className="pr"><div className="lbl"><span>Route 05</span><span>64%</span></div><div className="bar"><span style={{ width: '64%', background: '#12b3b3' }}></span></div></div><div className="pr"><div className="lbl"><span>Route 08</span><span>45%</span></div><div className="bar"><span style={{ width: '45%', background: '#e7515a' }}></span></div></div></div></div>
				</div>
.
				<hr className="my-4" />
				<h4 className="mb-1">More Card Styles</h4>
				<p className="text-muted mb-3">8 more variants — flat, wave, mesh, side panels &amp; more.</p>

				{/* 42. WAVE BOTTOM */}
				<h5 className="mb-2">Wave Bottom <span className="text-muted fs-13">— accent wave footer</span></h5>
				<div className="row g-3 mb-3">
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-wave a-primary"><span className="scx-ic"><i className="ti ti-cash"></i></span><h3 className="scx-value">$482K</h3><p className="scx-label">Revenue</p><div className="wv"><svg viewBox="0 0 100 40" preserveAspectRatio="none"><path fill="rgba(var(--scx-rgb),.18)" d="M0,20 C25,4 45,34 70,18 C85,9 95,20 100,16 L100,40 L0,40 Z" /></svg></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-wave a-success"><span className="scx-ic"><i className="ti ti-calendar-check"></i></span><h3 className="scx-value">93.7%</h3><p className="scx-label">Attendance</p><div className="wv"><svg viewBox="0 0 100 40" preserveAspectRatio="none"><path fill="rgba(var(--scx-rgb),.18)" d="M0,24 C20,10 40,26 60,14 C80,4 92,22 100,12 L100,40 L0,40 Z" /></svg></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-wave a-info"><span className="scx-ic"><i className="ti ti-users"></i></span><h3 className="scx-value">6,248</h3><p className="scx-label">Enrollment</p><div className="wv"><svg viewBox="0 0 100 40" preserveAspectRatio="none"><path fill="rgba(var(--scx-rgb),.18)" d="M0,16 C25,28 45,8 70,22 C85,30 95,16 100,20 L100,40 L0,40 Z" /></svg></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-wave a-danger"><span className="scx-ic"><i className="ti ti-alert-triangle"></i></span><h3 className="scx-value">$248K</h3><p className="scx-label">Outstanding</p><div className="wv"><svg viewBox="0 0 100 40" preserveAspectRatio="none"><path fill="rgba(var(--scx-rgb),.18)" d="M0,20 C20,12 40,24 60,16 C80,8 92,24 100,18 L100,40 L0,40 Z" /></svg></div></div></div>
				</div>

				{/* 43. MESH BLOBS */}
				<h4 className="mb-2 fs-16 fw-medium">Mesh Blobs <span className="text-muted fs-13">— soft blurred gradient orbs</span></h4>
				<div className="row g-3 mb-3">
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-mesh a-primary"><span className="scx-ic"><i className="ti ti-sparkles"></i></span><h3 className="scx-value">142</h3><p className="scx-label">AI Insights</p></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-mesh a-success"><span className="scx-ic"><i className="ti ti-trending-up"></i></span><h3 className="scx-value">+8.4%</h3><p className="scx-label">Growth</p></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-mesh a-teal"><span className="scx-ic"><i className="ti ti-world"></i></span><h3 className="scx-value">3</h3><p className="scx-label">Branches</p></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-mesh a-pink"><span className="scx-ic"><i className="ti ti-heart"></i></span><h3 className="scx-value">4.6</h3><p className="scx-label">Satisfaction</p></div></div>
				</div>

				{/* 44. INLINE DELTA */}
				<h4 className="mb-2 fs-16 fw-medium">Inline Delta <span className="text-muted fs-13">— value with adjacent change</span></h4>
				<div className="row g-3 mb-3">
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-idelta a-primary"><div className="d-flex align-items-start justify-content-between"><div><p className="scx-label">Applications</p><div className="row1"><h3 className="scx-value">3,654</h3><span className="d up"><i className="ti ti-arrow-up-right"></i>12%</span></div></div><span className="scx-ic"><i className="ti ti-file-description"></i></span></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-idelta a-success"><div className="d-flex align-items-start justify-content-between"><div><p className="scx-label">Revenue</p><div className="row1"><h3 className="scx-value">$482K</h3><span className="d up"><i className="ti ti-arrow-up-right"></i>6%</span></div></div><span className="scx-ic"><i className="ti ti-cash"></i></span></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-idelta a-danger"><div className="d-flex align-items-start justify-content-between"><div><p className="scx-label">Dropouts</p><div className="row1"><h3 className="scx-value">1.2%</h3><span className="d down"><i className="ti ti-arrow-down-right"></i>0.3%</span></div></div><span className="scx-ic"><i className="ti ti-user-x"></i></span></div></div></div>
					<div className="col-xl-3 col-md-6 d-flex"><div className="scx scx-idelta a-info"><div className="d-flex align-items-start justify-content-between"><div><p className="scx-label">Attendance</p><div className="row1"><h3 className="scx-value">93.7%</h3><span className="d up"><i className="ti ti-arrow-up-right"></i>1.1%</span></div></div><span className="scx-ic"><i className="ti ti-calendar-check"></i></span></div></div></div>
				</div>
.
			</div>
		</div>
		
  </>
);

export default StatusCardsShowcase;
