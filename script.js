
const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("task-list");


// Array to hold tasks
let tasks = [];
let search_tasks = [];
loadTasksFromLocalStorage();

// Function to render tasks
function renderTasks(tasks) {
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
        const taskCard = document.createElement("div");
        taskCard.classList.add("task-card");
        taskCard.innerHTML = `
            <div>
                <h3>${task.title}</h3>
                <p>${task.description}</p>
                <p>${task.dueDate}</p> 
                <p>${task.category}</p>
                <button class="complete-btn">Complete</button>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn"><svg xmlns="http://www.w3.org/2000/svg" id="del-btn-svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16" >
                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
              </svg></button>
            </div>
            
        `;
        const completeButton = taskCard.querySelector(".complete-btn");
        completeButton.addEventListener("click", () => {
            markTaskAsCompleted(index);
        });
        const del = taskCard.querySelector(".delete-btn");
        del.addEventListener("click", () => {
            deleteTask(index);
        });
        const edit = taskCard.querySelector(".edit-btn");
        edit.addEventListener("click", () => {
            editTask(index);
        });
        if (task.completed) {
            taskCard.style.backgroundColor = "lightgreen";
        }
        taskList.appendChild(taskCard);
    });
}

// Function to add a new task
function addTask(title, dueDate, category, description) {
    const task = { title, dueDate, category, description, completed: false };
    tasks.push(task);
    console.log("Added task:", task);
    renderTasks(tasks);
}

function taskdisp() {
    taskForm.innerHTML = "";
    const form = document.createElement("div");
    form.classList.add("add-task");
    form.innerHTML = `
        <div onclick="task_disp('add-task')">
            <span>&#735;</span> 
        </div>

        <form action="" method="post">
            <label for="">Task Name</label>
            <input type="text" name="title" value="">
            <label for="">Description</label>
            <input type="text" name="desp" value="">
            <label for="">Due Date</label>
            <input type="date" name="dueDate" value="">
            <label for="">Category</label>
            <select name="category" id="" >
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Shopping">Shopping</option>
                <option value="Miscellaneous">Miscellaneous</option>
            </select>
            <input type="submit" name="Save" id="" value="Save">
        </form>
    
    `;
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const title = event.target.elements.title.value;
        const dueDate = event.target.elements.dueDate.value;
        const category = event.target.elements.category.value;
        const description = event.target.elements.desp.value;
        //title and duedate validation
        if (!date_validation(dueDate)) {
            event.target.elements.dueDate.style.border = "1px solid red";
            return false;
        };
        if (!title_validation(title)) {
            event.target.elements.title.style.border = "1px solid red";
            return false;
        }

        addTask(title, dueDate, category, description);
        form.style.display = "none";
        event.target.reset();
        saveTasksToLocalStorage();
    });
    taskForm.appendChild(form);
}
function task_disp(v) {
    document.getElementsByClassName(v)[0].style.display = "none";
}

//validations
function date_validation(inp_date) {
    const d = new Date();
    date = d.getFullYear() + "-";
    if (d.getMonth() + 1 < 10) { date = date + '0' + (d.getMonth() + 1) } else {
        date = date + (d.getMonth());
    };
    if (d.getDate() + 1 < 10) { date = date + '-0' + (d.getDate() + 1) } else {
        date = date + '-' + (d.getDate());
    };

    if (inp_date == "" || inp_date < date) {
        return false;
    } else {
        return true;
    }
}

function title_validation(t) {
    if (t == "") {
        return false;
    } else return true;
}

//updating status
function markTaskAsCompleted(task) {
    if(tasks[task].completed == true){
        tasks[task].completed = false;
    }else{
        tasks[task].completed = true;
    }
    saveTasksToLocalStorage();
    renderTasks(tasks);
}

//deleting task
function deleteTask(task) {
    tasks.splice(task, 1);
    saveTasksToLocalStorage();
    renderTasks(tasks);
}

