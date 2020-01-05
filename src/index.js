/* duties perpetual calendar for roommates */

import { LocalDate } from 'js-joda'
import tasks from './Tasks'
import roommates from './Roommates'
import './main.scss'

// global parameters
const today = LocalDate.now()
const startWeekOnMonday = true // if false: week start on Sunday (untested)
const initial_week = getWeekNo(startOfWeek(today))

// ==============
// functions

function startOfWeek(d) {
  // return LocalDate: beginning of the week of date in argument
  // arg: d: object of class LocalDate
  var dow = d.dayOfWeek()._ordinal
  return d.minusDays(dow).minusDays(1 - startWeekOnMonday)
}

function  getWeekNo(d) {
  // return int: the week number in which date d lies
  // arg d: obj of class LocalDate.
  let week_no = ( startOfWeek(d).toEpochDay() + 4 - startWeekOnMonday ) / 7
  if (!Number.isInteger(week_no)) {
    alert('An error occured. Please contact me. Daniel')
    throw new Error('getWeekNo(d) must return an integer')
  }
  return week_no
}

function allot(week_no) {
  // return a function that assign tasks to be done in week_no to each roommates
  return (tsks) => tsks.map(tsk => { 
    const w = week_no + tsk.lag  // lag to adjust staggering of rotations
    const unassigned = (w % tsk.period) // task is assigned only when modulo is 0
    // rotate assignment amongst roommates concerned by this task 
    const assigned_to = tsk.concerns[w % (tsk.period * tsk.concerns.length) / tsk.period] 
    // check if assigned to team (array of roommates) or a single roommate
    const rmm = Array.isArray(assigned_to)
    ? roommates[assigned_to[0] -1] + ' and ' + roommates[assigned_to[1] -1]
    : roommates[assigned_to - 1]
    return unassigned ? null : [tsk.short, rmm, tsk.long] 
  })
}

function formatTaskRows(tRow) {
  // callback for assignments array map.
  // Returns a formatted row of a task and the roommate assigned to it
  // The task long description is appened in a sibling row.
  const formatted_row =
    '<div class="row accordeon">' +
      '<div class="tache">' + tRow[0] + '</div>' +
      '<div class="nom"><span>' + tRow[1] + '</span></div>' +
    '</div>' +
    '<div class="explain">' + tRow[2] + '</div>'
  return formatted_row
}

function makeTaskList(wk_no) {
  /**
   * Process a list of assigned tasks with assignee's names and a description
   * of each tasks, then concatenate it and return it in a string
   */
  var ret = '<div class="list-container">'
  ret += allot(wk_no)(tasks)       // allocates tasks for this week
  .filter(x => x)                  // removes non allocated tasks
  .map(formatTaskRows)             // format to html
  .reduce((acc, cur) => acc + cur) // concatenate
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
  // date formatter for the week selection bar
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
}

function refreshTasksTable(week) {
  document.getElementById('tasklist').innerHTML = makeTaskList(week)
  addTasksListeners()
}

function setDateRangeField(week) {
  // week selection bar dates
  document.getElementById('start_of_wk').innerHTML = dateFormatter(
    LocalDate.ofEpochDay(week * 7 - 4 + startWeekOnMonday )
  )
  document.getElementById('end_of_wk').innerHTML = dateFormatter(
    LocalDate.ofEpochDay(week * 7 + 2 + startWeekOnMonday )
  )
}

function setVisualWarning(week) {
  // style week selection bar
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
