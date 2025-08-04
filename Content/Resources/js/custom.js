/*Light Dark Theme Toggle */
document.addEventListener("DOMContentLoaded", function () {
		function swapTheme(theme) {
			document.body.classList.remove("light", "dark");
			document.body.classList.add(theme);
		}

		let theme = localStorage.getItem("colorTheme") || "light";
		swapTheme(theme);

		const lightBtn = document.getElementById("light-btn");
		const darkBtn = document.getElementById("dark-btn");

		function updateActiveButton(theme) {
			if (theme === "light") {
				lightBtn.classList.add("active");
				darkBtn.classList.remove("active");
			} else {
				darkBtn.classList.add("active");
				lightBtn.classList.remove("active");
			}
		}

		updateActiveButton(theme);

		lightBtn.addEventListener("click", function () {
				swapTheme("light");
				localStorage.setItem("colorTheme", "light");
				updateActiveButton("light");
			});

		darkBtn.addEventListener("click", function () {
				swapTheme("dark");
				localStorage.setItem("colorTheme", "dark");
				updateActiveButton("dark");
			});
	});

/*Left Toc Parent and Selected Child Highlighting Dynamically */
window.addEventListener("load", function () {
		const tryExpandSelected = setInterval(() => {
			const sidenavWrapper = document.querySelector("nav.sidenav-wrapper");
		if (!sidenavWrapper) return;

		const sidenavRoot = sidenavWrapper.querySelector(".off-canvas-accordion.vertical.menu.sidenav");
		const selected = sidenavWrapper.querySelector(".tree-node-selected");

		if (!sidenavRoot || !selected) return;

		let currentLi = selected.closest("li");
		let parentLiWithAnchor = null;
		let clickedAny = false;

		while (currentLi && !sidenavRoot.isSameNode(currentLi)) {
			const parentUl = currentLi.parentElement;
			const parentLi = parentUl.closest("li");
			const isTopLevel = parentUl === sidenavRoot && !parentLiWithAnchor;
			const a = currentLi.querySelector(":scope > a");

			if (a && !isTopLevel) {
				a.classList.add("active-parent");

				const subMenu = a.nextElementSibling;
				const ariaExpanded = a.getAttribute("aria-expanded");

				// Prevent triggering navigation
				const href = a.getAttribute("href");
				const isInternalToggle = href === "#" || href === "" || href === null;

				if (subMenu && !subMenu.classList.contains("is-active")) {
					// Directly activate submenu
					subMenu.classList.add("is-active");
					a.setAttribute("aria-expanded", "true");
					clickedAny = true;
				} else if (!subMenu && isInternalToggle) {
					// Fallback if menu is dynamically loaded
					a.setAttribute("aria-expanded", "true");
					clickedAny = true;
				}
			}

			if (isTopLevel) {
				parentLiWithAnchor = currentLi;
			}

			currentLi = parentLi;
		}

		// Add class to top-level anchor
		if (parentLiWithAnchor) {
			const topAnchor = parentLiWithAnchor.querySelector(":scope > a");
			if (topAnchor) {
				topAnchor.classList.add("parentSelect");
			}
		}

		// Stop polling if submenu is visible or nothing more to click
		const submenuVisible = sidenavWrapper.querySelector("ul.is-accordion-submenu.nested.is-active");
		if (submenuVisible || !clickedAny) {
			clearInterval(tryExpandSelected);
		}
	}, 300);
});

document.addEventListener("DOMContentLoaded", function () {
		const mainTOC = document.querySelector(
			"ul.nocontent.menu._Skins_TopicMenuProxy.mc-component"
			);

		if (mainTOC) {
			const topLevelUL = mainTOC.querySelector("ul"); // first nested UL
			const allListItems = mainTOC.querySelectorAll("li");

			allListItems.forEach((li) => {
				const nestedUL = li.querySelector("ul");

			if (nestedUL && nestedUL !== topLevelUL) {
			nestedUL.classList.add("customTocItem");
		}

		const thumbnails = document.querySelectorAll(
			".MCPopupThumbnail.img.imgthumbnail"
			);

		thumbnails.forEach((el) => {
			el.setAttribute(
			"style",
			"mc-thumbnail-max-height: auto; mc-thumbnail-max-width: 310px;"
			);
	});
});





				// Now that all .customTocItem classes are set, target their parent <a>
const customTocLists = mainTOC.querySelectorAll("ul.customTocItem");

customTocLists.forEach((ul) => {
	const parentLi = ul.closest("li");
const anchor = parentLi ? parentLi.querySelector(":scope > a") : null;

if (anchor) {
	anchor.classList.add("tocHasChildren");
}
});
	}

const nextDiv = document.querySelector('div[aria-label="Navigate next"]');
if (nextDiv) {
	const nextPara = document.createElement("p");
	nextPara.textContent = "Next";
	nextDiv.insertAdjacentElement("afterend", nextPara);
}

	// Insert <p>Previous</p> after the div with aria-label="Navigate previous"
const prevDiv = document.querySelector('div[aria-label="Navigate previous"]');
if (prevDiv) {
	const prevPara = document.createElement("p");
	prevPara.textContent = "Previous";
	prevDiv.insertAdjacentElement("afterend", prevPara);
}
});

