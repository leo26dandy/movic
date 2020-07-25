const debounce = (event, delayTime = 1000) => {
    let timeoutId;
    return (...terms) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => { event.apply(null, terms); }, delayTime);
    };
};