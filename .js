@ -1,182 +0,0 @@
const subjects = {
    'Java Script': { time: '09:00 AM - 10:30 AM', code: 'BCA617A' },
    'Web technology with HTML and CSS': { time: '10:45 AM - 12:15 PM', code: 'BCA619A' },
    'Analysis and Design of Algorithms': { time: '01:00 PM - 02:30 PM', code: 'BCA621A' },
    'Advance DBMS': { time: '02:45 PM - 04:15 PM', code: 'BCA630A' },
    'Career Building': { time: '09:00 AM - 10:30 AM', code: 'BCA625A' }
};

const students = [
    { id: 1, name: 'Kartik Singh', rollNo: '24BCAN0560' },
    { id: 2, name: 'Palak Soni', rollNo: '24BCAN0556' },
    { id: 3, name: 'Doulat Singh', rollNo: '24BCAN05433' },
    { id: 4, name: 'Ananya Singh', rollNo: '24BCAN0987' },
    { id: 5, name: 'Rohan Verma', rollNo: '24BCAN9854' },
    { id: 6, name: 'Diya Gupta', rollNo: '24BCAN8634' },
    { id: 7, name: 'Kabir Reddy', rollNo: '24BCAN0765' },
    { id: 8, name: 'Ishita Joshi', rollNo: '24BCAN9843' },
    { id: 9, name: 'Vihaan Mehta', rollNo: '24BCAN7653' },
    { id: 10, name: 'Saanvi Agarwal', rollNo: '24BCAN7690' }
];

let attendanceData = {};
let currentAttendance = {};

function initializeSubjects() {
    const select = document.getElementById('subjectSelect');
    Object.keys(subjects).forEach(subject => {
        const option = document.createElement('option');
        option.value = subject;
        option.textContent = `${subject} (${subjects[subject].time})`;
        select.appendChild(option);
    });
}

function setDefaultDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dateInput').value = today;
}

function loadAttendance() {
    const subject = document.getElementById('subjectSelect').value;
    const date = document.getElementById('dateInput').value;

    if (!subject || !date) {
        alert('Please select both subject and date!');
        return;
    }

    const key = `${subject}_${date}`;
    currentAttendance = attendanceData[key] || {};

    renderAttendanceTable(subject);
    updateStats();
}

function renderAttendanceTable(subject) {
    const tableDiv = document.getElementById('attendanceTable');

    if (!subject) {
        tableDiv.innerHTML = '<div class="no-data">Please select a subject to view attendance</div>';
        return;
    }

    let html = `
        <table>
            <thead>
                <tr>
                    <th>Roll No</th>
                    <th>Student Name</th>
                    <th>Subject</th>
                    <th>Timing</th>
                    <th>Status</th>
                    <th>Attendance %</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
    `;

    students.forEach(student => {
        const status = currentAttendance[student.id] || 'Not Marked';
        const percentage = calculateAttendancePercentage(student.id, subject);
        const percentageClass = percentage >= 75 ? 'percentage-high' :
                               percentage >= 50 ? 'percentage-medium' :
                               'percentage-low';

        html += `
            <tr>
                <td>${student.rollNo}</td>
                <td>${student.name}</td>
                <td>${subject} (${subjects[subject].code})</td>
                <td>${subjects[subject].time}</td>
                <td class="${status === 'Present' ? 'status-present' : status === 'Absent' ? 'status-absent' : ''}">
                    ${status}
                </td>
                <td><span class="percentage ${percentageClass}">${percentage.toFixed(1)}%</span></td>
                <td>
                    <button class="attendance-btn btn-present" onclick="markAttendance(${student.id}, 'Present')">Present</button>
                    <button class="attendance-btn btn-absent" onclick="markAttendance(${student.id}, 'Absent')">Absent</button>
                </td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    `;

    tableDiv.innerHTML = html;
}

function markAttendance(studentId, status) {
    currentAttendance[studentId] = status;
    const subject = document.getElementById('subjectSelect').value;
    renderAttendanceTable(subject);
    updateStats();
}

function saveAttendance() {
    const subject = document.getElementById('subjectSelect').value;
    const date = document.getElementById('dateInput').value;

    if (!subject || !date) {
        alert('Please select both subject and date!');
        return;
    }

    if (Object.keys(currentAttendance).length === 0) {
        alert('Please mark attendance for at least one student!');
        return;
    }

    const key = `${subject}_${date}`;
    attendanceData[key] = { ...currentAttendance };

    alert('Attendance saved successfully!');
    updateStats();
}

function calculateAttendancePercentage(studentId, subject) {
    let present = 0;
    let total = 0;

    Object.keys(attendanceData).forEach(key => {
        if (key.startsWith(subject)) {
            total++;
            if (attendanceData[key][studentId] === 'Present') {
                present++;
            }
        }
    });

    return total > 0 ? (present / total) * 100 : 0;
}

function updateStats() {
    const totalStudents = students.length;
    let presentCount = 0;
    let absentCount = 0;

    Object.values(currentAttendance).forEach(status => {
        if (status === 'Present') presentCount++;
        if (status === 'Absent') absentCount++;
    });

    const avgAttendance = totalStudents > 0
        ? (presentCount / totalStudents) * 100
        : 0;

    document.getElementById('totalStudents').textContent = totalStudents;
    document.getElementById('presentCount').textContent = presentCount;
    document.getElementById('absentCount').textContent = absentCount;
    document.getElementById('avgAttendance').textContent = avgAttendance.toFixed(1) + '%';
}

window.onload = () => {
    initializeSubjects();
    setDefaultDate();
    updateStats();
    renderAttendanceTable('');
};
