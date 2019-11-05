import { LocalDate } from 'js-joda'

var d = LocalDate.parse("2012-12-24")
  .atStartOfDay()
  .plusMonths(2)

console.log('test date:', d)

// global parameters
const today = LocalDate.now()
console.log('today:', today._month)

const startWeekOnMonday = true // if false: week start on Sunday (untested)
const initial_week = getWeekNo(startOfWeek(today))

// room array: names of room dwellers ordered by room number
const roommates = [
  'Paulina and Maui',
  'Alessio',
  'Karen',
  'Deborah',
  'Daniel',
  'Gabriel'
]

const wc_upstairs = [
  'Karen',
  'Deborah',
  'Alessio'
]

const wc_downstairs = [
  'Daniel',
  'Gabriel'
]


// Tasks table
// ===========
// name: index of table
// short: short description
// long: detailled explanation of the task
// period: number of weeks between task repetition. if < 1, task is still
//         weekly but assigned to a team
// lag: to stagger the tasks and keep in sync with former google cal
const tasks = [
  {
    name: 'garb',
    short: 'Taking out garbages',
    long: '<h4>Regular garbage:</h4><p>When the kitchen\'s regular garbage bin is full (and only when it is full --save on the bags), close the bag and throw it in the grey bin (black-top) on the street (do <span>not</span> just leave the bag outside! cleaning from racoons \'attacks\' will be assigned to the same roommates on charge).</p><h4>Organic garbage</h4><p>Empty the organic garbage bin into the wheeled bin with a green top in the street. Do not wait until the bin is full: empty often, especially in summer. Then wash the bin with the garden hose with sprinkler set on \'jet\'.<p>Make sure the wheeled bins are oriented properly (lid opening facing the street) and properly spaced from any other surrounding objects. Do not overfill: the lid must close.</p></p><h4>Recycling boxes</h4><p>Take the recycling boxes (blue and gray) and all the paper bags down the street. Keep a distance of at least 1 meter away from the wheeled containers. The recycling boxes and bags <strong>must be taken down the night before, or before 7:00am on the date specified at</strong> <a href="http://vancouver.ca/home-property-development/garbage-and-recycling-collection-schedules.aspx"> the Vancouver Collection Schedule Website</a> (you <strong>must</strong> subscribe to it and/or download the app). Read carefully the instructions posted on the walls and sort out if necessary: the city won\'t collect anything that has misclassified items, or if too full or carboards lay outside the bags. (Needless to say, avoid misclassification when it is not your turn!).</p> <p>Two rooms are assigned to this task so to make absolutely sure it\'s done every week.</p>',
    period: 0.5,
    lag: -1
  },
  {
    name: 'kclean',
    short: 'Kitchen cleaning',
    long: '<p>This task consists of cleaning the stove top ceramic with the ceramic cleaner (use only soft scrubber, not metal scrubber), emptying crumbs from the toaster, cleaning the microwave, cleaning the counter-top oven and cleaning the stove oven if it\'s somewhat dirt.</p><p> It\'s a once-a-week duty, so it will repeat every 6 weeks.</p>',
    period: 1,
    lag: 2
  },
  {
    name: 'sweep_ehl',
    short: 'Sweeping entrance, hallway and laundry room',
    long: '<p>This task consists of sweeping the floor and cleaning the mat at the entrance, sweeping the hallway and the laundry room. Also emptying the garbage bins (entrance and laundry) if they\'re almost or full.</p><p>It\'s a once-a-week duty, so it will repeat every 6 weeks.</p>',
    period: 1,
    lag: 1
  },
  {
    name: 'k_sweep',
    short: 'Sweeping kitchen and dining room',
    long: '<p>This task consists of sweeping the kitchen and the dining room, as needed. This means at least twice a week, ideally every day. You can arrange with the room in charge of mopping so to sweep just before mopping.</p>',
    period: 1,
    lag: -1
  },
  {
    name: 'k_wash',
    short: 'Sweeping and mopping kitchen and dining room',
    long: '<p>This task consists of first sweeping the kitchen and the dining room floors and then washing them. Use the spinning mop and a floor soap.</p><p>This is a twice a month task, so you will be assigned to it every 12 weeks.</p>',
    period: 2,
    lag: -5
  },
  {
    name: 'vacuum',
    short: 'Vacuum living room carpet and stairway',
    long: '<p>This task consist of vacuuming the carpet in the living room and stairway. Please use the proper carpet vacuum and make sure the vacuum rolling bruches are on. Empty and clean the vacuum after use.</p><p>It\'s a twice per month task, so you will be assigned to it every 12 weeks..</p>',
    period: 2,
    lag: 13
  }
]

const task_upstairs = [
  {
    name: 'upstairs',
    short: 'Clean the washroom upstairs',
    long: '<p>tbd</p>',
    period: 1,
    lag: 0
  }
]

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
  //
  // var dow = d.dayOfWeek().value()
  // return d.minusDays(( dow === 7 ? 0 : dow ) - startWeekOnMonday)
  var dow = d.dayOfWeek()._ordinal
  // return d.minusDays(dow == 0 ? 6 : dow)
  return d.minusDays(dow)
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
