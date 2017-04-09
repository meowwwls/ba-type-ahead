(function typeAheadBADemo() {
  const input = document.getElementById('search-field');
  const results = document.getElementById('search-results');

  // filler data; would pull from JSON
  const students = [
    {
      author: {
        name: 'Lena Faure',
        url: 'https://students.bovacademy.com/'
      },
      articles: [
        {
          title: 'Always Be Closure(ing)',
          url: 'https://blog.bovacademy.com/'
        }
      ]
    },
    {
      author: {
        name: 'Melissa Miller',
        url: 'https://students.bovacademy.com/'
      },
      articles: [
        {
          title: 'Getting Closer to an Inclusive Web',
          url: 'https://blog.bovacademy.com/'
        },
        {
          title: 'Git Clone Explained',
          url: 'https://blog.bovacademy.com/'
        },
      ]
    },
    {
      author: {
        name: 'Rochell Langam',
        url: 'https://students.bovacademy.com/'
      },
      articles: [
        {
          title: 'Looking closer at closures',
          url: 'https://blog.bovacademy.com/'
        },
        {
          title: 'Margin Mysteries Explained',
          url: 'https://blog.bovacademy.com/'
        },
      ]
    },
  ];

  // flag used for whether or not to hide the results when body is clicked or esc is pressed
  let resultsShown = false;

  function findMatch(input, students) {
    const escaped = input.replace(/\./g, '\\.');
    const regex = new RegExp(escaped, 'gi');
    const matches = [];

    if (input.trim()) {

      students.forEach(student => {
        const s = student.author.name.match(regex);

        if (s) {
          matches.push(student.author);
        }

        student.articles.forEach(article => {
          const a = article.title.match(regex);
          if (a) {
            matches.push(article);
          }
        });

      });
    }

    return matches;
  }

  function wrapMatch(type, str, input) {
    const escaped = input.replace(/\./g, '\\.');
    const regex = new RegExp(escaped, 'gi');
    let wrappedMatch = `<svg class="search__icon icon--${type}">
                          <use xlink:href="#icon-${type}"></use>
                        </svg>`;

    wrappedMatch += str.replace(regex, `<span class="suggestion__highlight">${input}</span>`);

    return wrappedMatch;
  }

  function createMatchLI(url, wrappedMatch) {
    // put -1 tabindex on links so user will not have to tab through all results in order to get out of the list
    return `
      <li class="search__suggestion">
        <a href="${url}" tabindex="-1">${wrappedMatch}</a>
      </li>`;
  }

  function appendMatches(input, matches, el) {
    let html = '';
    const authors = [];
    const articles = [];

    matches.forEach(match => {

      if (match.hasOwnProperty('name')) {
        authors.push(match);
      }

      if (match.hasOwnProperty('title')) {
        articles.push(match);
      }
    });

    authors.sort();
    articles.sort();

    authors.forEach(author => {
      const wrappedMatch = wrapMatch('user-circle-o', author.name, input);
      html += createMatchLI(author.url, wrappedMatch);
    });

    articles.forEach(article => {
      const wrappedMatch = wrapMatch('article', article.title, input);
      html += createMatchLI(article.url, wrappedMatch);
    });

    el.innerHTML = html;
  }

  function handleMatches(e) {
    const trimmedInput = e.target.value.trim().toLowerCase();
    const matches = findMatch(trimmedInput, students);

    if (results.classList.contains('js-is-hidden')) {
      results.classList.remove('js-is-hidden');
    }

    if (matches.length) {
      appendMatches(trimmedInput, matches, results);
      resultsShown = true;
    } else {
      closeList();
    }

  }

  // when the input is focused and the down arrow is pressed, send focus to the list of matches
  function focusList() {
    const hasResults = results.children;

    // focus the first link in the first list item if there are matches
    if (hasResults.length) {
      hasResults[0].firstElementChild.focus();
    }
  }

  function handleResultFocus(e) {
    if (e.which === 40) {
      if (e.target === results.lastElementChild.firstElementChild) {
        input.focus();
      } else {
        e.target.parentNode.nextElementSibling.firstElementChild.focus();
      }
    } else if (e.which === 38) {
      if (e.target === results.firstElementChild.firstElementChild) {
        input.focus();
      } else {
        e.target.parentNode.previousElementSibling.firstElementChild.focus();
      }
    }
  }

  function closeList() {
    // input.focus(); // not sure about this; then if someone has tabbed to another region and hits esc, the input will be focused again
    results.classList.add('js-is-hidden');
    resultsShown = false;
  }


  input.addEventListener('keyup', function(e) {
    if (e.which === 40) {
      focusList();
    } else {
      handleMatches(e);
    }
  }, false);

  // will allow results to be displayed if a user has previously closed them and then refocused the field
  input.addEventListener('focus', handleMatches, false);

  // handle up and down key events when the results list is in focus
  results.addEventListener('keyup', handleResultFocus, false);

  // handle esc key event to hide results if shown
  document.body.addEventListener('keyup', function(e) {
    if (e.which === 27 && resultsShown) {
      closeList();
    }
  }, false);

  // hide results if anywhere outside of the results list or input is clicked
  document.body.addEventListener('click', function(e) {
    if (resultsShown && e.target !== input && e.target.parentNode.parentNode !== results) {
      closeList();
    }
  }, false);

}());
