class Calendar {
	constructor(node, events, options = {}) {
		// OPTIONS DATA
		this.offsets = options.offsets || this.#getDefault('offsets');
		this.labels = options.labels || this.#getDefault('labels');
		this.icons = options.icons || this.#getDefault('icons');
		this.events = this.#formatEvents(events);

		// OPTIONS CALLBACKS
		this.onInit = options.onInit;
		this.onRender = options.onRender;
		this.onUpdate = options.onUpdate;
		this.onPrev = options.onPrev;
		this.onNext = options.onNext;
		this.onCurrent = options.onCurrent;
		this.onDayOpen = options.onDayOpen;
		this.onDayClose = options.onDayClose;
		this.onCellClick = options.onCellClick;
		this.onEventClick = options.onEventClick;
		this.onEventView = options.onEventView;
		this.onEventEdit = options.onEventEdit;
		this.onEventDelete = options.onEventDelete;
		this.onCreateButtonClick = options.onCreateButtonClick;
		this.onCreateDayButtonClick = options.onCreateDayButtonClick;

		// NODES
		this.node = node;
		this.nodeDay = null;
		this.nodeBody = null;
		this.nodeTools = null;
		this.nodeToolsCreate = null;
		this.nodeNav = null;
		this.nodeNavPrev = null;
		this.nodeNavNext = null;
		this.nodeNavCurrent = null;
		this.nodeTable = null;
		this.nodeCells = [];

		// HELPERS
		this.year = null;
		this.month = null;
		this.date = null;
		this.startDate = null;
		this.today = null;
		this.activeCell = null;

		// INIT
		if (this.node) {
			this.#setDate(options.date);

			this.#init();
			this.#initListeners();

			if (this.onInit) {
				this.onInit(this.node);
			}

			this.#render();

			if (this.onRender) {
				this.onRender(this.node);
			}
		}
	}

	// PROTECTED METHODS
	#init() {
		this.node.className = '';
		this.node.classList.add('calendar');

		this.nodeDay = document.createElement('div');
		this.nodeDay.classList.add('calendar__day');

		this.nodeBody = document.createElement('div');
		this.nodeBody.classList.add('calendar__body');

		this.nodeTools = document.createElement('div');
		this.nodeTools.classList.add('calendar__tools');

		this.nodeNav = document.createElement('nav');
		this.nodeNav.classList.add('calendar__nav');

		this.nodeNavPrev = document.createElement('button');
		this.nodeNavPrev.setAttribute('type', 'button');
		this.nodeNavPrev.classList.add('calendar__nav-item', 'calendar__prev');
		this.nodeNavPrev.innerHTML = this.icons.chevron_left;

		this.nodeNavCurrent = document.createElement('button');
		this.nodeNavCurrent.setAttribute('type', 'button');
		this.nodeNavCurrent.classList.add('calendar__nav-item', 'calendar__nav-item_text', 'calendar__current');

		this.nodeNavNext = document.createElement('button');
		this.nodeNavNext.setAttribute('type', 'button');
		this.nodeNavNext.classList.add('calendar__nav-item', 'calendar__next');
		this.nodeNavNext.innerHTML = this.icons.chevron_right;

		this.nodeNav.appendChild(this.nodeNavPrev);
		this.nodeNav.appendChild(this.nodeNavCurrent);
		this.nodeNav.appendChild(this.nodeNavNext);

		this.nodeToolsCreate = document.createElement('button');
		this.nodeToolsCreate.setAttribute('type', 'button');
		this.nodeToolsCreate.classList.add('calendar__button');
		this.nodeToolsCreate.innerHTML = this.icons.plus + '<span>' + this.labels.create + '</span>';
		if (this.onCreateButtonClick) {
			this.nodeToolsCreate.addEventListener('click', event => {
				event.preventDefault();
				this.onCreateButtonClick(event);
			});
		}

		this.nodeTools.appendChild(this.nodeNav);
		this.nodeTools.appendChild(this.nodeToolsCreate);

		this.nodeBody.appendChild(this.nodeTools);

		this.nodeTable = document.createElement('div');
		this.nodeTable.classList.add('calendar__table');

		this.nodeBody.appendChild(this.nodeTable);