/* Removing right TOC if there is Single head */

document.addEventListener("DOMContentLoaded", function () {
		const tocWrapper = document.querySelector(".customProxy");

		if (tocWrapper) {
			const tocList = tocWrapper.querySelector("ul");

			if (tocList) {
				const liItems = tocList.querySelectorAll(":scope > li"); // only top-level <li>s

				// Check for exactly one <li>
				if (liItems.length === 1) {
					const singleLi = liItems[0];
					const anchorTags = singleLi.querySelectorAll("a");

					// Check if that one <li> contains only one <a>
					if (anchorTags.length === 1) {
						tocWrapper.remove();
					}
				}
			}
		}
	});

/*Custom Header with Links */
document.addEventListener("DOMContentLoaded", function () {
		var navbarHTML = `
			<ul class="custom-header-nav">
			<li><a href = " https://technicalreleasefeed.automox.com/ " target = "_blank" > Technical Release Feed </a></li>
			<li><a href = "https://developer.automox.com" target = "_blank" > Developer Portal </a></li>
			<li><a href = "https://www.automox.com/" target = "_blank" > Go to Automox.com </a></li>
			</ul>
			`;
		var navigationWrapper = document.querySelector(".navigation-wrapper");
		if (navigationWrapper) {
			navigationWrapper.insertAdjacentHTML("afterend", navbarHTML);
		}
	});

/*scroll backtotop*/
document.addEventListener("DOMContentLoaded", function () {

		const myButton = document.getElementById("myBtn");
		if (!myButton) {
		
			return;
		}

		function initializeScrollBehavior(scrollTarget, targetName) {

			myButton.addEventListener("click", function () {
					scrollTarget.scrollTo({ top: 0, behavior: "smooth" });
					window.scrollTo({ top: 0, behavior: "smooth" });
				});

			function toggleButtonVisibility() {
				const containerScrolled =
					scrollTarget.scrollTop > 20 || window.pageYOffset > 20;

				myButton.style.display = containerScrolled ? "block" : "none";
			}

			scrollTarget.addEventListener("scroll", toggleButtonVisibility);
			window.addEventListener("scroll", toggleButtonVisibility);
			toggleButtonVisibility();
		}

		let scrollTarget = document.querySelector(".main-wrapper");
		if (scrollTarget) {
			initializeScrollBehavior(scrollTarget, ".main-wrapper");
		} else {

			const observer = new MutationObserver(() => {
				const found = document.querySelector(".main-wrapper");
			if (found) {
				observer.disconnect();
				initializeScrollBehavior(found, ".main-wrapper (late)");
			}
			});

		observer.observe(document.body, { childList: true, subtree: true });
	}
	});


	





/* pagination search */
document.addEventListener("DOMContentLoaded", function () {
		const prev = document.querySelector("#pagination a.previousPage");
		const next = document.querySelector("#pagination a.nextPage");

		if (prev) prev.textContent = "";
		if (next) next.textContent = "";
	});

/*Left TOC */

/*Removing unnecessary <br> tags for all articles */
document.addEventListener("DOMContentLoaded", function () {
		const targetClasses = ["info", "prereqs", "warning", "tip"];

		targetClasses.forEach((cls) => {
			document.querySelectorAll(`div.${cls}`).forEach((el) => {
			// Remove <br> immediately before
			let prev = el.previousSibling;
		while (prev && prev.nodeType === 3 && !prev.textContent.trim()) {
			prev = prev.previousSibling;
		}
		if (prev && prev.nodeName === "BR") {
			prev.remove();
		}

		// Remove <br> immediately after
		let next = el.nextSibling;
		while (next && next.nodeType === 3 && !next.textContent.trim()) {
			next = next.nextSibling;
		}
		if (next && next.nodeName === "BR") {
			next.remove();
		}
		});
});
	});

/* POPUP OVERLAY on image popups*/

window.addEventListener("load", () => {
	(function () {
const popupObserver = new MutationObserver(() => {
	const popup = document.querySelector(".MCPopupContainer");
const existingOverlay = document.querySelector(".MCPopupOverlay");

if (popup && !existingOverlay) {
	const overlay = document.createElement("div");
	overlay.className = "MCPopupOverlay";

	// Insert overlay before the popup
	popup.parentNode.insertBefore(overlay, popup);

	// Optional: remove both on overlay click
	overlay.addEventListener("click", () => {
		popup.remove();
	overlay.remove();
	});
	}
	});

popupObserver.observe(document.body, { childList: true, subtree: true });
})();
	});

/* published on text inserted */

/*document.addEventListener("DOMContentLoaded", function () {
		const dateSpans = document.querySelectorAll("span.last-commit-date");
  
		dateSpans.forEach(function (span) {
				// Create a new text node
				const label = document.createTextNode("Published on: ");
    
				// Insert it before the date text
				span.insertBefore(label, span.firstChild);
			});
	});*/


	/* Render published content Conditionally */

