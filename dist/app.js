// @ts-check

/**
 * @param {NodeListOf<Element>} items
 */
function set_height(items) {
	if (items.length == 0) {
		return;
	}

	const max = get_max_in_items(items);

	items.forEach((item) => {
		if (!(item instanceof HTMLElement)) {
			return;
		}

		const value = get_item_value(item);
		const height_percentage = Math.floor(value / max * 100);

		item.style.setProperty("--_height", height_percentage + "%");
	});
}

/**
 * @param {string} type
 */
async function start_sorting(type) {
	switch (type) {
		case "bubble-sort":
			await bubble_sort();
			break;
		case "quick-sort":
			await quick_sort();
			break;
		default:
			alert("This sorting type either does not exist or is not yet implemented");
	}
}

/**
 * @param {Element} elt
 */
function get_item_value(elt) {
	return parseInt(elt.getAttribute("data-value") || "1");
}

/**
 * @param {Element} elt
 * @param {string} [color]
 */
function set_as_highlighted(elt, color = "green") {
	elt.setAttribute("data-highlighted", "true");

	if (color && elt instanceof HTMLElement) {
		elt.style.setProperty("--_highlight-color", color);
	}
}

/**
 * @param {Element} elt
 */
function set_as_unhighlighted(elt) {
	elt.removeAttribute("data-highlighted");

	if (elt instanceof HTMLElement) {
		elt.style.removeProperty("--_highlight-color");
	}
}

/**
 * @param {NodeListOf<Element> | Array<Element>} items
 * @returns {number}
 */
function get_max_in_items(items) {
	if (items instanceof Array) {
		return Math.max(...items.map((item) => {
			return get_item_value(item);
		}));
	}

	return Math.max(...[...items.values()].map((item) => {
		return get_item_value(item);
	}));
}

// Promise to swap two blocks
/**
 * @param {HTMLElement} el1
 * @param {HTMLElement} el2
 * @returns {Promise<void>}
 */
function swap(el1, el2) {
    return new Promise((resolve) => {
        // For exchanging styles of two blocks
        const temp = el1.style.getPropertyValue("--_height");
        el1.style.setProperty("--_height", el2.style.getPropertyValue("--_height"));
        el2.style.setProperty("--_height", temp);
		const temp_value = el1.getAttribute("data-value") || "1";
		el1.setAttribute("data-value", el2.getAttribute("data-value") || "1");
		el2.setAttribute("data-value", temp_value);
 
        window.requestAnimationFrame(function () {
            // For waiting for .25 sec
            setTimeout(() => {
                resolve();
            }, 100);
		});
	});
}

async function bubble_sort() {
	const sort_container = document.querySelector("#sorting-graph");

	if (!sort_container) {
		return;
	}

	const items = sort_container.querySelectorAll("div[data-child]");
	const array_of_items = Array.from(items);
	
	let did_swap = false;

	for (let idx = 0; idx < array_of_items.length; ++idx) {
		did_swap = false;

		for (let j_idx = 0; j_idx < array_of_items.length - idx - 1; ++j_idx) {
			const elt1 = array_of_items[j_idx];
			const elt2 = array_of_items[j_idx + 1];

			set_as_highlighted(elt1);
			set_as_highlighted(elt2);

			await wait(250);

			const elt1_value = get_item_value(elt1);
			const elt2_value = get_item_value(elt2);

			if (elt1_value > elt2_value) {
				did_swap = true;
				// @ts-ignore
				await swap(elt1, elt2);
			}

			set_as_unhighlighted(elt1);
			set_as_unhighlighted(elt2);
		}

		if (!did_swap) {
			break;
		}
	}

	for (let idx = 0; idx < array_of_items.length; ++idx) {
		set_as_highlighted(array_of_items[idx]);
		await wait(250);
		set_as_unhighlighted(array_of_items[idx]);
	}
}

/**
 * @param {number} delay
 * @returns {Promise<void>}
 */
function wait(delay) {
	return new Promise((res) => {
		setTimeout(() => {
			res();
		}, delay);
	});
}

/**
 * For quick sorting
 * @param {Array<Element>} arr
 * @param {number} low
 * @param {number} high
 */ 
