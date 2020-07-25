createAutoComplete = ({ dropList, renderList, optionSelect, optionTitle, fetchData }) => {

    dropList.innerHTML = `
    <label><b>Search Here</b></label>
    <input class="input"/>
    <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content results"></div>
        </div>
    </div>
    `;

    const inputForm = dropList.querySelector('input');
    const dropdown = dropList.querySelector('.dropdown');
    const wrapperResult = dropList.querySelector('.results');

    const onSearch = async event => {
        const results = await fetchData(event.target.value);

        wrapperResult.innerHTML = '';
        dropdown.classList.add('is-active');
        for (let item of results) {
            const anchor = document.createElement('a');

            anchor.classList.add('dropdown-item');
            anchor.innerHTML = renderList(item);
            anchor.addEventListener('click', () => {
                dropdown.classList.remove('is-active');
                inputForm.value = optionTitle(item);
                optionSelect(item);
            });

            wrapperResult.appendChild(anchor);
        }
    };

    inputForm.addEventListener('input', debounce(onSearch));

    document.addEventListener('click', event => {
        if (!dropList.contains(event.target)) dropdown.classList.remove('is-active');
    });
};