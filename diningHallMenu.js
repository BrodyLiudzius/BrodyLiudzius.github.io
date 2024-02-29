////////////////////////////////////////////////////////////////////////////////
// This script displays dining hall menu information for all three dining halls
// at California State University, Long Beach. It is designed to be far more
// readable and intuitive than the current school-provided web page.
//
// Copyright © Brody Liudzius 2023 MIT License
////////////////////////////////////////////////////////////////////////////////

// Dining hall menu cycles are posted at:
// https://www.csulb.edu/49er-shops-at-the-beach/residential-dining-menu-cycles


// #toDo:
// - after dinner is finished, show the next day's menu (and maybe a note that today is over)
// - allow seeing the next day (just add a next day or previous day that increments to date object)
// - add allergen identifiers at the end


// The menu array is indexed as [cycleNumber(0-4)][dayOfWeek(0-6)][mealName(string)][diningHall(string)]
fetch('assets/data/menu.json').then(response => {
	return response.json();
 }).then(menu => {
	const currentDate = new Date();
	const menuCycleEpoch = new Date("01/23/2023");

	// Quick dirty fix to account for spring break. Also appears on daysSinceSemesterEpoch declaration line
	const springBreak = new Date("3/27/2023");
	const springBreakAdjust = (currentDate.getTime() > springBreak.getTime()) ? 1 : 0;

	// Get the time elapsed since Monday 23 January, 2023
	const millisSinceSemesterEpoch = currentDate.getTime() - menuCycleEpoch.getTime();
	const daysSinceSemesterEpoch = millisSinceSemesterEpoch / 1000 / 3600 / 24 - 7*springBreakAdjust;
	const weeksSinceSemesterEpoch = Math.floor(daysSinceSemesterEpoch / 7);

	console.log(springBreakAdjust);

	// cycle numbers are indexed from 0 to 4 unlike school web page
	const cycleNumbers = [
		(weeksSinceSemesterEpoch + 0) % 5,
		(weeksSinceSemesterEpoch + 1) % 5,
		(weeksSinceSemesterEpoch + 2) % 5
	];

	// Gets the day of week as an integer [0-6] ripe for array indexing
	const dayOfWeek = Math.floor(daysSinceSemesterEpoch - weeksSinceSemesterEpoch * 7);

	const diningHalls = ["Parkside", "Hillside", "Beachside"];
	const meals = dayOfWeek > 4 ? ["Brunch", "Dinner"] : ["Breakfast", "Lunch", "Dinner"];
	const times = dayOfWeek > 4 ? [" [ 9:30 – 13:30 ]", " [ 16:00 – 19:30 ]"] : [" [ 7:00 – 10:00 ]", " [ 11:00 – 14:30 ]", " [ 16:00 – 20:30 ]"];
	
	let dateSection = document.createElement("section");
	let h1Date = document.createElement("h1");
	h1Date.innerHTML = "Menus for " + currentDate.toLocaleString(navigator.language, {dateStyle: "full"}) + ":";
	dateSection.append(h1Date);

	let sections = [];

	for (const meal in meals) {
		let section = document.createElement("section")

		let h1 = document.createElement("h1")
		h1.innerHTML = meals[meal] + times[meal];

		let table = document.createElement("table");
		let tr1 = table.insertRow()
		let tr2 = table.insertRow()
		for (const hall in diningHalls) {
			if (menu[cycleNumbers[hall]][dayOfWeek][meals[meal]][diningHalls[hall]] == undefined)
				continue;
			let name = tr1.insertCell();
			let header = document.createElement("strong");
			header.innerHTML = diningHalls[hall];
			name.append(header);

			let td = tr2.insertCell();
			menuItems = menu[cycleNumbers[hall]][dayOfWeek][meals[meal]][diningHalls[hall]];
			ul = document.createElement("ul");
			for (const item in menuItems) {
				li = document.createElement("li");
				li.innerHTML = menuItems[item];
				ul.append(li);
			}
			td.append(ul);
		}

		section.append(h1);
		section.append(table);
		sections.push(section);
	}
	let article = document.getElementsByTagName("article")[0];
	for (const section in sections) {
		dateSection.append(sections[section])
	}
	article.append(dateSection);
 }).catch(err => {
	let article = document.getElementsByTagName("article")[0];
	let section = document.createElement("section");
	let h1 = document.createElement("h1");
	h1.innerHTML = "An Error Ocurred."
	section.append(h1);
	article.append(section);
	console.log(err);
 });