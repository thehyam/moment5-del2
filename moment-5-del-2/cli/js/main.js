'use strict'

// Variables
let coursesEl = document.getElementById('courses');
let addCourseButton = document.getElementById('addCourseButton');
let updateSection = document.getElementById('updateSection');
let code = document.getElementById('code');
let name = document.getElementById('name');
let prog = document.getElementById('prog');
let plan = document.getElementById('plan');



// Eventlisteners
window.addEventListener('load', getCourses);
addCourseButton.addEventListener('click', addCourse);

function getCourses() {
    coursesEl.innerHTML = '';
    // Call
    fetch('http://studenter.miun.se/~emha1904/Courses_API/api/read.php')
    .then(response => response.json())
    .then(data => {
        data.forEach(course => {
            coursesEl.innerHTML +=
            `<div class="course"><p class="box1">Course Code: ${course.code} </p>
            <p class="box2">Course Name: ${course.course_name} </p>
            <p class="box3"> Progression: ${course.progression} </p>
            <a class="box4" href="${course.course_plan}" target="_blank">Course Plan</a>
            <button id="${course.id}" onClick="deleteCourse(${course.id})">Delete</button>
            <button id="${course.id}" onClick="getOneToUpdate(${course.id})">Update</button></div>`;
        });
    })
}

function deleteCourse(id) {
    fetch('http://studenter.miun.se/~emha1904/Courses_API/api/delete.php?id=' + id, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        getCourses();
    })
    .catch(error => {
        console.log('Error: ', error);
    })
}

function addCourse() {
    code = code.value;
    name = name.value;
    prog = prog.value;
    plan = plan.value;

    let course = {'code' : code, 'course_name' : name, 'progression' : prog, 'course_plan' : plan};

    fetch('http://studenter.miun.se/~emha1904/Courses_API/api/create.php', {
        method: 'POST',
        body: JSON.stringify(course)
    })
    .then(response => response.json())
    .then(data => {
        getCourses();
    })
    .catch(error => {
        console.log('Error: ', error);
    })

}


function getOneToUpdate(id) {
    // Call
    fetch('http://studenter.miun.se/~emha1904/Courses_API/api/read_single.php?id=' + id)
    .then(response => response.json())
    .then(updateSection.style.display = 'block')
    .then(course => {
        updateSection.innerHTML +=
            `<h2>Update Course:</h2>
            <form method="get">
            <label for="code">Course</label>
            <input type="text" name="code" id="newcode" value="${course.code}"> <br>
            <label for="name">Course Name</label>
            <input type="text" name="name" id="newname" value="${course.course_name}"> <br>
            <label for="prog">Progression</label>
            <input type="text" name="prog" id="newprog" value="${course.progression}"> <br>
            <label for="plan">Course Plan</label>
            <input type="text" name="plan" id="newplan" value="${course.course_plan}"> <br>
            <input type="submit" id="updateButton" onClick="updateCourse(${course.id})" value="Update"> <br>      
            <input type="submit" id="closeButton" onClick="closeDiv()" value="Cancel">
            </form>`     
    })
}


function updateCourse(id) {
    
    let newcode = document.getElementById('newcode');
    let newname = document.getElementById('newname');
    let newprog = document.getElementById('newprog');
    let newplan = document.getElementById('newplan');

    newcode = newcode.value;
    newname = newname.value;
    newprog = newprog.value;
    newplan = newplan.value;

    let course = {'id': id, 'code' : newcode, 'course_name' : newname, 'progression' : newprog, 'course_plan' : newplan};

    fetch('http://studenter.miun.se/~emha1904/Courses_API/api/update.php?id=' + id, {
        method: 'PUT',
        body: JSON.stringify(course)
    })
    .then(response => response.json())
    .then(data => {
        getCourses();
    })
    .catch(error => {
        console.log('Error: ', error);
    })

}

        