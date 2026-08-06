// ================= THEME =================


const themeBtn = document.getElementById("themeBtn");


if(themeBtn){

  themeBtn.onclick = function(){

    document.body.classList.toggle("light");

    localStorage.setItem(
      "theme",
      document.body.classList.contains("light")
    );

  }

}

if(localStorage.getItem("theme") === "true"){
  document.body.classList.add("light");
}





// ================= SIDEBAR NAVIGATION =================


const menuItems = document.querySelectorAll(".menu li");


menuItems.forEach(function(item){

  item.onclick=function(){

    let target=this.getAttribute("data-target");
    let section=document.getElementById(target);

    if(section){
      section.scrollIntoView({ behavior:"smooth" });
    }

    menuItems.forEach(function(li){ li.classList.remove("active"); });
    this.classList.add("active");

  }

});




// ================= TASK MANAGER =================


const taskInput=document.getElementById("taskInput");
const addTask=document.getElementById("addTask");
const taskList=document.getElementById("taskList");
const allTasksBtn=document.getElementById("allTasks");
const completedTasksBtn=document.getElementById("completedTasks");
const pendingTasksBtn=document.getElementById("pendingTasks");

const tasks=JSON.parse(localStorage.getItem("tasks")) || [];
let taskFilter = "all";

function displayTasks(){
  if(!taskList) return;
  taskList.innerHTML = "";

  tasks.forEach(function(task,index){
    if(taskFilter === "completed" && !task.completed) return;
    if(taskFilter === "pending" && task.completed) return;
    let li=document.createElement("li");

    li.innerHTML = `

<div>
  <span class="${task.completed ? "completed" : ""}">
    ${task.completed ? "✅" : "⭕"}
    ${task.text}
  </span>
  <br>
  <small>
    Priority: ${task.priority} | ${task.date}
  </small>
</div>

<div>
  <button onclick="completeTask(${index})">✔</button>
  <button onclick="deleteTask(${index})">❌</button>
</div>

`;

    taskList.appendChild(li);
  });

  updateDashboard();
  updateProgress();
}

function setTaskFilter(filter){
  taskFilter = filter;
  displayTasks();
  [allTasksBtn, completedTasksBtn, pendingTasksBtn].forEach(function(btn){ if(btn) btn.classList.remove("active"); });
  if(filter === "all" && allTasksBtn) allTasksBtn.classList.add("active");
  if(filter === "completed" && completedTasksBtn) completedTasksBtn.classList.add("active");
  if(filter === "pending" && pendingTasksBtn) pendingTasksBtn.classList.add("active");
}

if(allTasksBtn) allTasksBtn.onclick = function(){ setTaskFilter("all"); };
if(completedTasksBtn) completedTasksBtn.onclick = function(){ setTaskFilter("completed"); };
if(pendingTasksBtn) pendingTasksBtn.onclick = function(){ setTaskFilter("pending"); };



if(addTask){
  addTask.onclick=function(){
    let text = taskInput ? taskInput.value.trim() : "";
    let priorityEl = document.getElementById("taskPriority");
    let dateEl = document.getElementById("taskDate");
    let priority = priorityEl ? priorityEl.value : "";
    let date = dateEl ? dateEl.value : "";

    if(text !== ""){
      tasks.push({ text:text, priority:priority, date:date, completed:false });
      localStorage.setItem("tasks", JSON.stringify(tasks));
      if(taskInput) taskInput.value = "";
      displayTasks();
    }
  }
}

if(taskInput){
  taskInput.addEventListener("keypress", function(e){
    if(e.key === "Enter"){
      if(addTask) addTask.click();
    }
  });
}

function completeTask(index){
  if(typeof tasks[index] === 'undefined') return;
  tasks[index].completed = !tasks[index].completed;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  displayTasks();
}

