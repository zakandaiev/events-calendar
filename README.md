# Events Calendar
Simple events calendar for Web made with HTML, CSS, JavaScript

## Usage
1. Plug the calendar's assets to your project from:
	* `/dist/index.css`
	* `/dist/index.js`
2. Create an div with `calendar` class in your HTML code
```sh
<div class="calendar"></div>
```
3. Create a new class of the calendar in your JavaScript code
```sh
const events = [
  { date: '2023-06-20', name: 'Some event', description: 'Some event short description' },
  { date: new Date(), name: 'Today event', description: 'Today event short description' }
];

const options = {};

new Calendar(
	document.querySelector('.calendar'),
	events,
	options
);
```

## Options
* TODO...

## Live demo
[https://zakandaiev.github.io/events-calendar](https://zakandaiev.github.io/events-calendar)