document.addEventListener("DOMContentLoaded", function () {
		// Extract the last updated date from the HTML comment
		const match = document.documentElement.innerHTML.match(/<!--\s*last-updated-badge:\s*(.*?)\s*-->/);

		if (match && match[1]) {
			const badgeDate = match[1]; // e.g., "04 August, 2025"

			// Create the badge wrapper
			const badge = document.createElement("p");
			badge.className = "badge-wrapper";
			badge.style.display = "block";
			badge.innerHTML = `<label class="badgeNew" > New </label> <span class="last-commit-date">Publish on: ${badgeDate}</span>`;

			// Find the first H1 and insert the badge after it
			const h1 = document.querySelector("h1");
			if (h1 && h1.parentNode) {
				h1.parentNode.insertBefore(badge, h1.nextSibling);
			}
		}
	});




		/* Render published content Conditionally */
	
	
	


	
	window.addEventListener('DOMContentLoaded', function () {
		const bodyContainer = document.querySelector('.body-container');
		const footer = document.querySelector('.footer.center');

		if (!bodyContainer || !footer) return;

		// Step 1: Create a new wrapper div
		const wrapper = document.createElement('div');
		wrapper.className = 'main-wrapper';

		// Step 2: Insert the wrapper before body-container
		bodyContainer.parentNode.insertBefore(wrapper, bodyContainer);

		// Step 3: Move body-container into the wrapper
		wrapper.appendChild(bodyContainer);

		// Step 4: Move footer into the wrapper, after body-container
		wrapper.appendChild(footer);
	});


	// Change Snippet Copy text to "Copied"
document.addEventListener('DOMContentLoaded', function () {
		const copyButtons = document.querySelectorAll('.codeSnippetCopyButton');

		copyButtons.forEach(button => {
			button.addEventListener('click', function () {
				const originalText = button.textContent;

				// Change text to "Copied"
				button.textContent = 'Copied';

				// Optional: Add fade effect (CSS handles it below)
				button.classList.add('copied');

				// Revert back after 2 seconds
				setTimeout(() => {
					button.textContent = originalText;
				button.classList.remove('copied');
			}, 2000);
	});
});
	});


	// Wrapping table in DIV FOR fIX HEADER


document.addEventListener("DOMContentLoaded", function () {
		const tables = document.querySelectorAll("table.TableStyle-ax_tables");

		tables.forEach((table) => {
			// Skip if already wrapped
			if (table.closest(".table-wrapper")) return;

		// Create inner scroll container
		const scrollContainer = document.createElement("div");
		scrollContainer.className = "table-scroll-container";

		// Create outer wrapper
		const outerWrapper = document.createElement("div");
		outerWrapper.className = "table-wrapper";

		// Insert outer wrapper before the table
		table.parentNode.insertBefore(outerWrapper, table);

		// Move the table into the scroll container
		scrollContainer.appendChild(table);

		// Move the scroll container into the outer wrapper
		outerWrapper.appendChild(scrollContainer);

		console.log("Wrapped table in .table-scroll-container and .table-wrapper");
	});
});




document.addEventListener("DOMContentLoaded", function () {
		const paragraphs = document.querySelectorAll("p");

		paragraphs.forEach(function (p) {
				const content = p.innerHTML.replace(/&nbsp;/g, '').replace(/\s/g, '');
				if (content === '') {
					p.remove();
				}
			});
	});



/* Table to top */
document.addEventListener("DOMContentLoaded", function () {
		const wrappers = document.querySelectorAll(".table-wrapper");

		wrappers.forEach((wrapper) => {
			const scrollContainer = wrapper.querySelector(".table-scroll-container");

		if (!scrollContainer || wrapper.querySelector(".table-scroll-top-btn")) return;

		// Only show button if the content overflows
		if (scrollContainer.scrollHeight <= scrollContainer.clientHeight) return;

		const btn = document.createElement("button");
		btn.className = "table-scroll-top-btn";
		btn.innerText = "↑ Top";

		// Style the button
		Object.assign(btn.style, {
			position: "absolute",
			bottom: "50%",
			right: "10px",
			zIndex: "10",
			padding: "6px 10px",
			fontSize: "12px",
			backgroundColor: "#009cc8",
			color: "#fff",
			border: "none",
			borderRadius: "4px",
			cursor: "pointer",
			display: "none", // Hidden initially
			boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
			borderTopRightRadius: "0px",   
		borderBottomRightRadius: "0px",
			});

		// Append the button inside .table-wrapper
		wrapper.style.position = "relative"; // Ensure positioning context
		wrapper.appendChild(btn);

		// Toggle button visibility based on scroll
		scrollContainer.addEventListener("scroll", () => {
			btn.style.display = scrollContainer.scrollTop > 50 ? "block" : "none";
	});

    // Scroll to top when clicked
btn.addEventListener("click", () => {
	scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
});
	});
	});