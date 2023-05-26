class Calendar {
	constructor(node, options = {}) {
		this.node = node;
		this.offsets = options.offsets || this.getDefault('offsets');
		this.labels = options.labels || this.getDefault('labels');
		this.icons = options.icon || this.getDefault('icons');
		this.events = this.formatEvents(options.events);
		this.year = null;
		this.month = null;
		this.date = null;
		this.today = null;
		this.day = null;
		this.day_date = null;

		this.setDate(options.date || new Date());

		if(this.node) {
			this.render();
		}
  }

  render(is_update = false) {
		let output = '';

		if(!is_update) {
			output += '<div class="calendar__day"></div>';
			output += '<div class="calendar__body">';
			output += this.getTools();
		}

		output += '<div class="calendar__table"><div class="calendar__row">';

		this.labels.weekday.forEach(week => {
			output += `<div class="calendar__cell calendar__cell_head">${week}</div>`;
		});

		output += '</div><div class="calendar__row">';

		const prev_month = this.month - 1;
		const prev_month_count = new Date(this.year, this.month, 0).getDate();
		for (let i = 0; i < this.getWeekday(this.date); i++) {
			output += this.getCell(new Date(this.year, prev_month, prev_month_count - this.getWeekday(this.date) + 1 + i));
		}

		while (this.date.getMonth() == this.month) {
			output += this.getCell(this.date);

			if (this.getWeekday(this.date) % 7 == 6) {
				output += '</div><div class="calendar__row">';
			}

			this.date.setDate(this.date.getDate() + 1);
		}

		this.date.setYear(this.year);
		this.date.setMonth(this.month);

		const next_month = new Date(this.year, this.month + 1);
		if (this.getWeekday(next_month) != 0) {
			for (let i = this.getWeekday(next_month); i < 7; i++) {
				output += this.getCell(next_month);
				next_month.setDate(next_month.getDate() + 1);
			}
		}

		output += '</div></div>';

		if(is_update) {
			this.node.querySelector('.calendar__table').outerHTML = output;
			this.updateTools();
		} else {
			this.node.innerHTML = output;
		}

		if(is_update && this.day) {
			this.renderDay(this.day_date);
		}

		this.node.querySelector('.calendar__day').style.height = this.node.querySelector('.calendar__body').offsetHeight + 'px';
  }

  getCell(date) {
		const class_current = this.isToday(date) ? 'current' : '';
		const class_muted = (date.getMonth() != this.date.getMonth()) ? 'muted' : '';

		return `
			<div class="calendar__cell ${class_current} ${class_muted}" data-date="${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}">
				<div class="calendar__date">${date.getDate()}</div>
				${this.getEvents(date)}
			</div>
		`;
  }

  getEvents(date) {
		let output = '', outputed = 0, is_dots_outputed = false;
		const output_events = [];

		if(this.events && this.events.length > 0) {
			output += '<div class="calendar__events">';

			this.events.forEach(event => {
				if(this.isDatesEqual(date, new Date(event.date))) {
					output_events.push(event);
				}
			});

			output_events.forEach(event => {
				if(outputed >= 2 && !is_dots_outputed && output_events.length > 3) {
					output += `<div class="calendar__event calendar__event_more">...</div>`;
					is_dots_outputed = true;
				}
				if(is_dots_outputed) {
					return false;
				}
				output += `<div class="calendar__event">${event.name}</div>`;
				outputed++;
			});

			output += '</div>';
		}

		return output;
  }

  getTools() {
		return `
			<div class="calendar__tools">
				<nav class="calendar__nav">
					<button type="button" class="calendar__nav-item calendar__prev">
						${this.icons.chevron_left}
					</button>
					<button type="button" class="calendar__nav-item calendar__nav-item_text calendar__current">
						${this.labels.month[this.month]} ${this.year}
					</button>
					<button type="button" class="calendar__nav-item calendar__next">
            ${this.icons.chevron_right}
					</button>
				</nav>
				<button type="button" class="calendar__button">
					${this.icons.plus}
					<span>Створити</span>
				</button>
			</div>
		`;
  }

  renderPrev() {
		this.setDate(new Date(this.year, this.month - 1));
		this.render(true);
	}

	renderNext() {
		this.setDate(new Date(this.year, this.month + 1));
		this.render(true);
	}

	renderCustomMonth(month) {
		this.setDate(new Date(month));
		this.render(true);
	}

	updateTools() {
		this.node.querySelector('.calendar__current').textContent = this.labels.month[this.month] + ' ' + this.year;
  }

  renderDay(date) {
		this.day_date = date;

		this.node.querySelectorAll('.calendar__cell').forEach(cell => {
			if(cell.getAttribute('data-date') == date) {
				cell.classList.add('active');
			} else {
				cell.classList.remove('active');
			}
		});

		date = new Date(date);

		if(!date || !date instanceof Date || isNaN(date)) {
			date = new Date();
		}

		if(!this.day) {
			this.day = this.node.querySelector('.calendar__day');
		}

		if(this.day) {
			let output = '';

			this.events.forEach(event => {
				const event_date = new Date(event.date);

				if (!this.isDatesEqual(date, event_date)) {
					return false;
				}

				const time = ((event_date.getHours() < 10) ? '0' : '') + event_date.getHours() + ':' + ((event_date.getMinutes() < 10) ? '0' : '') + event_date.getMinutes();

				function menu(event, icon, offsets) {
					let menu_output = '<button type="button" class="calendar__day-item-more dropdown">';
					menu_output += '<span></span>';
					menu_output += '<div class="dropdown__menu dropdown__menu_right">';
					menu_output += `
							<div class="dropdown__item">
								${icon.view}
								<span>Переглянути</span>
							</div>
						`;

					const offset_date = new Date();
					offset_date.setMinutes(offset_date.getMinutes() + offsets.edit);
					if(new Date(event.date) > offset_date) {

							menu_output += `
								<div class="dropdown__item">
									${icon.edit}
									<span>Редагувати</span>
								</div>
							`;

						menu_output += `
							<div class="dropdown__item">
								${icon.delete}
								<span>Видалити</span>
							</div>
						`;
					}
					menu_output += '</div>';
					menu_output += '</button>';
					return menu_output;
				}

				output += `
					<div class="calendar__day-item">
						<time>${time}</time>
						<div class="calendar__day-item-data" title="${event.name}">
							<h4 class="calendar__day-item-title">${event.name}</h4>
							<div class="calendar__day-item-description">${event.description}</div>
						</div>
						${menu(event, this.icons, this.offsets)}
					</div>
				`;
			});

			let footer = '';
			if (date.getTime() > this.today.getTime() - 1) {
				footer = `
					<div class="calendar__day-footer">
						<button type="button" class="calendar__button">
							${this.icons.plus}
							<span>Створити на ${date.toLocaleDateString('uk-UA')}</span>
						</button>
					</div>
				`;
			}

			this.day.innerHTML = `
				<h2 class="calendar__day-header">
					<span>
						${this.labels.weekday[this.getWeekday(this.date)]} ${date.getDate()},
						${this.labels.month[date.getMonth()]} ${date.getFullYear()}
					</span>
					<button type="button" class="calendar__day-close"></button>
				</h2>
				<div class="calendar__day-body">
					${output}
				</div>
				${footer}
			`;
			this.node.classList.add('active');
		}
  }

  closeDay() {
		this.day = null;
		this.day_date = null;

		this.node.classList.remove('active');
		this.node.querySelectorAll('.calendar__cell').forEach(cell => {
			cell.classList.remove('active');
		});

		if(this.day) {
			setTimeout(() => {
				this.day.innerHTML = '';
			}, 300);
		}
	}

  setDate(date) {
		if(!date || !date instanceof Date || isNaN(date)) {
			date = new Date();
		}

		this.year = date.getFullYear();
		this.month = date.getMonth();
		this.date = new Date(this.year, this.month);
		this.today = new Date();
		this.today.setHours(0 ,0, 0, 0);
	}

  formatEvents(events = []) {
		function sort(a, b) {
			if(a.date < b.date) {
				return -1;
			}
			if(a.date > b.date) {
				return 1;
			}
			return 0;
		}

		events.sort(sort);

		return events;
  }

  getWeekday(date) {
		let day = date.getDay();
		if(day == 0) day = 7;
		return day - 1;
	}

  isToday(date) {
		return this.isDatesEqual(new Date(), date);
  }

  isDatesEqual(d1, d2) {
		return (d1.toDateString() == d2.toDateString());
	}

  getDefault(type) {
    switch (type.toLowerCase()) {
      case 'offsets': return {
				create: 60,
				edit: 60,
				failed: 30
			}
      case 'labels': return {
				month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
				weekday: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
			}
      case 'icons': return {
				chevron_left: '<svg xmlns="http://www.w3.org/2000/svg" class="chevron-left" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 6l-6 6l6 6" /></svg>',
        chevron_right: '<svg xmlns="http://www.w3.org/2000/svg" class="chevron-right" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 6l6 6l-6 6" /></svg>',
        plus: '<svg xmlns="http://www.w3.org/2000/svg" class="plus" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 5l0 14" /><path d="M5 12l14 0" /></svg>',
        view: '<svg xmlns="http://www.w3.org/2000/svg" class="view" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" /></svg>',
        edit: '<svg xmlns="http://www.w3.org/2000/svg" class="edit" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 20l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4h4z" /><path d="M13.5 6.5l4 4" /><path d="M16 18h4" /></svg>',
        delete: '<svg xmlns="http://www.w3.org/2000/svg" class="delete" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>'
			}
      case 'xxx': return {}
    }
  }
}
