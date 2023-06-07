# Events Calendar
Simple events calendar for Web made with HTML, CSS, JavaScript

## Table of Contents
* [Live demo](#live-demo)
* [Usage](#usage)
* [Event object structure](#event-object-structure)
* [Options](#options)
* [Events](#events)
* [Methods](#methods)

## Live demo
[https://zakandaiev.github.io/events-calendar](https://zakandaiev.github.io/events-calendar)

## Usage
1. Plug the calendar's assets to your project from:
	* `/dist/index.css`
	* `/dist/index.js`

2. Create an div in your HTML code:
```sh
<div id="calendar"></div>
```

3. Create a new class of the calendar in your JavaScript code:
```sh
const events = [
	{
		date: new Date(),
		name: 'Today event',
		description: 'Today event short description'
	},
	{
		date: new Date(new Date().getTime() + (24 * 60 * 60 * 1000)),
		name: 'Tomorrow event',
		description: 'Tomorrow event short description'
	}
];

const options = {};

const calendar = new Calendar(
	document.getElementById('calendar'),
	events,
	options
);
```

## Event object structure
```sh
const events = [
	{
		id: 'id', // [required, String, Number] - id, must be unique
		date: '2023-06-20', // [required, String, DateObject] - date, if string then must be in ISO format
		name: 'event name', // [required, String] - name
		description: 'event description', // [String] - short description
		showView: true/false, // [Boolean] - controls whether to show a view option, default: true
		showEdit: true/false, // [Boolean] - controls whether to show a edit option, default: true && event.date > now + options.offsets.edit
		showDelete: true/false // [Boolean] - controls whether to show a delete option, default: true && event.date > now + options.offsets.edit
	}
];

const options = {};

const calendar = new Calendar(
	document.getElementById('calendar'),
	events,
	options
);
```

## Options
* `offsets` - controls wether to show action buttons for events if certain time remain

Default:
```
{
	create: 60, // minutes - if remain less than N minutes to end of the day then create day-button will not appear
	edit: 60 // minutes - if remain less than N minutes to event start then edit and delete buttons will not appear
}
```

Example:
```
new Calendar(
	document.getElementById('calendar'),
	[],
	{
		offsets: {
			create: 120,
			edit: 240
		}
	}
);
```

* `labels` - text labels

Default:
```
{
	month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
	weekday: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
	create: 'Create',
	view: 'View',
	edit: 'Edit',
	delete: 'Delete'
}
```

Example (ukrainian language):
```
new Calendar(
	document.getElementById('calendar'),
	[],
	{
		labels: {
			month: ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'],
			weekday: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'],
			create: 'Створити',
			view: 'Переглянути',
			edit: 'Редагувати',
			delete: 'Видалити'
		}
	}
);
```

* `icons` - only .svg format

Default:
```
{
	chevron_left: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 6l-6 6l6 6" /></svg>',
	chevron_right: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 6l6 6l-6 6" /></svg>',
	plus: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 5l0 14" /><path d="M5 12l14 0" /></svg>',
	view: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" /></svg>',
	edit: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 20l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4h4z" /><path d="M13.5 6.5l4 4" /><path d="M16 18h4" /></svg>',
	delete: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>'
	}
}
```

Example:
```
new Calendar(
	document.getElementById('calendar'),
	[],
	{
		icons: {
			chevron_left: '<svg>...new icon...</svg>',
			chevron_right: '<svg>...new icon...</svg>',
			plus: '<svg>...new icon...</svg>',
			view: '<svg>...new icon...</svg>',
			edit: '<svg>...new icon...</svg>',
			delete: '<svg>...new icon...</svg>'
		}
	}
);
```

## Events

To catch events just pass callback functions in options during initialization the calendar class

```
// example:
new Calendar(
	document.getElementById('calendar'),
	events,
	{
		onInit: (e) => console.log('trigger onInit', e),
		onRender: (e) => console.log('trigger onRender', e),
		onUpdate: (e) => console.log('trigger onUpdate', e),
		onPrev: (e) => console.log('trigger onPrev', e),
		onNext: (e) => console.log('trigger onNext', e),
		onCurrent: (e) => console.log('trigger onCurrent', e),
		onDayOpen: (e) => console.log('trigger onDayOpen', e),
		onDayClose: (e) => console.log('trigger onDayClose', e),
		onCellClick: (e) => console.log('trigger onCellClick', e.date),
		onEventClick: (e, ev) => console.log('trigger onEventClick', e, ev),
		onEventView: (e, ev) => console.log('trigger onEventView', e, ev),
		onEventEdit: (e, ev) => console.log('trigger onEventEdit', e, ev),
		onEventDelete: (e, ev) => console.log('trigger onEventDelete', e, ev),
		onCreateButtonClick: (e) => console.log('trigger onCreateButtonClick', e),
		onCreateDayButtonClick: (e, ev) => console.log('trigger onCreateDayButtonClick', e, ev)
	}
);
```

* `onInit` - calendar initialization
* `onRender` - calendar first render
* `onUpdate` - calendar next re-/ renders
* `onPrev` - previous button clicked
* `onNext` - next button clicked
* `onCurrent` - current month button clicked
* `onDayOpen` - day events appears after date cell clicked
* `onDayClose` - day events disappears
* `onCellClick` - date cell cliked
* `onEventClick` - event clicked
* `onEventView` - event view option clicked
* `onEventEdit` - event edit option clicked
* `onEventDelete` - event delete option clicked
* `onCreateButtonClick` - create button clicked
* `onCreateDayButtonClick` - create button for a specific day clicked

## Methods
* `calendar.update()` - re-render calendar
* `calendar.renderPrev()` - render previous month
* `calendar.renderNext()` - render next month
* `calendar.renderCustomDate('2023-10')` - render custom month, pass string or Date() object
* `calendar.getEvents()` - return events array
* `calendar.getEventById('event_id')` - return event by id
* `calendar.addEvent({ ...see Event object structure section... })` - add new event to calendar
* `calendar.deleteEvent('event_id')` - delete event from calendar by id
