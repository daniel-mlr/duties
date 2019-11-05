/* nougeau fichier javascript pour roommates */

import { LocalDate } from 'js-joda'
import tasks from './Tasks'
import roommates from './Roommates'
import './main.scss'

// global parameters
const today = LocalDate.now()
// console.log('today:', today._month)

const startWeekOnMonday = true // if false: week start on Sunday (untested)
const initial_week = getWeekNo(startOfWeek(today))

const wc_upstairs = [2, 3, 4]

const wc_downstairs = [5, 6]

const task_downstairs = [
  {
    name: 'downstairs',
    short: 'Clean the washroom downstairs',
    long: '<p>Use abrasive soap to clean the bath, the sink and the toilet bowl. Empty garbage bin. Clean the mirrors with Windex. Wash the floor if needed.</p>',
    period: 1,
    lag: 0
  }
]

// ==============
// functions

function startOfWeek(d) {
  // return LocalDate: beginning of the week of date in argument
  // arg: d: object of class LocalDate
  var dow = d.dayOfWeek()._ordinal
  // return d.minusDays(dow)
  return d.minusDays(dow).minusDays(1 - startWeekOnMonday)
}

function  getWeekNo(d) {
  // return int: week number of date d
  // arg d: obj of class LocalDate.
  let week_no = ( startOfWeek(d).toEpochDay() + 4 - startWeekOnMonday ) / 7
  if (!Number.isInteger(week_no)) {
    alert('An error occured. Please contact me. Daniel')
    throw new Error('getWeekNo(d) must return an integer')
  }
  return week_no
}

function createAssign(week_no) {
  // return a function to be used as callback for mapping tasks array
  return (task) => {
    // return the index of room (based 0) to which a task is assigned
    // or null if that task is not assigned in the corresponding week_no
    const w = week_no + task.lag //- 1 ? Made corrections in tasks table instead
    const team = task.period < 1  // bool, indicating a team task
    const unassigned = ( w % task.period )  && !team  // bool

    return unassigned ? null : w % (task.period * roommates.length) / (team ? 1 : task.period)
  }
}

function formatTaskRow(room, task_ix) {
  // call back for assignments array map.
  // Returns a formatted row of a task and the roommate assigned to it
  // The task long description is appened in a sibling row.

  const room_names = tasks[task_ix].period < 1 ?   // is it a team task?
    '<span>' + roommates[room * 2 ] + ' and ' + roommates[room * 2 + 1] + '</span>' :
    '<span>' + roommates[room] + '</span>'  // if not
  const formatted_row =
    '<div class="row accordeon">' +
      '<div class="tache">' + tasks[task_ix].short + '</div>' +
      '<div class="nom"> ' + room_names + '</div>' +
    '</div>' +
    '<div class="explain">' +  tasks[task_ix].long + '</div>'

  return room == null ? null : formatted_row
}

// generate rows for tasks table, eliminating unassigned tasks for current week
const generateTasksRows = (week) => tasks.map(createAssign(week)).map(formatTaskRow).filter(x => x)

function makeTaskList(wk_no) {
  /**
   * Return a list of assigned tasks with assignee's names and a description
   * of each tasks
   */
  var ret = '<div class="list-container">'
  ret += generateTasksRows(wk_no).reduce((accumulator, current) => accumulator + current)
  ret += '</div>' // end div.list-container
  return ret
}

// closure for keeping track of week no.
const weekCounter = (function () {
  var counter = initial_week
  return {
    increment: () => ++counter,
    decrement: () => --counter,
    reset: () => ( counter = initial_week )
  }
})()

function dateFormatter(d) {
  return d.month()._name + '&nbsp;' + d.dayOfMonth()
}

// =================
// impures functions

function accordeonClickAction() {
  this.classList.toggle('active')
  /* Toggle between hiding and showing the active explain div */
  var explain = this.nextElementSibling
  if (explain.style.display === 'block') {
    explain.style.display = 'none'
  } else {
    explain.style.display = 'block'
  }
}

function addTasksListeners() {
  var acc = document.getElementsByClassName('accordeon')
  for (var i = 0; i < acc.length; i++) {
    acc[i].addEventListener('click', accordeonClickAction)
  }
  // var doc = document.getElementsByClassName('accordeon')
  // doc.addEventListener('click', accordeonClickAction)
}

function refreshTasksTable(week) {
  document.getElementById('tasklist').innerHTML = makeTaskList(week)
  addTasksListeners()
}

function setDateRangeField(week) {
  document.getElementById('start_of_wk').innerHTML = dateFormatter(
    LocalDate.ofEpochDay(week * 7 - 4 + startWeekOnMonday )
  )
  document.getElementById('end_of_wk').innerHTML = dateFormatter(
    LocalDate.ofEpochDay(week * 7 + 2 + startWeekOnMonday )
  )
}

function setVisualWarning(week) {
  let el = document.getElementById('fromto').classList
  if (week < initial_week) {
    el.remove('future')
    el.add('past')
  } else if (week > initial_week) {
    el.remove('past')
    el.add('future')
  } else {
    el.remove('past', 'future')
  }
}

window.onload = function() {
  refreshTasksTable(initial_week)
  setDateRangeField(initial_week)

  document.getElementById('forward').addEventListener('click', () => {
    var wk = weekCounter.increment()
    setDateRangeField(wk)
    refreshTasksTable(wk)
    setVisualWarning(wk)
  })
  document.getElementById('backup').addEventListener('click', () => {
    var wk = weekCounter.decrement()
    setDateRangeField(wk)
    refreshTasksTable(wk)
    setVisualWarning(wk)
  })
  document.getElementById('fromto').addEventListener('click', () => {
    var wk = weekCounter.reset()
    setDateRangeField(wk)
    refreshTasksTable(wk)
    setVisualWarning(wk)
  })
}
