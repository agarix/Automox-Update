document.addEventListener('DOMContentLoaded', function() {
		const tabs = document.querySelectorAll('ul.tabs li');
		const tabContents = document.querySelectorAll('.tab-content');

		tabs.forEach(tab => {
			tab.addEventListener('click', function() {
				const tabId = this.getAttribute('data-tab');

				tabs.forEach(tab => tab.classList.remove('current'));
				tabContents.forEach(content => content.classList.remove('current'));

				this.classList.add('current');
				document.getElementById(tabId).classList.add('current');
			});
	});
});