		this.node.appendChild(this.nodeDay);
		this.node.appendChild(this.nodeBody);
	}

	#initListeners() {
		this.nodeNavPrev.addEventListener('click', event => {
			event.preventDefault();
			this.renderPrev();
		});
		this.nodeNavNext.addEventListener('click', event => {
			event.preventDefault();
			this.renderNext();
		});
		this.nodeNavCurrent.addEventListener('click', event => {
			event.preventDefault();
			this.renderCustomDate();
		});

		document.addEventListener('click', event => {
			document.querySelectorAll('.calendar__day-item-more').forEach(dd => {
				dd.classList.remove('active');
			});

			const dropdown = event.target.closest('.calendar__day-item-more');
			const dropdown_item = event.target.closest('.calendar__day-menu');

			if(!dropdown) {
				return false;
			}

			event.preventDefault();

			if(dropdown_item) {
				dropdown.classList.add('active');
			}

			dropdown.classList.toggle('active');
		});
	}

	#render(isUpdate = false) {
		this.nodeCells = [];

		const tableRows = [];

		const tableHeader = document.createElement('div');
		tableHeader.classList.add('calendar__row');

		for (let i = 0; i < 7; i++) {
			const headerItem = document.createElement('div');
			headerItem.classList.add('calendar__cell', 'calendar__cell_head');
			headerItem.textContent = this.labels.weekday[i];

			tableHeader.appendChild(headerItem);
		}

		tableRows.push(tableHeader);

		for (let i = 1; i < this.#getWeekCount(this.year, this.month); i++) {
			const tableRow = document.createElement('div');
			tableRow.classList.add('calendar__row');

			if (this.#getWeekday(this.date) > 0) {
				this.date.setDate(this.date.getDate() - this.#getWeekday(this.date));
			}

			for (let i = 0; i < 7; i++) {
				tableRow.appendChild(this.#getCell(this.date));
				this.date.setDate(this.date.getDate() + 1);
			}

			tableRows.push(tableRow);
		}

		this.nodeTable.replaceChildren(...tableRows);

		this.date = new Date(this.year, this.month);

		this.#updateTools();

		this.nodeDay.style.height = this.nodeBody.offsetHeight + 'px';

		if (isUpdate && this.onUpdate) {
			this.onUpdate(this.node);
		}
	}

	#getCell(date) {
		date = new Date(date.valueOf())

		const cell = document.createElement('div');
		cell.classList.add('calendar__cell');

		if (this.#isToday(date)) cell.classList.add('current');
		if (date.getMonth() != this.startDate.getMonth()) cell.classList.add('muted');

		cell.date = date;
		cell.events = this.events.filter(e => this.#isDatesEqual(date, e.date)) || [];

		const cellDate = document.createElement('div');
		cellDate.classList.add('calendar__date');
		cellDate.textContent = date.getDate();

		cell.replaceChildren(...[cellDate, this.#getCellEvents(cell.events)]);

		cell.addEventListener('click', event => {
			event.preventDefault();

			this.nodeCells.forEach(c => c.classList.remove('active'));
			cell.classList.add('active');

			if (this.onCellClick) {
				this.onCellClick(cell);
			}

			this.activeCell = date.getTime();
			this.#renderDay(cell);
		});

		if (this.activeCell && date.getTime() == this.activeCell) {
			cell.classList.add('active');
		}

		this.nodeCells.push(cell);

		return cell;
	}

	#getCellEvents(events) {
		let outputed = 0, isDotsOutputed = false;

		const eventsNode = document.createElement('div');
		eventsNode.classList.add('calendar__events');

		events.forEach(event => {
			const eventNode = document.createElement('div');
			eventNode.classList.add('calendar__event');

			if (outputed >= 2 && !isDotsOutputed && events.length > 3) {
				eventNode.classList.add('calendar__event_more');
				eventNode.textContent = '...';

				eventsNode.appendChild(eventNode);

				isDotsOutputed = true;
			}

			if (isDotsOutputed) {
				return false;
			}

			eventNode.textContent = event.name;

			if (this.onEventClick) {
				eventNode.addEventListener('click', e => {
					e.preventDefault();
					this.onEventClick(event, e);
				});
			}

			eventsNode.appendChild(eventNode);

			outputed++;
		});

		return eventsNode;
	}

	#renderDay(cell) {
		const dayDate = cell.date;
		const dayEvents = cell.events;

		const dayHeader = document.createElement('div');
		dayHeader.classList.add('calendar__day-header');

		const dayHeaderTitle = document.createElement('span');
		dayHeaderTitle.textContent =
			this.labels.weekday[this.#getWeekday(dayDate)]
			+ ' '
			+ dayDate.getDate()
			+ ', '
			+ this.labels.month[dayDate.getMonth()]
			+ ' '
			+ dayDate.getFullYear();

		const dayHeaderClose = document.createElement('button');
		dayHeaderClose.setAttribute('type', 'button');
		dayHeaderClose.classList.add('calendar__day-close');
		dayHeaderClose.addEventListener('click', event => {
			event.preventDefault();
			this.activeCell = null;
			this.nodeCells.forEach(c => c.classList.remove('active'));
			cell.classList.remove('active');
			this.node.classList.remove('active');
			if (this.onDayClose) {
				this.onDayClose(this.nodeDay);
			}
		});

		dayHeader.appendChild(dayHeaderTitle);
		dayHeader.appendChild(dayHeaderClose);

		const dayBody = document.createElement('div');
		dayBody.classList.add('calendar__day-body');

		dayBody.replaceChildren(...this.#getDayEvents(dayEvents));

		const dayFooter = document.createElement('div');
		dayFooter.classList.add('calendar__day-footer');

		const dayFooterCreate = document.createElement('button');
		dayFooterCreate.setAttribute('type', 'button');
		dayFooterCreate.classList.add('calendar__button');
		dayFooterCreate.innerHTML = this.icons.plus + '<span>' + this.labels.create + '</span>';
		if (this.onCreateDayButtonClick) {
			dayFooterCreate.addEventListener('click', event => {
				event.preventDefault();
				this.onCreateDayButtonClick(cell.date, event);
			});
		}

		dayFooter.appendChild(dayFooterCreate);

		const dayNodes = [dayHeader, dayBody];
		if (cell.date.getTime() > this.today.getTime() - this.offsets.create) {
			dayNodes.push(dayFooter);
		}
		this.nodeDay.replaceChildren(...dayNodes);

		this.node.classList.add('active');

		if (this.onDayOpen) {
			this.onDayOpen(this.nodeDay);
		}
	}

	#getDayEvents(events) {
		const dayEvents = [];

		events.forEach(event => {
			const event_date = new Date(event.date);
			const time = ((event_date.getHours() < 10) ? '0' : '') + event_date.getHours() + ':' + ((event_date.getMinutes() < 10) ? '0' : '') + event_date.getMinutes();

			const nodeEvent = document.createElement('div');
			nodeEvent.classList.add('calendar__day-item');

			const nodeEventTime = document.createElement('time');
			nodeEventTime.textContent = time;

			const nodeEventData = document.createElement('div');
			nodeEventData.classList.add('calendar__day-item-data');

			const nodeEventDataTitle = document.createElement('div');
			nodeEventDataTitle.classList.add('calendar__day-item-title');
			nodeEventDataTitle.textContent = event.name;

			const nodeEventDataDescription = document.createElement('div');
			nodeEventDataDescription.classList.add('calendar__day-item-description');
			nodeEventDataDescription.textContent = event.description;

			nodeEventData.appendChild(nodeEventDataTitle);
			nodeEventData.appendChild(nodeEventDataDescription);

			nodeEvent.appendChild(nodeEventTime);
			nodeEvent.appendChild(nodeEventData);

			const nodeMenu = this.#getDayEventMenu(event);
			if (nodeMenu) {
				nodeEvent.appendChild(nodeMenu);
			}

			dayEvents.push(nodeEvent);
		});

		return dayEvents;
	}

	#getDayEventMenu(event) {
		const nodeMenu = document.createElement('button');
		nodeMenu.setAttribute('type', 'button');
		nodeMenu.classList.add('calendar__day-item-more');
		nodeMenu.innerHTML = '<span></span>';

		const nodeDropdown = document.createElement('div');
		nodeDropdown.classList.add('calendar__day-menu');

		const nodeDropdownView = document.createElement('div');
		nodeDropdownView.classList.add('calendar__day-menu-item');
		nodeDropdownView.innerHTML = this.icons.view + '<span>' + this.labels.view + '</span>';
		if (this.onEventView) {
			nodeDropdownView.addEventListener('click', e => {
				e.preventDefault();
				this.onEventView(event, e);
			});
		}

		const nodeDropdownEdit = document.createElement('div');
		nodeDropdownEdit.classList.add('calendar__day-menu-item');
		nodeDropdownEdit.innerHTML = this.icons.edit + '<span>' + this.labels.edit + '</span>';
		if (this.onEventEdit) {
			nodeDropdownEdit.addEventListener('click', e => {
				e.preventDefault();
				this.onEventEdit(event, e);
			});
		}

		const nodeDropdownDelete = document.createElement('div');
		nodeDropdownDelete.classList.add('calendar__day-menu-item');
		nodeDropdownDelete.innerHTML = this.icons.delete + '<span>' + this.labels.delete + '</span>';
		if (this.onEventDelete) {
			nodeDropdownDelete.addEventListener('click', e => {
				e.preventDefault();
				this.onEventDelete(event, e);
			});
		}

		if (event.showView !== false) {
			nodeDropdown.appendChild(nodeDropdownView);
		}

		const offset_date = new Date();
		offset_date.setMinutes(offset_date.getMinutes() + this.offsets.edit);
		if (new Date(event.date) > offset_date) {
			if (event.showEdit !== false) {
				nodeDropdown.appendChild(nodeDropdownEdit);
			}
			if (event.showDelete !== false) {
				nodeDropdown.appendChild(nodeDropdownDelete);
			}
		}

		nodeMenu.appendChild(nodeDropdown);

		if (nodeDropdown.childElementCount < 1) {
			return null;
		}

		return nodeMenu;
	}

	#updateTools() {
		this.nodeNavCurrent.innerText = this.labels.month[this.month] + ' ' + this.year;
  }

	#formatEvents(events) {
		if (!events || !events.length) {
			return []
		}

		events = events.map(e => {
			return {
				...e,
				date: new Date(e.date)
			};
		});

		function sort(a, b) {
			if (a.date < b.date) {
				return -1;
			}

			if (a.date > b.date) {
				return 1;
			}

			return 0;
		}

		events.sort(sort);

		return events;
  }

  #setDate(date) {
		date = date ? new Date(date) : new Date();

		this.year = date.getFullYear();
		this.month = date.getMonth();
		this.date = new Date(this.year, this.month);
		this.startDate = new Date(this.year, this.month);
		this.today = new Date();
		this.today.setHours(0, 0, 0, 0);
	}

  #isToday(date) {
		return this.#isDatesEqual(new Date(), date);
  }

	#isDatesEqual(d1, d2) {
		return (d1.toDateString() == d2.toDateString());
	}

  #getWeekday(date) {
		let day = date.getDay();
		if(day == 0) day = 7;
		return day - 1;
	}

	#getWeekCount(year, month_number) {
    const firstOfMonth = new Date(year, month_number, 1);
    const lastOfMonth = new Date(year, month_number + 1, 0);

    const used = firstOfMonth.getDay() + 6 + lastOfMonth.getDate();

    return Math.ceil(used / 7);
	}

  #getDefault(type) {
    switch (type.toLowerCase()) {
      case 'offsets': return {
				create: 60,
				edit: 60
			}
      case 'labels': return {
				month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
				weekday: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
				create: 'Create',
				view: 'View',
				edit: 'Edit',
				delete: 'Delete'
			}
      case 'icons': return {
				chevron_left: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 6l-6 6l6 6" /></svg>',
        chevron_right: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 6l6 6l-6 6" /></svg>',
        plus: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 5l0 14" /><path d="M5 12l14 0" /></svg>',
        view: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" /></svg>',
        edit: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 20l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4h4z" /><path d="M13.5 6.5l4 4" /><path d="M16 18h4" /></svg>',
        delete: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>'
			}
    }
	}

	// PUBLIC METHODS
	update() {
		this.#render(true);
		return true;
	}

	renderPrev() {
		this.#setDate(new Date(this.year, this.month - 1));

		if (this.onPrev) {
			this.onPrev(this.node);
		}

		this.#render(true);

		return true;
	}

	renderNext() {
		this.#setDate(new Date(this.year, this.month + 1));

		if (this.onNext) {
			this.onNext(this.node);
		}

		this.#render(true);

		return true;
	}

	renderCustomDate(date) {
		this.#setDate(date);

		if (!date && this.onCurrent) {
			this.onCurrent(this.node);
		}

		this.#render(true);
		return true;
	}

	getEvents() {
		return this.events;
	}

	getEventById(id) {
		return this.events.find(e => e.id == id);
	}

	addEvent(event) {
		if (!event || !event.id || !event.date || !event.name) {
			return false;
		}

		this.events.push(event);
		this.events = this.#formatEvents(this.events);

		this.#render(true);

		return true;
	}

	deleteEvent(id) {
		const event = this.getEventById(id);

		if (!event) {
			return false;
		}

		this.events = this.events.filter(e => e.id != id);

		this.#render(true);

		return true;
	}
}