async function partition(arr, low, high) {
	const pivot = arr[high];
	const pivot_value = get_item_value(pivot);

	set_as_highlighted(pivot, "teal");

	let idx = low - 1;

	for (let i = low; i < high; ++i) {
		const elt1 = arr[i];
		const elt1_value = get_item_value(elt1);
		await wait(100);
	
		set_as_highlighted(elt1);

		if (elt1_value <= pivot_value) {
			idx += 1;
			const elt2 = arr[idx];
			set_as_highlighted(elt2);
			// @ts-ignore
			await swap(elt1, elt2);
			set_as_unhighlighted(elt1);
			set_as_unhighlighted(elt2);
		}
	}

	set_as_unhighlighted(pivot);

	await wait(100);

	idx += 1;
	set_as_highlighted(arr[high]);
	set_as_highlighted(arr[idx]);

	// @ts-ignore
	await swap(arr[high], arr[idx]);

	set_as_unhighlighted(arr[high]);
	set_as_unhighlighted(arr[idx]);

	return idx;
}

/**
 * For quick sorting
 * @param {Array<Element>} arr
 * @param {number} low
 * @param {number} high
 */ 
async function qs(arr, low, high) {
	if (low >= high) {
		return;
	}

	const pivot_idx = await partition(arr, low, high);

	qs(arr, low, pivot_idx - 1);
	qs(arr, pivot_idx + 1, high);
}

async function quick_sort() {
	const sort_container = document.querySelector("#sorting-graph");

	if (!sort_container) {
		return;
	}

	const items = sort_container.querySelectorAll("div[data-child]");
	const array_of_items = Array.from(items);

	await qs(array_of_items, 0, array_of_items.length - 1);
}

/**
 * @param {number} min
 * @param {number} max
 * @returns {number | void}
 */
function range(min, max) {
	if (min >= max) {
		return console.error(new Error("A min value must be < the max value."));
	}

	return Math.floor(
		Math.random() * (max - min + 1)
	) + min;
}

/**
 * @param {number} percentage
 * @param {number} base
 */
function get_rate(percentage, base) {
	return Math.floor(percentage / base * 100);
}

/**
 * @param {Element | null} container
 */
function randomize(container) {
	if (!container || !(container instanceof HTMLElement)) {
		return;
	}

	container.innerHTML = "";

	const amount_of_children = parseInt(container.getAttribute("data-children") || "50");
	const max_value = 100;

	for (let idx = 0; idx < amount_of_children; ++idx) {
		const div = document.createElement("div");
		const value = range(1, max_value);

		if (typeof value != "number") {
			break;
		}

		const height_percentage = get_rate(value, max_value);

		div.setAttribute("data-value", value.toString());
		div.setAttribute("data-child", "");
		div.style.setProperty("--_height", height_percentage + "%");
		container.appendChild(div);
	}
}

window.addEventListener("DOMContentLoaded", () => {
	/**
	 * @type {NodeListOf<HTMLButtonElement>}
	 */
	const randomize_btn = document.querySelectorAll("button[data-randomize]");
	/**
	 * @type {NodeListOf<HTMLButtonElement>}
	 */
	const start_btns = document.querySelectorAll("button[data-start]");
	/**
	 * @type {NodeListOf<HTMLButtonElement>}
	 */
	const stop_btns = document.querySelectorAll("button[data-stop]");

	randomize_btn.forEach((btn) => {
		btn.addEventListener("click", () => {
			const target_id = btn.getAttribute("aria-controls");
			const target = document.querySelector("#" + target_id);

			if (!target) {
				return console.error("You should not be seeing this, but a container the clicked button controls does not exist.");
			}

			if (target.getAttribute("aria-busy") == "true") {
				return console.warn(target + " is currently being sorted.");
			}

			randomize(target);
		});
	});

	start_btns.forEach((btn) => {
		btn.addEventListener("click", async () => {
			const sorting_container_id = btn.getAttribute("aria-controls");
			const sorting_container = document.querySelector("#" + sorting_container_id);
			
			if (!sorting_container) {
				return;
			}

			if (sorting_container.getAttribute("aria-busy") == "true") {
				return console.warn(sorting_container + " is currently being sorted.");
			}

			sorting_container.setAttribute("aria-busy", "true");
			await start_sorting(btn.getAttribute("data-sortingtype") ?? "");
			sorting_container.removeAttribute("aria-busy");
		});
	});
});

