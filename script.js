let courseCount = 1;

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('courses').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            let inputs = Array.from(document.querySelectorAll('.courseName, .courseSKS, .courseGrade'));
            let index = inputs.indexOf(event.target);
            if (index !== -1 && inputs[index].value.trim() !== '') {
                if (index + 1 < inputs.length) {
                    inputs[index + 1].focus();
                } else {
                    addCourse();
                    document.querySelector('.course:last-child .courseName').focus();
                }
                hideErrorMessage(event.target);
            } else {
                showErrorMessage(event.target, "Wajib diisi");
            }
        }
    });

    document.getElementById('courses').addEventListener('input', function(event) {
        if (event.target.value.trim() !== '') {
            hideErrorMessage(event.target);
        }
    });
});

function addCourse() {
    courseCount++;
    const courseDiv = document.createElement('div');
    courseDiv.classList.add('course', 'form-group', 'row', 'align-items-center');
    courseDiv.innerHTML = `
        <span class="courseNumber col-auto text-right pr-2">${courseCount}.</span>
        <input type="text" placeholder="Nama Mata Kuliah" class="courseName form-control col mx-1 ">
        <input type="number" placeholder="SKS" class="courseSKS form-control col mx mx-1">
        <input type="text" placeholder="Nilai" class="courseGrade form-control col mx-1">
        <button type="button" class="removeCourse btn btn-danger col-auto ml-2" onclick="removeCourse(this)">Hapus</button>
        <div class="error text-danger col-12 mt-1"></div>
    `;
    document.getElementById('courses').appendChild(courseDiv);
}

function removeCourse(button) {
    button.parentElement.remove();
    updateCourseNumbers();
}

function updateCourseNumbers() {
    const courses = document.getElementsByClassName('course');
    courseCount = 0;
    for (let course of courses) {
        courseCount++;
        course.querySelector('.courseNumber').innerText = `${courseCount}.`;
    }
}

function calculateGPA() {
    const courses = document.getElementsByClassName('course');
    let totalSKS = 0;
    let totalPoints = 0;
    let allFilled = true;

    Array.from(document.getElementsByClassName('error')).forEach(el => el.innerText = '');

    for (let course of courses) {
        const sksInput = course.querySelector('.courseSKS');
        const gradeInput = course.querySelector('.courseGrade');
        const nameInput = course.querySelector('.courseName');
        const sks = parseFloat(sksInput.value);
        const grade = gradeInput.value.toUpperCase();
        const name = nameInput.value.trim();

        if (name === '' || isNaN(sks) || grade === '') {
            if (name === '') showErrorMessage(nameInput, "Wajib diisi");
            if (isNaN(sks)) showErrorMessage(sksInput, "Wajib diisi");
            if (grade === '') showErrorMessage(gradeInput, "Wajib diisi");
            allFilled = false;
            continue;
        }

        let gradePoint;
        switch (grade) {
            case 'A': gradePoint = 4.0; break;
            case 'A-': gradePoint = 3.75; break;
            case 'B+': gradePoint = 3.5; break;
            case 'B': gradePoint = 3.0; break;
            case 'B-': gradePoint = 2.75; break;
            case 'C+': gradePoint = 2.5; break;
            case 'C': gradePoint = 2.0; break;
            case 'D': gradePoint = 1.0; break;
            case 'E': gradePoint = 0.0; break;
            default: gradePoint = 0.0; break;
        }

        totalSKS += sks;
        totalPoints += gradePoint * sks;
    }

    if (allFilled) {
        const gpa = totalPoints / totalSKS;
        document.getElementById('result').innerText = `IPK Anda: ${gpa.toFixed(2)}`;
    } else {
        document.getElementById('result').innerText = '';
    }
}

function showErrorMessage(input, message) {
    const errorDiv = input.parentNode.querySelector('.error');
    errorDiv.innerText = message;
}

function hideErrorMessage(input) {
    const errorDiv = input.parentNode.querySelector('.error');
    errorDiv.innerText = '';
}