function deleteTask(index){
  tasks.splice(index,1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  displayTasks();
  updateDashboard();
}


// ================= TIMER =================

let time = 1500;
let timer = null;
const timerDisplay = document.getElementById("timer");

function updateTimer(){
  if(!timerDisplay) return;
  let min = Math.floor(time/60);
  let sec = time % 60;
  if(sec < 10) sec = "0" + sec;
  timerDisplay.innerHTML = min + ":" + sec;
}

const startTimer=document.getElementById("startTimer");
const pauseTimer=document.getElementById("pauseTimer");
const resetTimer=document.getElementById("resetTimer");

if(startTimer){
  startTimer.onclick = function(){
    if(timer) return;
    timer = setInterval(function(){
      if(time > 0){ time--; updateTimer(); }
      else{ clearInterval(timer); timer = null; }
    },1000);
  }
}

if(pauseTimer){
  pauseTimer.onclick = function(){ clearInterval(timer); timer = null; }
}

if(resetTimer){
  resetTimer.onclick = function(){ clearInterval(timer); timer = null; time = 1500; updateTimer(); }
}

updateTimer();


// ================= NOTES =================

const noteInput=document.getElementById("noteInput");
const saveNote=document.getElementById("saveNote");
const notesList=document.getElementById("notesList");
const notes=JSON.parse(localStorage.getItem("notes")) || [];

function displayNotes(){
  if(!notesList) return;
  notesList.innerHTML = "";
  notes.forEach(function(note,index){
    let div=document.createElement("div");
    div.className = "note-card";
    div.innerHTML = `
      <span>${note}</span>
      <button onclick="deleteNote(${index})">❌</button>
    `;
    notesList.appendChild(div);
  });
}

if(saveNote){
  saveNote.onclick = function(){
    let text = noteInput ? noteInput.value.trim() : "";
    if(text !== ""){
      notes.push(text);
      localStorage.setItem("notes", JSON.stringify(notes));
      if(noteInput) noteInput.value = "";
      displayNotes();
    }
  }
}

if(noteInput){
  noteInput.addEventListener("keydown", function(e){ if(e.key === "Enter"){ if(saveNote) saveNote.click(); } });
}

function deleteNote(index){
  notes.splice(index,1);
  localStorage.setItem("notes", JSON.stringify(notes));
  displayNotes();
}

displayNotes();


// ================= EXPENSE TRACKER =================

const expenseName=document.getElementById("expenseName");
const expenseAmount=document.getElementById("expenseAmount");
const addExpense=document.getElementById("addExpense");
const expenseList=document.getElementById("expenseList");
const totalExpense=document.getElementById("totalExpense");

const expenses=JSON.parse(localStorage.getItem("expenses")) || [];
const goals=JSON.parse(localStorage.getItem("goals")) || [];

function showExpenses(){
  if(!expenseList) return;
  expenseList.innerHTML = "";
  let total = 0;
  expenses.forEach(function(exp,index){
    total += Number(exp.amount);
    let div = document.createElement("div");
    div.className = "expense-item";
    div.innerHTML = `
      <span>${exp.name} - ₹${exp.amount}</span>
      <button onclick="deleteExpense(${index})">❌</button>
    `;
    expenseList.appendChild(div);
  });
  if(totalExpense) totalExpense.innerHTML = total;
  updateDashboard();
}

if(addExpense){
  addExpense.onclick = function(){
    if(expenseName && expenseAmount && expenseName.value && expenseAmount.value){
      expenses.push({ name: expenseName.value, amount: expenseAmount.value });
      localStorage.setItem("expenses", JSON.stringify(expenses));
      expenseName.value = ""; expenseAmount.value = "";
      showExpenses();
    }
  }
}

function deleteExpense(index){
  expenses.splice(index,1);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  showExpenses();
}

showExpenses();

// ================= GOALS =================

const goalInput=document.getElementById("goalInput");
const goalDate=document.getElementById("goalDate");
const addGoal=document.getElementById("addGoal");
const goalList=document.getElementById("goalList");

function showGoals(){
  if(!goalList) return;
  goalList.innerHTML = "";
  goals.forEach(function(goal,index){
    let div = document.createElement("div");
    div.className = "goal-card";
    div.innerHTML = `
      <span>🎯 ${goal.text}<br>📅 ${goal.date}</span>
      <button onclick="deleteGoal(${index})">❌</button>
    `;
    goalList.appendChild(div);
  });
  updateDashboard();
}

if(addGoal){
  addGoal.onclick = function(){
    let text = goalInput ? goalInput.value.trim() : "";
    if(text !== ""){
      goals.push({ text:text, date: goalDate ? goalDate.value : "" });
      localStorage.setItem("goals", JSON.stringify(goals));
      if(goalInput) goalInput.value = ""; if(goalDate) goalDate.value = "";
      showGoals();
    }
  }
}

function deleteGoal(index){
  goals.splice(index,1);
  localStorage.setItem("goals", JSON.stringify(goals));
  showGoals();
}

showGoals();


// ================= STUDY TRACKER =================

const subjectInput=document.getElementById("subjectInput");
const studyHours=document.getElementById("studyHours");
const addStudy=document.getElementById("addStudy");
const studyList=document.getElementById("studyList");

const studies=JSON.parse(localStorage.getItem("studies")) || [];

function showStudy(){
  if(!studyList) return;
  studyList.innerHTML = "";
  studies.forEach(function(study,index){
    let div=document.createElement("div");
    div.className = "study-card";
    div.innerHTML = `
      <span>📚 ${study.subject} - ⏱ ${study.hours} Hours</span>
      <button onclick="deleteStudy(${index})">❌</button>
    `;
    studyList.appendChild(div);
  });
  let total = 0; studies.forEach(function(s){ total += Number(s.hours); });
  let studyCount = document.getElementById("studyCount");
  if(studyCount) studyCount.innerHTML = total;
}

if(addStudy){
  addStudy.onclick = function(){
    if(subjectInput && studyHours && subjectInput.value && studyHours.value){
      studies.push({ subject: subjectInput.value, hours: studyHours.value });
      localStorage.setItem("studies", JSON.stringify(studies));
      subjectInput.value = ""; studyHours.value = "";
      showStudy();
    }
  }
}

function deleteStudy(index){
  studies.splice(index,1);
  localStorage.setItem("studies", JSON.stringify(studies));
  showStudy();
}

showStudy();


// ================= PRODUCTIVITY =================

function updateProgress(){
  const progressBar=document.getElementById("progressBar");
  const progressText=document.getElementById("progressText");
  let completed = 0;
  tasks.forEach(function(task){ if(task.completed) completed++; });
  let percent = 0;
  if(tasks.length > 0) percent = Math.round((completed/tasks.length)*100);
  if(progressBar) progressBar.style.width = percent + "%";
  if(progressText) progressText.innerHTML = percent + "% Complete";
  let completedCount=document.getElementById("completedCount");
  if(completedCount) completedCount.innerHTML = completed;
}


// ================= DASHBOARD =================

function updateDashboard(){
  let taskCount=document.getElementById("taskCount");
  let goalCount=document.getElementById("goalCount");
  let expenseCount=document.getElementById("expenseCount");

  if(taskCount) taskCount.innerHTML = tasks.length;
  if(goalCount) goalCount.innerHTML = goals.length;
  if(expenseCount){ let total = 0; expenses.forEach(function(e){ total += Number(e.amount); }); expenseCount.innerHTML = total; }
  updateProgress();
}

updateDashboard();


// ================= PROFILE SETTINGS =================

const userName=document.getElementById("userName");
const userRole=document.getElementById("userRole");
const saveProfile=document.getElementById("saveProfile");
const profileName=document.getElementById("profileName");
const profileRole=document.getElementById("profileRole");

if(localStorage.getItem("userName") && profileName){ profileName.innerHTML = localStorage.getItem("userName"); }
if(localStorage.getItem("userRole") && profileRole){ profileRole.innerHTML = localStorage.getItem("userRole"); }

if(saveProfile){
  saveProfile.onclick = function(){
    if(userName && userName.value){ localStorage.setItem("userName", userName.value); if(profileName) profileName.innerHTML = userName.value; }
    if(userRole && userRole.value){ localStorage.setItem("userRole", userRole.value); if(profileRole) profileRole.innerHTML = userRole.value; }
    if(userName) userName.value = "";
    if(userRole) userRole.value = "";
  }
}

// INITIAL LOAD
setTaskFilter("all");
