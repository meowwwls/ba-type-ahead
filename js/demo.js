const students = [
  { name: 'Lena Faure', url: 'https://students.bovacademy.com/'},
  { name: 'Melissa Miller', url: 'https://students.bovacademy.com/'},
  { name: 'Rochell Langam', url: 'https://students.bovacademy.com/'}
];

var articles = [
  {
    title: 'Always Be Closure(ing)',
    url: 'https://blog.bovacademy.com/',
  },
  {
    title: 'Getting Closer to an Inclusive Web',
    url: 'https://blog.bovacademy.com/'
  },
  {
    title: 'Git Clone Explained',
    url: 'https://blog.bovacademy.com/'
  },
  {
    title: 'Looking closer at closures',
    url: 'https://blog.bovacademy.com/'
  },
  {
    title: 'Margin Mysteries Explained',
    url: 'https://blog.bovacademy.com/'
  }
];

function typeAhead(data, options) {
  // helper functions
  function getKeyCode(e) {
    const keyCode = e.key || e.which || e.keyCode;
    return keyCode;

  }

  const input = document.getElementById('search-field');
  const results = document.getElementById('search-results');

  // flag used for whether or not to hide the results when body is clicked or esc is pressed
  let resultsShown = false;
  form = document.querySelector('form');


  function findMatch(input) {
    const escaped = input.replace(/\./g, '\\.');
    const regex = new RegExp(escaped, 'gi');
    const matches = [];

    if (input.trim()) {
      // go through each object in the array with our data
      data.forEach(obj => {
        // store the array and properties to search from the current option / object for ease access
        const { array, props } = obj;

        // for each item in the object's array (e.g., for each article)
        array.forEach(item => {

          // test the item's properties against the input (e.g., test each article's title)
          props.forEach(prop => {

            // make sure the property exists
            if (item.hasOwnProperty(prop)) {
              const matched = item[prop].match(regex);

              if (matched) {
                matches.push(
                  {
                    icon: obj.icon || null,
                    textToRender: item[prop],
                    url: item.url || '',
                  });
              }
            }
          });
        });
      });

    }

    return matches;
  }

  function wrapMatch(iconType, str, input) {
    const escaped = input.replace(/\./g, '\\.');
    const regex = new RegExp(escaped, 'gi');

    let wrappedMatch = iconType ? `<i class="search__icon suggestion__icon material-icons" aria-hidden="true">${iconType}</i>` : '';

    wrappedMatch += str.replace(regex, match => `<span class="suggestion__highlight">${match}</span>`);

    return wrappedMatch;
  }

  // moreClass is optional; only passed when the LI to be created is for the "see more" item
  function createMatchLI(url, wrappedMatch, moreClass = '') {
    return `
      <li class="search__suggestion ${moreClass}">
        <a href="${url}" tabindex="-1">${wrappedMatch}</a>
      </li>`;
  }

  function appendMatches(input, matches, el, limit) {
    el.innerHTML = '';
    const matchesToAppend = limit ? matches.slice(0, limit) : matches;
    let html = '';

    matchesToAppend.forEach((match) => {
      const wrappedMatch = wrapMatch(match.icon, match.textToRender, input);
      html += createMatchLI(match.url, wrappedMatch);
    });

    // if there are more results than those being displayed
    if (matchesToAppend.length < matches.length) {
      let wrappedMatch = wrapMatch('', 'See more results', '');
      wrappedMatch += `<i class="search__icon suggestion__icon material-icons" aria-hidden="true">arrow_forward</i>`;
      html += createMatchLI('#?', wrappedMatch, 'search__suggestion--more');
    }

    el.innerHTML = html;
  }

  function handleMatches(e) {
    const trimmedInput = e.target.value.trim().toLowerCase();
    const matches = findMatch(trimmedInput);

    if (results.classList.contains('js-is-hidden')) {
      results.classList.remove('js-is-hidden');
    }

    if (matches.length) {
      appendMatches(trimmedInput, matches, results, (typeof options === 'object' && options.limit));
      resultsShown = true;
    } else {
      closeList();
    }

  }

  // when the input is focused and the down arrow is pressed, send focus to the list of matches
  function focusList() {
    const hasResults = results && results.children;

    // focus the first link in the first list item if there are matches
    if (hasResults.length) {
      hasResults[0].firstElementChild.focus();
    }
  }

  function handleResultFocus(e) {
    const keyCode = getKeyCode(e);

    if (keyCode === 'ArrowDown' || keyCode === 40) {

      if (e.target === results.lastElementChild.firstElementChild) {
        input.focus();
      } else {
        e.target.parentNode.nextElementSibling.firstElementChild.focus();
      }

    } else if (keyCode === 'ArrowUp' || keyCode === 38) {

      if (e.target === results.firstElementChild.firstElementChild) {
        input.focus();
      } else {
        e.target.parentNode.previousElementSibling.firstElementChild.focus();
      }
    } else if (keyCode === 'Enter' && e.target.parentNode.classList.contains('search__suggestion--more')) {
      e.preventDefault();
      form.submit();
    }

  }

  function closeList() {
    results.classList.add('js-is-hidden');
    resultsShown = false;
  }

  input.addEventListener('keyup', function(e) {
    const keyCode = getKeyCode(e);

    if (keyCode === 'ArrowDown' || keyCode === 40) {
      focusList();
    } else if ((keyCode !== 'ArrowLeft' && keyCode !== 37) && (keyCode !== 'ArrowRight' && keyCode !== 39)) {
      handleMatches(e);
    }

  }, false);

  // will allow results to be displayed if a user has previously closed them and then refocused the field
  input.addEventListener('focus', handleMatches, false);

  // handle up and down key events when the results list is in focus
  results.addEventListener('keyup', handleResultFocus, false);

  // handle esc key event to hide results if shown
  document.body.addEventListener('keyup', function(e) {
    const keyCode = getKeyCode(e);
    if ((keyCode === 'Escape' || keyCode === 27) && resultsShown) {
      closeList();
    }

  }, false);

  document.body.addEventListener('click', function(e) {
    // if the results are displayed and somewhere outside of the form area is clicked, hide the results
    if (resultsShown && e.target !== input && e.target.parentNode.parentNode !== results) {
      closeList();
    }
    // if "see more results" is clicked, submit the search form
    else if (e.target.parentNode.classList.contains('search__suggestion--more')) {
      e.preventDefault();
      form.submit();
    }
  }, false);
}

typeAhead(
  [
    {
      array: students,
      props: ['name'],
      icon: 'person'
    },
    {
      array: articles,
      props: ['title'],
      icon: 'subject'
    }
  ],
  {
    limit: 6
  }
);
