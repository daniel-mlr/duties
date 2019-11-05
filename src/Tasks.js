// Tasks table
// ===========
// name: index of table
// short: short description
// long: detailled explanation of the task
// period: number of weeks between task repetition. if < 1, task is still
//         weekly but assigned to a team
// lag: to stagger the tasks and keep in sync with former google cal

export default [
  {
    name: 'garb',
    short: 'Taking out garbages',
    long: '\
    <h4>Regular garbage:</h4>\
    <p>When the kitchen\'s regular garbage bin is full (and only when it is full --save on the bags), close the bag and throw it in the grey bin (black-top) on the street (do <span>not</span> just leave the bag outside! cleaning from racoons \'attacks\' will be assigned to the same roommates on charge).</p>\
    <h4>Organic garbage</h4>\
    <p>Empty the organic garbage bin into the wheeled bin with a green top in the street. Do not wait until the bin is full: empty often, especially in summer. Then wash the bin with the garden hose with sprinkler set on \'jet\'.<p>Make sure the wheeled bins are oriented properly (lid opening facing the street) and properly spaced from any other surrounding objects. Do not overfill: the lid must close.</p>\
    <h4>Recycling boxes</h4>\
    <p>Take the recycling boxes (blue and gray) and all the paper bags down the street. Keep a distance of at least 1 meter away from the wheeled containers. The recycling boxes and bags <strong>must be taken down the night before, or before 7:00am on the date specified at</strong> <a href="http://vancouver.ca/home-property-development/garbage-and-recycling-collection-schedules.aspx"> the Vancouver Collection Schedule Website</a> (you <strong>must</strong> subscribe to it and/or download the app). Read carefully the instructions posted on the walls and sort out if necessary: the city won\'t collect anything that has misclassified items, or if too full or carboards lay outside the bags. (Needless to say, avoid misclassification when it is not your turn!).\
    </p> <p>Two rooms are assigned to this task so to make absolutely sure it\'s done every week.</p>',
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
