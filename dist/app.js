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
		case "bubble_sort":
			await bubble_sort();
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
 */
function set_as_highlighted(elt) {
	elt.setAttribute("data-highlighted", "true");
}

/**
 * @param {Element} elt
 */
function set_as_unhighlighted(elt) {
	elt.removeAttribute("data-highlighted");
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
        var temp = el1.style.getPropertyValue("--_height");
        el1.style.setProperty("--_height", el2.style.getPropertyValue("--_height"));
        el2.style.setProperty("--_height", temp);
 
        window.requestAnimationFrame(function () {
            // For waiting for .25 sec
            setTimeout(() => {
                resolve();
            }, 200);
		});
	});
}

async function bubble_sort() {
	const bubble_sort_container = document.querySelector("#bubble-sort");

	if (!bubble_sort_container) {
		return;
	}

	const items = bubble_sort_container.querySelectorAll("div[data-child]");
	const array_of_items = Array.from(items);
	
	let did_swap = false;

	for (let idx = 0; idx < array_of_items.length; ++idx) {

		did_swap = false;

		for (let j_idx = 0; j_idx < array_of_items.length - idx - 1; ++j_idx) {
			const elt1 = array_of_items[j_idx];
			const elt2 = array_of_items[j_idx + 1];

			set_as_highlighted(elt1);
			set_as_highlighted(elt2);

			/**
			 * @type {Promise<void>}
			 */
			const promise = new Promise((res) => {
				setTimeout(() => {
					res();
				}, 100);
			});

			await promise;

			const elt1_value = get_item_value(elt1);
			const elt2_value = get_item_value(elt2);

			if (elt1_value > elt2_value) {
				did_swap = true;
				elt1.setAttribute("data-value", elt2_value.toString());
				elt2.setAttribute("data-value", elt1_value.toString());
				// @ts-ignore
				await swap(elt1, elt2);
			}

			set_as_unhighlighted(elt1);
			set_as_unhighlighted(elt2);
		}

		if (!did_swap) {

		}
	}

	for (let idx = 0; idx < array_of_items.length; ++idx) {
		/**
		 * @type {Promise<void>}
		 */
		const promise = new Promise((res) => {
			setTimeout(() => {
				res();
			}, 75);
		});

		set_as_highlighted(array_of_items[idx]);
		await promise;
		set_as_unhighlighted(array_of_items[idx]);
	}


}

window.addEventListener("DOMContentLoaded", () => {
	set_height(document.querySelectorAll("#bubble-sort div[data-child]"));
	set_height(document.querySelectorAll("#merge-sort div[data-child]"));

	/**
	 * @type {NodeListOf<HTMLButtonElement>}
	 */
	const start_btns = document.querySelectorAll("button[data-start]");
	/**
	 * @type {NodeListOf<HTMLButtonElement>}
	 */
	const stop_btns = document.querySelectorAll("button[data-stop]");

	start_btns.forEach((btn) => {
		btn.addEventListener("click", async () => {
			const sorting_container_id = btn.getAttribute("aria-controls");

			const sorting_container = document.querySelector("#" + sorting_container_id);
			
			if (!sorting_container) {
				return;
			}

			if (sorting_container.getAttribute("aria-busy") == "true") {
				return;
			}

			sorting_container.setAttribute("aria-busy", "true");
			await start_sorting(sorting_container.getAttribute("data-sortingtype") ?? "");
			sorting_container.removeAttribute("aria-busy");
		});
	});
});