//editing task
function editTask(tsk) {
    const task = tasks[tsk];
    taskForm.innerHTML = "";
    const editForm = document.createElement("div");
    editForm.classList.add("edit-form");
    editForm.innerHTML = `
        <div onclick="task_disp('edit-form')">
            <span>&#735;</span> 
        </div>

        <form action="" method="post">
            <label for="">Task Name</label>
            <input type="text" id="edit-title" name="title" value="${task.title}">
            <label for="">Description</label>
            <input type="text" id="edit-description" name="desp" value="${task.description}">
            <label for="">Due Date</label>
            <input type="date" id="edit-date" name="dueDate" value="${task.dueDate}">
            <label for="">Category</label>
            <select name="category" id="" >
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Shopping">Shopping</option>
                <option value="Miscellaneous">Miscellaneous</option>
            </select>
            <button class="update-btn">Update</button>
        </form>
    
        
    `;
    taskForm.appendChild(editForm);
    editForm.style.display = "block";
    const updateButton = editForm.querySelector('.update-btn');
    updateButton.addEventListener("click", (event) => {
        event.preventDefault();
        const updatedTitle = editForm.querySelector("#edit-title").value;
        const updatedDescription = editForm.querySelector("#edit-description").value;
        const updatedDate = editForm.querySelector('#edit-date').value;
        if (!date_validation(updatedDate)) {
            console.log('ud', updatedDate);
            editForm.querySelector('#edit-date').style.border = "1px solid red";
            return false;
        }
        if (!title_validation(updatedTitle)) {
            editForm.querySelector('#edit-title').style.border = "1px solid red";
            return false;
        }


        if (updatedTitle !== task.title || updatedDescription !== task.description || updatedDate !== task.dueDate) {
            task.title = updatedTitle;
            task.description = updatedDescription;
            task.dueDate = updatedDate;
            saveTasksToLocalStorage();
            renderTasks(tasks);
        }

        editForm.style.display = "none";
    });

}

// tasks in local storage
function saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
    const local = JSON.parse(localStorage.getItem('tasks'));
    if (local) {
        tasks = local;
        renderTasks(tasks);
    }
}

//searching tasks
function search() {
    search_tasks = [];
    let sc = document.getElementById("search").value;
    let search_val = sc.toUpperCase();
    for (t_id = 0; t_id < tasks.length; t_id++) {
        let tsk = tasks[t_id].title.toUpperCase();
        if (tsk.indexOf(search_val) >= 0) {
            search_tasks.push(tasks[t_id]);
        }
    }
    renderTasks(search_tasks);
}

//filters
let sort_tsk=tasks;
function sort(){
    sort_tsk=tasks;
    for (t_id = 0; t_id < tasks.length-1; t_id++){
        let tsk1=tasks[t_id].dueDate;
        for (t_id1 = t_id+1; t_id1 < tasks.length; t_id1++){
            let tsk2=tasks[t_id1].dueDate;
            if(tsk2<tsk1){
                let temp=tasks[t_id1];
                tasks[t_id1]=tasks[t_id];
                tasks[t_id]=temp;
            }
        }
    }
    renderTasks(sort_tsk);
}

function categorySearch(v){
    sort_tsk=[];
    for (t_id = 0; t_id < tasks.length; t_id++){
        let tsk1=tasks[t_id].category;
        if(tsk1==v){
            sort_tsk.push(tasks[t_id]);
        }
    }
    renderTasks(sort_tsk);
}

function statusSearch(v){
    sort_tsk=[];
    console.log(v);
    for (t_id = 0; t_id < tasks.length; t_id++){
        let tsk=tasks[t_id].completed;
        if(v=="true"){
            if(tsk){
                sort_tsk.push(tasks[t_id]);
            }
        }
        if(v=="false"){
            if(!tsk){
                sort_tsk.push(tasks[t_id]);
            } 
        }
        
    }
    console.log(sort_tsk);
    renderTasks(sort_tsk);
}

// Initial render
renderTasks(tasks);
